#!/bin/sh
set -e

# Lockfile のみ更新するときは node_modules を触らない（package.json だけで完結）
for arg in "$@"; do
  if [ "$arg" = "--package-lock-only" ]; then
    exec "$@"
  fi
done

if [ ! -f node_modules/.bin/next ]; then
  echo "Dependencies missing in volume; installing..."
  if [ -f package-lock.json ]; then
    npm ci
  else
    npm install
  fi
fi

exec "$@"
