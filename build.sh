#!/bin/bash

# Build script for Vercel deployment
echo "Building Cranberry Frontend..."

# Navigate to frontend directory
cd Cranberry-Frontend

# Install dependencies
npm install

# Build the project
npm run build

echo "Build completed successfully!"