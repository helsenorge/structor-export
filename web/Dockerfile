# Multi-stage build med to targets: static og webapp
#   docker build --target static  → helsenorge/skjemabygger/static
#   docker build --target webapp  → helsenorge/skjemabygger/webapp

# Test lokalt (static)
#   1. `docker build -f ./web/Dockerfile --target static --build-arg PAT=$env:HNDEV_PAT -t helsenorge/skjemabygger/static .`
#   2. `docker run -p 8080:8080 --rm -it --name helsenorge-skjemabygger-static helsenorge/skjemabygger/static`
#   3. Test: http://localhost:8080/static_skjemabygger/manifest.json

# Test lokalt (webapp)
#   1. `docker build -f ./web/Dockerfile --target webapp --build-arg PAT=$env:HNDEV_PAT -t helsenorge/skjemabygger/webapp .`
#   2. `docker run -p 8080:8080 --rm -it --name helsenorge-skjemabygger-webapp helsenorge/skjemabygger/webapp`
#   3. Test: http://localhost:8080/

### 1. Avhengigheter (delt mellom static og webapp) ###
FROM helsenorge.azurecr.io/dockerhub/library/node:22-alpine AS deps
    WORKDIR /app
    ARG PAT
    COPY web/package*.json web/.npmrc_docker ./
    #hadolint ignore=DL4006,SC3037
    RUN PAT_ENCODED=$(echo -n "$PAT" | base64 -w 0) && \
        sed -i "s#__REPLACE_ME_PAT__#$PAT_ENCODED#g" .npmrc_docker && \
        npm --userconfig .npmrc_docker ci

### 2a. Build for static (base=/static_skjemabygger/) ###
FROM deps AS build-static
    COPY web/ .
    RUN npm run build

### 2b. Build for webapp (base=/) ###
FROM deps AS build-webapp
    ENV VITE_BASE_PATH=/
    COPY web/ .
    # FIXME: Fjern denne sed-en når static-varianten er faset ut.
    # manifest.json har hardkodet start_url for static. Webapp trenger root-relativ start_url.
    # Når static er borte kan manifest.json oppdateres direkte og denne linjen fjernes.
    RUN sed -i 's|"start_url": "./static_skjemabygger/"|"start_url": "."|' manifest.json && \
        npm run build

### 3a. Static image ###
FROM helsenorge.azurecr.io/helsenorge/common/nginx-static:master AS static
    COPY --from=build-static /app/dist /usr/share/nginx/html/static_skjemabygger
    COPY --from=build-static /app/probe.json /usr/share/nginx/html/probe.json
    COPY --from=build-static /app/nginx.conf /etc/nginx/nginx.conf
    EXPOSE 8080

### 3b. Webapp image ###
FROM helsenorge.azurecr.io/dockerhub/library/nginx:stable-alpine AS webapp
    COPY --from=build-webapp /app/dist /usr/share/nginx/html
    COPY --from=build-webapp /app/probe.json /usr/share/nginx/html/probe.json
    COPY --from=build-webapp /app/nginx.webapp.conf /etc/nginx/nginx.conf
    RUN find /usr/share/nginx/html -type f \( -name "*.js" -o -name "*.css" -o -name "*.html" -o -name "*.json" -o -name "*.svg" -o -name "*.xml" -o -name "*.txt" \) -exec gzip -k -9 {} \;
    EXPOSE 8080
