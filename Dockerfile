FROM node:22-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache openssl

# 1. Copy package files
COPY package*.json ./

# 2. Copy the prisma directory FIRST so 'npm install' can find the schema
COPY prisma ./prisma/

# 3. Install dependencies (this will now successfully run 'prisma generate')
# We use --omit=dev if you want a smaller image, but for tsx we need devDeps
RUN npm install

# 4. Copy the rest of the application code
COPY . .

# Final check to ensure client is generated for the container OS
RUN npx prisma generate

CMD ["npx", "tsx", "Agent.mts"]
