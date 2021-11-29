FROM node AS build
WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM node
RUN yarn global add serve
WORKDIR /app
COPY --from=build /app/build .
CMD ["serve", "-p", "80", "-s", "."]

