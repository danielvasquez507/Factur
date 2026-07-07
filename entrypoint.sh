#!/bin/sh
set -e
echo "Ejecutando migraciones de Prisma en la base de datos de producción..."
npx --yes prisma migrate deploy


echo "Iniciando servidor Next.js..."
exec node server.js
