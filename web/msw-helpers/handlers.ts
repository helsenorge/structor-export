import {
  DefaultBodyType,
  http,
  passthrough,
  HttpResponse,
  HttpHandler,
} from "msw";

import { DataFiles } from "./msw-data-helper";

export type Method =
  | "head"
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "options";

/**
 * Hent liste med paths der .json-respons kan ligge på disk
 * @param url URL til endepunkt
 * @returns Liste med paths
 */
export const getDataPathList = (url: URL): string[] => {
  if (url.pathname.endsWith(".json")) {
    return [];
  }

  const segments = url.pathname
    .split("/")
    .filter((x) => x)
    .reverse();
  const searchParams = Array.from(url.searchParams);
  const endpoint = segments.shift() ?? "";

  const handlers = [`${endpoint}.json`];

  searchParams.forEach(([key, value]) => {
    handlers.push(`${endpoint}/${key}/${value}.json`);
  });

  segments.forEach((segment) => {
    handlers.push(`${segment}/${endpoint}.json`);
    searchParams.forEach(([key, value]) => {
      handlers.push(`${segment}/${endpoint}/${key}/${value}.json`);
    });
  });

  return handlers;
};

/**
 * Les JSON-data fra __data__-mappen
 * @param url URL til endepunkt
 * @param dataFiles Objekt med alle .json-filer som ligger i __data__-mappen og callbacks
 * @param prefix Brukes til å sjekke også undermapper for HTTP-metode, f.eks. post/ eller patch/
 * @returns Promise med JSON-data fra en .json-fil på disk
 */
export const getJsonData = async (
  url: URL,
  dataFiles: DataFiles,
  prefix: string = "",
): Promise<JSON> => {
  const dataPathList = getDataPathList(url);
  const path = Object.keys(dataFiles).find((path) =>
    dataPathList.some((x) => path.endsWith(`${prefix}${x}`)),
  );

  if (!path) {
    return Promise.reject();
  }

  return dataFiles[path]();
};

export const getHandlers = (
  dataFiles: DataFiles,
  prefix: string,
  methods: Method[] = [
    "head",
    "get",
    "post",
    "put",
    "delete",
    "patch",
    "options",
  ],
): HttpHandler[] => {
  const handlers: HttpHandler[] = [
    http.get(`*/${prefix}/*`, async ({ request }) => {
      try {
        const data = await getJsonData(new URL(request.url), dataFiles);

        return HttpResponse.json(data);
      } catch {
        return passthrough();
      }
    }),
  ];

  methods.forEach((method) =>
    handlers.push(
      http[method](`*/${prefix}/*`, async ({ request }) => {
        try {
          const data = await getJsonData(
            new URL(request.url),
            dataFiles,
            `${method}/`,
          );

          return HttpResponse.json(data as DefaultBodyType);
        } catch {
          return passthrough();
        }
      }),
    ),
  );

  return handlers;
};

const handlers = (dataFiles: DataFiles): HttpHandler[] => [
  ...getHandlers(dataFiles, "contentapi", ["get"]),
  ...getHandlers(dataFiles, "proxy"),
  ...getHandlers(dataFiles, "api"),
];

export default handlers;
