FROM node:12

WORKDIR /back_end
COPY ./back_end/src ./src
COPY ./back_end/.env ./
COPY ./back_end/nest-cli.json  ./
COPY ./back_end/package* ./
COPY ./back_end/tsconfig.build.json ./
COPY ./back_end/tsconfig.json ./
COPY ./back_end/files ./files
RUN npm install

CMD [ "npm", "run","start:dev" ]