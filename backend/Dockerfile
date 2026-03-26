# 1. Node.js környezet kiválasztása
FROM node:22-alpine

# 2. Itt fog lakni a kód a konténeren belül
WORKDIR /usr/src/app

# 3. Csak a függőségek listáját másoljuk át először (így gyorsabb a build)
COPY package*.json ./

# 4. Telepítjük a csomagokat
RUN npm install

# 5. Másoljuk az összes többi fájlt
COPY . .

# 6. A port, amin a Node fut (XAMPP-nál ez általában 5000 vagy 8080 volt nálad)
EXPOSE 5000

# 7. Az indító parancs
CMD ["npm", "start"]