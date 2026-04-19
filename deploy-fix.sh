#!/bin/bash

echo "=== Mornify Website Deployment Fix ==="

# Navigate to project
cd ~/Flower-Subscription-Website || exit 1

# Pull latest code
echo "Pulling latest code..."
git pull origin main

# Install website dependencies
echo "Installing website dependencies..."
cd apps/website
npm install

# Build website
echo "Building website..."
npm run build

# Check if build succeeded
if [ ! -d "dist" ]; then
    echo "ERROR: Build failed - dist folder not created"
    exit 1
fi

# Copy to root dist folder
echo "Copying build to root dist folder..."
cd ~/Flower-Subscription-Website
rm -rf dist
cp -r apps/website/dist ./dist

# Set proper permissions
echo "Setting permissions..."
chmod -R 755 dist
chmod 755 /home/ec2-user
chmod 755 /home/ec2-user/Flower-Subscription-Website

# Verify files exist
echo "Verifying deployment..."
ls -la dist/

# Reload Nginx
echo "Reloading Nginx..."
sudo systemctl reload nginx

# Check Nginx status
sudo systemctl status nginx --no-pager

echo "=== Deployment Complete ==="
echo "Visit https://mornify.in to verify"
