!#/bin/sh

set -ex

if [ "$RUNTIME_TYPE" = "webapp" ]; then
  echo "Error: DATABASE_URL environment variable is not set."
  exit 1
elif [ "$RUNTIME_TYPE" = "setup" ]; then
  echo "Running database migrations..."
  npx prisma migrate deploy
else
  echo "Error: RUNTIME_TYPE environment variable must be set to either 'webapp' or 'worker'."
  exit 1
fi