#!/bin/bash
set -e

echo "Waiting for database to be ready..."
python -c "
import time
from app.db import SessionLocal, engine
from sqlalchemy import text

max_retries = 30
for i in range(max_retries):
    try:
        db = SessionLocal()
        db.execute(text('SELECT 1'))
        db.close()
        print('Database is ready!')
        break
    except Exception as e:
        print(f'Database not ready yet, retrying... ({i+1}/{max_retries})')
        time.sleep(1)
        if i == max_retries - 1:
            raise e
"

echo "Running database migrations..."
export PYTHONPATH=/app:$PYTHONPATH
cd /app/app/migrations
alembic upgrade head

echo "Starting API server..."
cd /app
uvicorn app.main:app --host 0.0.0.0 --port 8000