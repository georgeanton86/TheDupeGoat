#!/usr/bin/env bash
set -euo pipefail

# The post-merge setup runs against the development database only.
# Production schema changes are applied by Replit's Publish flow.
if [[ "${NODE_ENV:-}" == "production" ]]; then
  echo "Refusing to run development database migration in production" >&2
  exit 1
fi

: "${DATABASE_URL:?DATABASE_URL is required}"
psql -X "$DATABASE_URL" -v ON_ERROR_STOP=1 -f migrations/0001_chicago_reservations.sql
psql -X "$DATABASE_URL" -v ON_ERROR_STOP=1 -f migrations/0002_checkout_retry.sql