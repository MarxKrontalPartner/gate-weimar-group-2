# --- Stage 1: Build Vue App ---
FROM node:20 AS build

WORKDIR /app

# Copy package.json first
COPY ../frontend/package*.json ./
RUN npm install

# Copy entire frontend source and build
COPY ../frontend ./
RUN npm run build

# --- Stage 2: Serve with Nginx ---
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
