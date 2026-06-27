FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 4000

# Migrationen laufen zuerst. Bei Fehler wird gewarnt, der Server startet trotzdem –
# so ist der Container immer erreichbar und liefert JSON-Fehler statt nginx-502.
CMD ["sh", "-c", "node src/db/migrate.js || echo 'WARNUNG: Migration fehlgeschlagen, bitte manuell prüfen'; node src/server.js"]
