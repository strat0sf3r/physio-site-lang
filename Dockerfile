# Dev image — hot-reloading Astro dev server, for local testing.
FROM node:22-slim

WORKDIR /app

# Install deps first so this layer is cached unless package*.json changes
COPY package.json package-lock.json* ./
RUN npm install

# Rest of the source — with docker-compose below, this gets overridden by
# a bind mount anyway, so edits on your Windows machine hot-reload live.
COPY . .

EXPOSE 4321

# --host is required so the dev server is reachable from outside the container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
