#add some comment
FROM node:16 AS build

WORKDIR /app
COPY . .
RUN yarn
RUN yarn build


FROM steebchen/nginx-spa:stable

COPY --from=build /app/build /app
EXPOSE 80

CMD ["nginx"]