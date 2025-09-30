FROM python:3.12-slim

WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y build-essential curl && rm -rf /var/lib/apt/lists/*

COPY api/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

COPY api/app /app/app

# 预创建表（生产建议：容器启动脚本中执行 alembic upgrade head）
CMD ["bash", "-lc", "alembic -c app/migrations/alembic.ini upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
