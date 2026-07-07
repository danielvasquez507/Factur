#!/bin/sh
set -e

echo "Ejecutando migraciones de Prisma en la base de datos de producción..."
# En modo standalone faltan las dependencias de desarrollo como prisma/config
npm install prisma
npx -y prisma migrate deploy

echo "Iniciando servidor Next.js..."
exec node server.js
