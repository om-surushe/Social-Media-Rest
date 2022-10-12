# specify the node base image with your desired version node:<version>
FROM node:16
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD node index.js
EXPOSE 8800