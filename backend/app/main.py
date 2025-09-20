from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router
from app.db.session import initialize_database, check_database_connection
import logging

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理"""
    # 启动时执行
    logger.info(f"启动 {settings.app_name}")
    logger.info(f"数据库配置: {settings.database_info}")
    
    # 初始化数据库
    if not await initialize_database():
        logger.error("数据库初始化失败，应用无法启动")
        raise Exception("数据库初始化失败")
    
    logger.info("应用启动完成")
    yield
    
    # 关闭时执行
    logger.info("应用关闭")


app = FastAPI(
    title=settings.app_name,
    description="域名二次分发系统 API",
    version="1.0.0",
    openapi_url="/api/v1/openapi.json",
    docs_url="/api/v1/docs",
    redoc_url="/api/v1/redoc",
    lifespan=lifespan
)

# 设置CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 包含API路由
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def root():
    """根端点"""
    return {
        "message": "DNS Max API",
        "version": "1.0.0",
        "docs": "/api/v1/docs",
        "database": settings.database_info
    }


@app.get("/health")
async def health_check():
    """健康检查端点"""
    db_status = await check_database_connection()
    if not db_status:
        raise HTTPException(status_code=503, detail="Database connection failed")
    
    return {
        "status": "healthy",
        "database": "connected",
        "database_type": settings.database_info['type']
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)