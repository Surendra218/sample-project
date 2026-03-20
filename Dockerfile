# Dockerfile with intentional issues

FROM node:14-alpine

WORKDIR /usr/src/app

# BUG: copying package.json but missing package-lock.json
COPY package.json .

RUN npm install --production

# BUG: should be COPY . . to copy all source files
COPY src/ .

# BUG: wrong port exposed (app runs on 3000, but exposing 8080)
EXPOSE 8080

# BUG: incorrect start command path
CMD ["node", "index.js"]
