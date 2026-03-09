FROM node:18-slim

# Install pekee ffmpeg na mahitaji madogo bila kufanya upgrade nzito
RUN apt-get update && apt-get install -y \
    ffmpeg \
    imagemagick \
    webp \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files kwanza kwa ajili ya speed
COPY package*.json ./
RUN npm install

# Copy files nyingine zote
COPY . .

# Amri ya kuanza bot
CMD ["node", "index.js"]
