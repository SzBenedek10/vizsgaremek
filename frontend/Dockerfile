FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# A Vite alapértelmezetten az 5173-as porton fut, nem a 3000-en!
EXPOSE 5173

# A '--host' kapcsoló KÖTELEZŐ Docker esetén, különben a géped nem éri el a konténert!
CMD ["npm", "run", "dev", "--", "--host"]