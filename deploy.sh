#!/bin/bash

set -e

echo "======================================"
echo "PrimeLabSys deployment started"
echo "======================================"

if ! git diff --quiet HEAD -- package.json pnpm-lock.yaml; then
    echo "Dependency manifests have local changes. Review and reconcile them with Git before deploying." >&2
    exit 1
fi

echo
echo "Fetching the latest changes..."
git fetch origin

echo
echo "Backing up production environment..."

cp .env /tmp/pls.env.bak

echo
echo "Pulling updates..."
git pull --ff-only --no-autostash

echo
echo "Restoring production environment..."

cp /tmp/pls.env.bak .env

echo
echo "Installing dependencies..."
pnpm install --frozen-lockfile --prod=false

echo
echo "Building the application..."
pnpm run build

echo
echo "Restarting PM2..."
pm2 restart all

echo
echo "======================================"
echo "Deployment completed successfully"
echo "======================================"