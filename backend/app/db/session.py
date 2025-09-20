from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import text
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class Base(DeclarativeBase):
    """SQLAlchemy 基础模型类"""
    pass


# 创建异步数据库引擎
def create_database_engine():
    """创建数据库引擎"""
    engine_kwargs = {
        'echo': settings.debug,
        'future': True,
    }
    
    # 根据是否为本地数据库调整连接池配置
    if settings.is_local_database:
        engine_kwargs.update({
            'pool_size': 5,
            'max_overflow': 10,
            'pool_pre_ping': True,  # 连接前检查连接有效性
            'pool_recycle': 3600,   # 1小时后回收连接
        })
        logger.info("配置本地PostgreSQL连接池")
    else:
        engine_kwargs.update({
            'pool_size': 10,
            'max_overflow': 20,
            'pool_pre_ping': True,
            'pool_recycle': 1800,   # 30分钟后回收连接
        })
        logger.info("配置Docker PostgreSQL连接池")
    
    engine = create_async_engine(settings.database_url, **engine_kwargs)
    return engine


engine = create_database_engine()

# 创建异步会话工厂
async_session_maker = async_sessionmaker(
    engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)


async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    """获取异步数据库会话"""
    async with async_session_maker() as session:
        try:
            yield session
        except Exception as e:
            logger.error(f"数据库会话错误: {e}")
            await session.rollback()
            raise
        finally:
            await session.close()


async def check_database_connection() -> bool:
    """检查数据库连接"""
    try:
        async with async_session_maker() as session:
            result = await session.execute(text("SELECT 1"))
            result.scalar()
            logger.info(f"数据库连接成功 - {settings.database_info['type']}")
            return True
    except Exception as e:
        logger.error(f"数据库连接失败: {e}")
        return False


async def initialize_database():
    """初始化数据库"""
    try:
        # 检查连接
        if not await check_database_connection():
            raise Exception("数据库连接失败")
        
        # 创建表结构
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        
        logger.info("数据库初始化完成")
        return True
    except Exception as e:
        logger.error(f"数据库初始化失败: {e}")
        return False