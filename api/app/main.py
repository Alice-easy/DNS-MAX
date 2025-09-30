from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from .models import Base
from .db import engine
from .deps import get_db
from .routers import auth, users, domains, admin
from .schemas import HealthCheck

# 创建数据库表
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Domain Distribution API", 
    description="域名分发系统API",
    version="1.0.0"
)

# CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境应该配置具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 路由
app.include_router(auth.router, prefix="/auth", tags=["认证"])
app.include_router(users.router, prefix="/users", tags=["用户"])
app.include_router(domains.router, prefix="/allocations", tags=["域名分发"])
app.include_router(admin.router, prefix="/admin", tags=["管理员"])

@app.get("/", response_model=HealthCheck)
def root():
    return {"status": "ok"}

@app.get("/healthz", response_model=HealthCheck)
def health_check():
    return {"status": "ok"}

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)}
    )
