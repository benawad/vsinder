FROM node:12

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

ENV NODE_ENV production
CMD [ "node", "dist/index.js" ]
USER node