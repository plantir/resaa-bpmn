#add some comment
FROM docker.resaa.net/node:20-alpine AS build

WORKDIR /app
COPY . .
RUN yarn
RUN yarn build

FROM docker.resaa.net/node:20-alpine AS deploy-node

WORKDIR /app
RUN rm -rf ./*
COPY --from=build /app/package.json .
COPY --from=build /app/build .
RUN yarn --prod
EXPOSE 3000
CMD ["node","index.js"]