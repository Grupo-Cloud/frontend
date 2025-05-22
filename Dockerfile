# Optimización del Dockerfile para producción
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json yarn.lock ./

# Instalar dependencias
RUN yarn install --frozen-lockfile --production=false

# Copiar código fuente
COPY . .

# Configurar variable de entorno para el build
ARG VITE_BACK_URL
ENV VITE_BACK_URL=$VITE_BACK_URL

# Construir la aplicación
RUN yarn build

# Etapa de producción con Caddy
FROM caddy:2-alpine

# Copiar archivos construidos
COPY --from=builder /app/dist /usr/share/caddy

# Copiar configuración de Caddy
COPY Caddyfile /etc/caddy/Caddyfile

# Exponer puerto 80
EXPOSE 80

