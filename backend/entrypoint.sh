#!/bin/sh
set -e

# 1. DB が起動して接続可能になるまで待機
until pg_isready -h "$DB_HOST" -p "$DB_PORT"; do
  echo "Waiting for Postgres at $DB_HOST:$DB_PORT..."
  sleep 1
done

# 2. マイグレーション
echo "Running migrations..."
npm run migrate:up

# 3. シード
echo "Running seed scripts..."
npm run seed

# 4. アプリケーション起動
echo "Starting application..."
exec npm run start