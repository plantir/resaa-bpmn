#add some comment
FROM prod-docker.resaa.net/node:18-alpine AS build

WORKDIR /app
COPY . .
RUN yarn
ENV VITE_BASE_URL=http://172.16.100.203
ENV VITE_API_URL=http://172.16.100.204
RUN yarn build

FROM prod-docker.resaa.net/node:18-alpine AS deploy-node

WORKDIR /app
RUN rm -rf ./*
COPY --from=build /app/package.json .
COPY --from=build /app/build .
RUN yarn --prod
EXPOSE 3000
CMD ["node","index.js"]