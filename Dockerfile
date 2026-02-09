# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el código fuente
COPY . .

# Recibir variables de build y crear environment.production.ts
ARG TMDB_API_URL=https://api.themoviedb.org/3
ARG TMDB_API_TOKEN=YOUR_API_TOKEN

RUN mkdir -p src/environments && \
    echo "export const environment = { \
      production: true, \
      apiUrl: '$TMDB_API_URL', \
      apiToken: '$TMDB_API_TOKEN' \
    };" > src/environments/environment.production.ts

# Compilar la aplicación Angular
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remover configuración default de nginx
RUN rm /etc/nginx/conf.d/default.conf

# Crear configuración personalizada para Angular SPA
RUN echo 'server { \
    listen 80 default_server; \
    listen [::]:80 default_server; \
    root /usr/share/nginx/html; \
    index index.html; \
    gzip on; \
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json; \
    gzip_min_length 1000; \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
        try_files $uri =404; \
    } \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location = /index.html { \
        expires -1; \
        add_header Cache-Control "public, must-revalidate, proxy-revalidate"; \
    } \
    add_header X-Frame-Options "SAMEORIGIN" always; \
    add_header X-Content-Type-Options "nosniff" always; \
    add_header X-XSS-Protection "1; mode=block" always; \
}' > /etc/nginx/conf.d/default.conf

# Copiar archivos compilados de Angular (en la carpeta browser)
COPY --from=builder /app/dist/Wwatch/browser /usr/share/nginx/html

# Exponer puerto
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Comando para servir con Nginx
CMD ["nginx", "-g", "daemon off;"]
