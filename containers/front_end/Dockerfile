FROM node:12 AS front_end

WORKDIR /front_end
COPY ./front_end/package*.json ./
COPY ./front_end/craco.config.js ./
COPY ./front_end/tsconfig.json ./
COPY ./front_end/.eslintrc ./
COPY ./front_end/server.js ./
COPY ./front_end/public ./public
COPY ./front_end/src ./src

RUN npm install
RUN npm run build
CMD [ "npm", "run","start:dev" ]

