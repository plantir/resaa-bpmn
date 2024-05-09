#add some comment
FROM node:18-alpine AS build

WORKDIR /app
COPY . .
RUN yarn
RUN yarn build

FROM node:18-alpine AS deploy-node

WORKDIR /app
RUN rm -rf ./*
COPY --from=build /app/package.json .
COPY --from=build /app/build .
RUN yarn --prod
ENV VITE_BASE_URL=http://localhost:5174
ENV VITE_API_URL=http://172.16.100.204
EXPOSE 3000
CMD ["node","index.js"]