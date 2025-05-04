FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock .
RUN yarn

COPY . .

RUN yarn build

# Stage 2: Serve with Caddy
FROM caddy:2-alpine

# Copy build output
COPY --from=builder /app/dist /usr/share/caddy

# Add a simple Caddyfile
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80
