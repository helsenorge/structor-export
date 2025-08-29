import fs from "fs";
import path from "path";

export type DataFiles = Record<string, () => Promise<JSON>>;

const fromDir = (startPath: string, filter: string): string[] => {
  const found: string[] = [];

  const cb = (startPath: string, filter: string): string[] => {
    const files = fs.readdirSync(startPath);
    for (let i = 0; i < files.length; i++) {
      const filename = path.join(startPath, files[i]);
      const stat = fs.lstatSync(filename);
      if (stat.isDirectory()) {
        cb(filename, filter); //recurse
      } else if (filename.endsWith(filter)) {
        found.push(filename);
      }
    }

    return found;
  };

  cb(startPath, filter);

  return found;
};

export const getDataFiles = (path: string): DataFiles =>
  fromDir(path, ".json").reduce((acc, file) => {
    acc[file] = (): Promise<JSON> => import(file);

    return acc;
  }, {} as DataFiles);
