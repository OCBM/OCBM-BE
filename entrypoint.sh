#!/bin/sh
set -e

echo "Current directory: $(pwd)"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Run Prisma migrations
# npm run prisma:migrate
npx prisma migrate deploy
npx prisma generate --schema=/prisma/schema.prisma

# Start your Node.js application
exec npm run start:prod