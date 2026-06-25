FROM node:20-alpine
WORKDIR /app

# Copy package files and install all dependencies (including devDependencies for TypeScript)
COPY package*.json ./
RUN npm install

# Copy all other project files
COPY . .

# Build the TypeScript code into the /dist folder
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
