FROM node:16.13.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm rebuild node-sass

COPY . .

CMD ["npm", "run", "start:dev"]