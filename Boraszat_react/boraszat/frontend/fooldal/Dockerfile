FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# A React alapértelmezetten a 3000-esen fut
EXPOSE 3000

CMD ["npm", "run", "dev"]