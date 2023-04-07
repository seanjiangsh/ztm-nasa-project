FROM node:lts-alpine
WORKDIR /app

# * use multiple layers
# * copy package.json and package-lock.json
COPY package*.json ./

COPY client/package*.json client/
RUN npm run install-client

COPY server/package*.json server/
RUN npm run install-server

COPY server/ server/

COPY client/ client/
RUN npm run build --prefix client

USER node
CMD [ "npm", "start", "--prefix", "server" ]
EXPOSE 5000
