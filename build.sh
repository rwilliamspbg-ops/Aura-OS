#!/bin/bash

# Exit on any error
set -e

echo "🚀 Starting full build for Aura-OS..."

# 1. Fix Git Safe Directory (prevents Exit Code 128)
echo "🔧 Configuring Git safety..."
git config --global --add safe.directory $(pwd)

# 2. Install Dependencies (Root)
echo "📦 Installing root dependencies..."
npm install

# 3. Build & Test Backend
echo "⚙️ Building Backend..."
cd backend
npm install
npm test --if-present
cd ..

# 4. Build & Test Frontend
echo "💻 Building Frontend..."
cd frontend
npm install
npm test --if-present
cd ..

# 5. Build Docker Images (Lowercase names for registry compliance)
echo "🐳 Building Docker images..."
docker build -t ghcr.io/rwilliamspbg-ops/aura-os/backend:latest ./backend
docker build -t ghcr.io/rwilliamspbg-ops/aura-os/frontend:latest ./frontend

# 6. Deploy (Optional - Local)
echo "🚀 Starting services with Docker Compose..."
docker compose up -d

echo "✅ Full build and deployment completed successfully!"
