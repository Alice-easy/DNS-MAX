# 使用官方Python 3.11基础镜像
FROM python:3.11-slim

# 设置工作目录
WORKDIR /app

# 设置环境变量
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    POETRY_VERSION=1.6.1

# 安装系统依赖
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        curl \
        git \
    && rm -rf /var/lib/apt/lists/*

# 安装Poetry
RUN pip install poetry==$POETRY_VERSION

# 配置Poetry：不创建虚拟环境，将依赖安装到系统Python
RUN poetry config virtualenvs.create false

# 复制Poetry配置文件
COPY pyproject.toml poetry.lock* ./

# 安装Python依赖
RUN poetry install --only=main --no-interaction --no-ansi

# 复制应用代码
COPY . .

# 创建非root用户
RUN addgroup --system app && adduser --system --group app

# 更改应用代码所有者
RUN chown -R app:app /app
USER app

# 暴露端口
EXPOSE 8000

# 健康检查
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# 启动命令
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]