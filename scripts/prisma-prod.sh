#!/bin/bash
# Cargar variables de entorno locales
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

echo "🔗 Iniciando túnel SSH seguro a producción (192.168.40.10)..."
sshpass -p "$SERVER_SSH_PASSWORD" ssh -N -L 5433:127.0.0.1:5432 eliam@192.168.40.10 -o StrictHostKeyChecking=no &
SSH_PID=$!

trap "echo '🔌 Cerrando túnel SSH...'; kill $SSH_PID; exit" EXIT INT TERM

sleep 2

echo "🚀 Abriendo Prisma Studio conectado a Producción (Puerto 5555)..."
echo "⚠️  ADVERTENCIA: Estás viendo DATOS REALES DE PRODUCCIÓN. Ten mucho cuidado."
export DATABASE_URL="postgresql://facturdv:secret@localhost:5433/facturdv"
npx prisma studio --port 5555
