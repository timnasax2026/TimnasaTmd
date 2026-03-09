FROM node:18-slim

# Sakinisha ffmpeg pekee, bila upgrade ya OS kuzuia error 100
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package.json .

# Kulazimisha installation hata kama kuna migongano (Inatatua error 254)
RUN npm install --quiet --no-progress --legacy-peer-deps

COPY . .

# Amri ya kuanza
CMD ["node", "index.js"]
