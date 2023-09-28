FROM node:16-alpine3.18

WORKDIR /app

COPY package*.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 3030

CMD [ "yarn" , "run" , "start:dev" ]
