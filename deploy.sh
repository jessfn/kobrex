#!/usr/bin/env bash
set -euo pipefail

# Script de despliegue manual para Kobrex en el VPS.
# Ejecutar desde /var/www/kobrex vía SSH: bash deploy.sh

echo "==> Pulling latest changes..."
git pull origin main

echo "==> Installing dependencies..."
npm ci

echo "==> Running database migrations..."
npx prisma migrate deploy

echo "==> Building (clean, sin cache de Turbopack)..."
rm -rf .next
npm run build

echo "==> Restarting app with PM2..."
pm2 startOrRestart ecosystem.config.js --update-env

echo "==> Done. Current status:"
pm2 status kobrex
