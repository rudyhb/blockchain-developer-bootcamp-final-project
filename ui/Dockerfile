FROM node AS build
WORKDIR /app
COPY . .
RUN yarn build

FROM node
RUN yarn global add serve
WORKDIR /app
COPY --from=build /app/build .
CMD ["serve", "-p", "80", "-s", "."]

