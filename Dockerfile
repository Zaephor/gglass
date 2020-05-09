## Build everything
FROM lsiobase/alpine:3.11 as build
COPY . /project
RUN \
    apk add --no-cache git nodejs npm && \
    cd /project && npm ci && npm run postinstall && npm run build && npm run clean && rm -R node_modules && \
    rm -R \
        /project/packages/gglass/*.md \
        /project/packages/gglass/.[a-z]* \
        /project/packages/gglass/__tests__ \
        /project/packages/gglass/public \
        /project/packages/gglass/src \
        /project/packages/gglass/tsconfig.json

# Pull results together and install production npm packages for server
FROM lsiobase/alpine:3.11 as combine
ARG BUILD_GUI=gui-quasar
ENV NODE_ENV="production"
COPY --from=build /project/packages/gglass /app
COPY --from=build /project/packages/${BUILD_GUI}/dist/spa /app/public
RUN \
    apk add --no-cache git nodejs npm && \
    cd /app && npm ci --production && \
    chown -R 911:911 /app

## Put results together
FROM lsiobase/alpine:3.11
ENV NODE_ENV="production"
RUN \
    apk add --no-cache \
        nodejs \
        redis curl
COPY .s6/ /
COPY --from=combine /app /app
#COPY --from=build /project/packages/gglass /app
#COPY --from=build /project/packages/${BUILD_GUI}/dist/spa /app/public

HEALTHCHECK --interval=30s --timeout=3s \
  CMD /usr/bin/curl -s -f http://localhost:${PORT:-8080}/api/status || exit 1
