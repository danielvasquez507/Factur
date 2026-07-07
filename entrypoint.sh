#!/bin/sh
set -e
echo "Ejecutando migraciones de Prisma en la base de datos de producción..."
npx --yes prisma@6.4.1 migrate deploy


echo "Iniciando servidor Next.js..."
exec node server.js
