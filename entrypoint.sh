#!/bin/sh
set -e

echo "Ejecutando migraciones de Prisma en la base de datos de producción..."
# En modo standalone, npx descargará la CLI si no está cacheada, 
# o puedes usar la ruta directa ./node_modules/.bin/prisma si existiera.
npx prisma migrate deploy

echo "Iniciando servidor Next.js..."
exec node server.js
