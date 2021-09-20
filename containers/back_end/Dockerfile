FROM node:12 AS back_end

# Create app directory
WORKDIR /back_end


COPY ./back_end/src ./src
COPY ./back_end/.env ./
COPY ./back_end/nest-cli.json  ./
COPY ./back_end/package* ./
COPY ./back_end/tsconfig.build.json ./
COPY ./back_end/tsconfig.json ./
COPY ./back_end/files ./files

# If you are building your code for production
# RUN npm ci --only=production

RUN npm install

EXPOSE 6000
CMD [ "npm", "run","start:dev" ]