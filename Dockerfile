FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY dist ./dist
COPY data ./data
COPY public ./public
EXPOSE 3000
CMD ["node", "dist/index.js"]
