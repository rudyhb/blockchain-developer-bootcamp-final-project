FROM node:16

WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
RUN npm ci

COPY . .

CMD [ "node", "index.js" ]
