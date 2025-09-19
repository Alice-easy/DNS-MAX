# 环境变量配置说明

本文档列出了 `.env.example` 中的关键配置项，并补充了工作流打包镜像相关变量的默认值与用途。完整示例请参考仓库根目录的 `.env.example`。

## 通用配置

| 变量 | 默认值 | 说明 |
| ---- | ------ | ---- |
| `DATABASE_URL` | `postgresql://dns_max_user:dns_max_password@localhost:5432/dns_max` | 后端服务使用的数据库连接串，生产环境需改成强密码及真实数据库主机。 |
| `REDIS_URL` | `redis://localhost:6379/0` | Redis 缓存地址，生产环境可切换为托管 Redis 或容器内服务。 |
| `SECRET_KEY` | `CHANGE_THIS_TO_A_VERY_STRONG_RANDOM_KEY_AT_LEAST_32_CHARS` | JWT 加密密钥，生产部署前必须替换为强随机值。 |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000/api/v1` | 前端访问后端 API 的基础地址，根据部署域名修改。 |

## 部署镜像配置

GitHub Actions 中的 `Auto Package` 工作流会将预构建产物推送到 GHCR。Docker Compose 通过下列变量决定拉取哪一个镜像标签，可按需覆盖：

| 变量 | 默认值 | 说明 |
| ---- | ------ | ---- |
| `BACKEND_IMAGE` | `ghcr.io/your-org/dns-max-backend:latest` | 后端服务镜像，指向自动打包流程产物。覆盖该值可部署指定版本或私有镜像。 |
| `FRONTEND_IMAGE` | `ghcr.io/your-org/dns-max-frontend:latest` | 前端服务镜像，指向自动打包流程产物。覆盖该值可部署指定版本或私有镜像。 |

> 💡 建议在 `.env` 或部署流水线的环境变量中设置上述镜像标签，以确保 `docker-compose pull backend frontend` 能拉取到正确版本。针对临时回滚，也可以在执行 Compose 命令前导出新的标签，例如：
>
> ```bash
> export BACKEND_IMAGE=ghcr.io/your-org/dns-max-backend:v1.2.3
> export FRONTEND_IMAGE=ghcr.io/your-org/dns-max-frontend:v1.2.3
> docker-compose pull backend frontend
> ```

## 其他参考

- `.env.example`：完整的环境变量模板，包含缓存、日志、DNS 服务商等配置项。
- `DEPLOYMENT.md`：详细部署步骤、常用命令以及故障排除指南。