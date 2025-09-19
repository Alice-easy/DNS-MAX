@echo off
setlocal enabledelayedexpansion

REM ===========================================
REM DNS-Max Docker 部署脚本 (Windows)
REM ===========================================
REM 此脚本用于简化不同环境的 Docker 部署

set "SCRIPT_NAME=%~nx0"

REM 显示帮助信息
:show_help
echo DNS-Max Docker 部署脚本 (Windows)
echo.
echo 用法:
echo   %SCRIPT_NAME% [命令] [选项]
echo.
echo 命令:
echo   dev         启动本地开发环境 (使用 docker-compose.yml)
echo   prod        启动生产环境 (使用 docker-compose.registry.yml)
echo   stop        停止所有服务
echo   clean       清理所有容器和数据卷 (谨慎使用!)
echo   logs        查看服务日志
echo   status      查看服务状态
echo   update      更新生产环境镜像
echo   login       登录到 GitHub Container Registry
echo   help        显示此帮助信息
echo.
echo 示例:
echo   %SCRIPT_NAME% dev              # 启动本地开发环境
echo   %SCRIPT_NAME% prod             # 启动生产环境
echo   %SCRIPT_NAME% logs backend     # 查看后端服务日志
echo   %SCRIPT_NAME% update           # 更新生产环境镜像
goto :eof

REM 检查 Docker 和 Docker Compose
:check_dependencies
docker --version >nul 2>&1
if !errorlevel! neq 0 (
    echo [ERROR] Docker 未安装。请先安装 Docker。
    exit /b 1
)

docker-compose --version >nul 2>&1
if !errorlevel! equ 0 (
    set "COMPOSE_CMD=docker-compose"
    goto :eof
)

docker compose version >nul 2>&1
if !errorlevel! equ 0 (
    set "COMPOSE_CMD=docker compose"
    goto :eof
)

echo [ERROR] Docker Compose 未安装。请先安装 Docker Compose。
exit /b 1

REM 启动开发环境
:start_dev
echo [INFO] 启动本地开发环境...
call :check_dependencies

echo [INFO] 构建并启动服务...
%COMPOSE_CMD% -f docker-compose.yml up -d --build

if !errorlevel! equ 0 (
    echo [SUCCESS] 开发环境启动完成!
    echo [INFO] 服务访问地址:
    echo   - 前端: http://localhost:3000
    echo   - 后端 API: http://localhost:8000
    echo   - API 文档: http://localhost:8000/docs
    echo   - PostgreSQL: localhost:5432
    echo   - Redis: localhost:6379
) else (
    echo [ERROR] 启动失败!
    exit /b 1
)
goto :eof

REM 启动生产环境
:start_prod
echo [INFO] 启动生产环境...
call :check_dependencies

if not exist "docker-compose.registry.yml" (
    echo [ERROR] docker-compose.registry.yml 文件不存在!
    exit /b 1
)

echo [INFO] 拉取最新镜像...
%COMPOSE_CMD% -f docker-compose.registry.yml pull

echo [INFO] 启动服务...
%COMPOSE_CMD% -f docker-compose.registry.yml up -d

if !errorlevel! equ 0 (
    echo [SUCCESS] 生产环境启动完成!
    echo [INFO] 服务访问地址:
    echo   - 前端: http://localhost:3000
    echo   - 后端 API: http://localhost:8000
    echo   - API 文档: http://localhost:8000/docs
) else (
    echo [ERROR] 启动失败!
    exit /b 1
)
goto :eof

REM 停止服务
:stop_services
echo [INFO] 停止所有服务...
call :check_dependencies

if exist "docker-compose.yml" (
    %COMPOSE_CMD% -f docker-compose.yml down
)

if exist "docker-compose.registry.yml" (
    %COMPOSE_CMD% -f docker-compose.registry.yml down
)

echo [SUCCESS] 所有服务已停止
goto :eof

REM 清理环境
:clean_environment
echo [WARNING] 这将删除所有容器、镜像和数据卷!
set /p "confirm=确定要继续吗? (y/N): "
if /i not "!confirm!"=="y" (
    echo [INFO] 操作已取消
    goto :eof
)

echo [INFO] 清理环境...
call :check_dependencies

if exist "docker-compose.yml" (
    %COMPOSE_CMD% -f docker-compose.yml down -v --rmi local
)

if exist "docker-compose.registry.yml" (
    %COMPOSE_CMD% -f docker-compose.registry.yml down -v
)

echo [SUCCESS] 环境清理完成
goto :eof

REM 查看日志
:view_logs
set "service=%~2"
call :check_dependencies

if "!service!"=="" (
    echo [INFO] 查看所有服务日志...
    %COMPOSE_CMD% -f docker-compose.yml logs -f
) else (
    echo [INFO] 查看 !service! 服务日志...
    %COMPOSE_CMD% -f docker-compose.yml logs -f !service!
)
goto :eof

REM 查看状态
:show_status
echo [INFO] 服务状态:
call :check_dependencies

%COMPOSE_CMD% -f docker-compose.yml ps 2>nul
if !errorlevel! neq 0 (
    %COMPOSE_CMD% -f docker-compose.registry.yml ps 2>nul
    if !errorlevel! neq 0 (
        echo [WARNING] 没有找到运行中的服务
    )
)
goto :eof

REM 更新生产环境
:update_prod
echo [INFO] 更新生产环境镜像...
call :check_dependencies

if not exist "docker-compose.registry.yml" (
    echo [ERROR] docker-compose.registry.yml 文件不存在!
    exit /b 1
)

echo [INFO] 拉取最新镜像...
%COMPOSE_CMD% -f docker-compose.registry.yml pull

echo [INFO] 重启服务...
%COMPOSE_CMD% -f docker-compose.registry.yml up -d

echo [SUCCESS] 生产环境更新完成!
goto :eof

REM 登录到镜像仓库
:login_registry
echo [INFO] 登录到 GitHub Container Registry...
echo 请输入您的 GitHub Personal Access Token:
docker login ghcr.io
if !errorlevel! equ 0 (
    echo [SUCCESS] 登录成功!
) else (
    echo [ERROR] 登录失败!
    exit /b 1
)
goto :eof

REM 主函数
if "%~1"=="" goto show_help
if "%~1"=="help" goto show_help
if "%~1"=="-h" goto show_help
if "%~1"=="--help" goto show_help

if "%~1"=="dev" goto start_dev
if "%~1"=="prod" goto start_prod
if "%~1"=="stop" goto stop_services
if "%~1"=="clean" goto clean_environment
if "%~1"=="logs" goto view_logs
if "%~1"=="status" goto show_status
if "%~1"=="update" goto update_prod
if "%~1"=="login" goto login_registry

echo [ERROR] 未知命令: %~1
echo.
goto show_help