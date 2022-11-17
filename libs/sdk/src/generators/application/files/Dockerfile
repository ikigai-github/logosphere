FROM node:lts-alpine AS builder
RUN corepack enable && \
    corepack prepare pnpm@6.35.0 --activate

ARG NPM_TOKEN

WORKDIR /app
COPY ./apps/<%= name %> /app
COPY ./libs/codegen/<%= name %>/src/gql /app
COPY ./libs/codegen/<%= name %>/src/fluree /app
RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > .npmrc && \
    pnpm install --production && \
    pnpm install tslib && \
    rm -f .npmrc

FROM node:lts-alpine 
RUN  apk update && \
     apk add -q -f dumb-init && \
     rm -rf /var/cache/apk/*

WORKDIR /app
COPY --from=builder --chown=node:node /app ./

USER node
CMD dumb-init node ./main.js