FROM python:3.12-slim

WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y build-essential curl && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

COPY app /app/app
COPY start.sh /app/start.sh

# 使启动脚本可执行
RUN chmod +x /app/start.sh

# 预创建表（生产建议：容器启动脚本中执行 alembic upgrade head）
CMD ["/app/start.sh"]
