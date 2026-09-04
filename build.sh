#!/bin/bash

# Vercel Build Verification Script
echo "🚀 Starting Cranberry Marketplace build..."

# Check if we're in the correct directory
if [ ! -d "Cranberry-Frontend" ]; then
    echo "❌ Error: Cranberry-Frontend directory not found!"
    exit 1
fi

# Navigate to frontend directory
cd Cranberry-Frontend

echo "📦 Installing dependencies..."
npm ci

echo "🏗️ Building the project..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed: dist directory not found!"
    exit 1
fi

echo "✅ Build completed successfully!"
echo "📁 Build output is in Cranberry-Frontend/dist/"

# List key files
echo "📋 Key files in build:"
ls -la dist/

echo "🎉 Ready for Vercel deployment!"
