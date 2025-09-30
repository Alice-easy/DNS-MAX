#!/bin/bash

# 域名分发系统部署脚本

echo "=== 域名分发系统部署开始 ==="

# 检查是否存在 .env 文件
if [ ! -f .env ]; then
    echo "错误：未找到 .env 文件"
    echo "请复制 env.example 为 .env 并配置相关参数"
    exit 1
fi

echo "1. 构建镜像..."
docker compose build

echo "2. 启动服务..."
docker compose up -d

echo "3. 等待服务启动..."
sleep 30

echo "4. 检查服务状态..."
docker compose ps

echo "=== 部署完成 ==="
echo "前端地址：请查看您的域名配置"
echo "API文档：https://api.yourdomain.com/docs"
echo ""
echo "首次使用说明："
echo "1. 访问前端进行注册"
echo "2. 首个注册用户将自动成为管理员"
echo "3. 验证邮箱后即可正常使用"
