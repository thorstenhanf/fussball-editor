FROM node:20-alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install --legacy-peer-deps && npm install @rollup/rollup-linux-x64-musl --optional
COPY . .
# Leer = relative URLs (/api/...) → nginx proxiert intern zum Backend
ARG VITE_API_BASE_URL=
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
