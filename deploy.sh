#!/bin/bash

# ===========================================
# DNS-Max Docker 部署脚本
# ===========================================
# 此脚本用于简化不同环境的 Docker 部署

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印彩色消息
print_message() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 显示帮助信息
show_help() {
    echo "DNS-Max Docker 部署脚本"
    echo ""
    echo "用法:"
    echo "  $0 [命令] [选项]"
    echo ""
    echo "命令:"
    echo "  dev         启动本地开发环境 (使用 docker-compose.yml)"
    echo "  prod        启动生产环境 (使用 docker-compose.registry.yml)"
    echo "  stop        停止所有服务"
    echo "  clean       清理所有容器和数据卷 (谨慎使用!)"
    echo "  logs        查看服务日志"
    echo "  status      查看服务状态"
    echo "  update      更新生产环境镜像"
    echo "  login       登录到 GitHub Container Registry"
    echo ""
    echo "选项:"
    echo "  -h, --help  显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 dev              # 启动本地开发环境"
    echo "  $0 prod             # 启动生产环境"
    echo "  $0 logs backend     # 查看后端服务日志"
    echo "  $0 update           # 更新生产环境镜像"
}

# 检查 Docker 和 Docker Compose
check_dependencies() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker 未安装。请先安装 Docker。"
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose 未安装。请先安装 Docker Compose。"
        exit 1
    fi
}

# 获取 Docker Compose 命令
get_compose_cmd() {
    if docker compose version &> /dev/null; then
        echo "docker compose"
    else
        echo "docker-compose"
    fi
}

# 启动开发环境
start_dev() {
    print_message "启动本地开发环境..."
    local compose_cmd=$(get_compose_cmd)
    
    print_message "构建并启动服务..."
    $compose_cmd -f docker-compose.yml up -d --build
    
    print_success "开发环境启动完成!"
    print_message "服务访问地址:"
    echo "  - 前端: http://localhost:3000"
    echo "  - 后端 API: http://localhost:8000"
    echo "  - API 文档: http://localhost:8000/docs"
    echo "  - PostgreSQL: localhost:5432"
    echo "  - Redis: localhost:6379"
}

# 启动生产环境
start_prod() {
    print_message "启动生产环境..."
    local compose_cmd=$(get_compose_cmd)
    
    if [ ! -f "docker-compose.registry.yml" ]; then
        print_error "docker-compose.registry.yml 文件不存在!"
        exit 1
    fi
    
    print_message "拉取最新镜像..."
    $compose_cmd -f docker-compose.registry.yml pull
    
    print_message "启动服务..."
    $compose_cmd -f docker-compose.registry.yml up -d
    
    print_success "生产环境启动完成!"
    print_message "服务访问地址:"
    echo "  - 前端: http://localhost:3000"
    echo "  - 后端 API: http://localhost:8000"
    echo "  - API 文档: http://localhost:8000/docs"
}

# 停止服务
stop_services() {
    print_message "停止所有服务..."
    local compose_cmd=$(get_compose_cmd)
    
    if [ -f "docker-compose.yml" ]; then
        $compose_cmd -f docker-compose.yml down
    fi
    
    if [ -f "docker-compose.registry.yml" ]; then
        $compose_cmd -f docker-compose.registry.yml down
    fi
    
    print_success "所有服务已停止"
}

# 清理环境
clean_environment() {
    print_warning "这将删除所有容器、镜像和数据卷!"
    read -p "确定要继续吗? (y/N): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_message "操作已取消"
        return
    fi
    
    print_message "清理环境..."
    local compose_cmd=$(get_compose_cmd)
    
    if [ -f "docker-compose.yml" ]; then
        $compose_cmd -f docker-compose.yml down -v --rmi local
    fi
    
    if [ -f "docker-compose.registry.yml" ]; then
        $compose_cmd -f docker-compose.registry.yml down -v
    fi
    
    print_success "环境清理完成"
}

# 查看日志
view_logs() {
    local service=$1
    local compose_cmd=$(get_compose_cmd)
    
    if [ -z "$service" ]; then
        print_message "查看所有服务日志..."
        if [ -f "docker-compose.registry.yml" ] && $compose_cmd -f docker-compose.registry.yml ps -q > /dev/null 2>&1; then
            $compose_cmd -f docker-compose.registry.yml logs -f
        else
            $compose_cmd -f docker-compose.yml logs -f
        fi
    else
        print_message "查看 $service 服务日志..."
        if [ -f "docker-compose.registry.yml" ] && $compose_cmd -f docker-compose.registry.yml ps -q $service > /dev/null 2>&1; then
            $compose_cmd -f docker-compose.registry.yml logs -f $service
        else
            $compose_cmd -f docker-compose.yml logs -f $service
        fi
    fi
}

# 查看状态
show_status() {
    print_message "服务状态:"
    local compose_cmd=$(get_compose_cmd)
    
    if [ -f "docker-compose.registry.yml" ] && $compose_cmd -f docker-compose.registry.yml ps -q > /dev/null 2>&1; then
        $compose_cmd -f docker-compose.registry.yml ps
    elif [ -f "docker-compose.yml" ]; then
        $compose_cmd -f docker-compose.yml ps
    else
        print_warning "没有找到运行中的服务"
    fi
}

# 更新生产环境
update_prod() {
    print_message "更新生产环境镜像..."
    local compose_cmd=$(get_compose_cmd)
    
    if [ ! -f "docker-compose.registry.yml" ]; then
        print_error "docker-compose.registry.yml 文件不存在!"
        exit 1
    fi
    
    print_message "拉取最新镜像..."
    $compose_cmd -f docker-compose.registry.yml pull
    
    print_message "重启服务..."
    $compose_cmd -f docker-compose.registry.yml up -d
    
    print_success "生产环境更新完成!"
}

# 登录到镜像仓库
login_registry() {
    print_message "登录到 GitHub Container Registry..."
    echo "请输入您的 GitHub Personal Access Token:"
    docker login ghcr.io
    print_success "登录成功!"
}

# 主函数
main() {
    check_dependencies
    
    case "$1" in
        "dev")
            start_dev
            ;;
        "prod")
            start_prod
            ;;
        "stop")
            stop_services
            ;;
        "clean")
            clean_environment
            ;;
        "logs")
            view_logs "$2"
            ;;
        "status")
            show_status
            ;;
        "update")
            update_prod
            ;;
        "login")
            login_registry
            ;;
        "-h"|"--help"|"")
            show_help
            ;;
        *)
            print_error "未知命令: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# 运行主函数
main "$@"