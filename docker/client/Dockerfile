FROM node:20-alpine
WORKDIR /app
COPY client/package*.json .
RUN npm install
COPY client/. .
EXPOSE 5173
ENTRYPOINT ["npm", "run","dev","--", "--port=5173", "--host=0.0.0.0"]