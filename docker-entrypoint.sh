#!/bin/sh
set -e
echo "Menjalankan migrasi Prisma..."
npx prisma migrate deploy
exec "$@"