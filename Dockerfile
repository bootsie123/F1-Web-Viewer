FROM node:12-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./

# Add Tini
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]

RUN apk add --no-cache g++ make python

RUN npm ci
RUN npm install --only=dev

COPY . .

RUN npm run build

EXPOSE 3000
CMD ["node", "functions/server.js"]

USER node
