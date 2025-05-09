FROM node:20-alpine
WORKDIR /app
COPY client/package*.json .
RUN npm install
COPY client/. .
ENTRYPOINT ["npm", "run","dev"]