.PHONY: help dev build start stop clean logs

help: ## 显示帮助信息
	@echo "域名分发系统 - 可用命令："
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev: ## 启动开发环境
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build

build: ## 构建生产镜像
	docker compose build

start: ## 启动生产环境
	docker compose up -d

stop: ## 停止所有服务
	docker compose down

clean: ## 清理容器和镜像
	docker compose down -v --rmi all

logs: ## 查看日志
	docker compose logs -f

restart: ## 重启服务
	docker compose restart

db-shell: ## 连接数据库
	docker compose exec db psql -U $(POSTGRES_USER) -d $(POSTGRES_DB)

api-shell: ## 进入API容器
	docker compose exec api bash

web-shell: ## 进入Web容器  
	docker compose exec web sh

backup-db: ## 备份数据库
	docker compose exec db pg_dump -U $(POSTGRES_USER) $(POSTGRES_DB) > backup_$(shell date +%Y%m%d_%H%M%S).sql

init: ## 初始化项目（复制环境变量模板）
	@if [ ! -f .env ]; then cp env.example .env && echo "已创建 .env 文件，请编辑配置"; else echo ".env 文件已存在"; fi
