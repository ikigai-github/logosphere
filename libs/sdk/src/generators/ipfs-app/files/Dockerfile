FROM node:lts-alpine

WORKDIR /app

COPY --chown=node:node /dist/<%= root %>  /app
COPY --chown=node:node .npmrc .npmrc

RUN corepack enable && \
    corepack prepare pnpm@8.3.1 --activate
RUN cp .npmrc .npmrc.tmp && \
    cat .npmrc.tmp | grep _authToken > .npmrc && \
    pnpm install --production && \
    rm -f .npmrc .npmrc.tmp
RUN apk update && \
    apk add -q -f dumb-init && \
    rm -rf /var/cache/apk/*

USER node
CMD dumb-init node main.js