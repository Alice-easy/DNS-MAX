from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import func
from app.models import User
from app.schemas.user import UserCreate
from app.core.security import get_password_hash, verify_password


class UserCRUD:
    async def get_by_id(self, db: AsyncSession, user_id: int) -> Optional[User]:
        """根据ID获取用户"""
        result = await db.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()
    
    async def get_by_username(self, db: AsyncSession, username: str) -> Optional[User]:
        """根据用户名获取用户"""
        result = await db.execute(select(User).where(User.username == username))
        return result.scalar_one_or_none()
    
    async def get_user_count(self, db: AsyncSession) -> int:
        """获取用户总数"""
        result = await db.execute(select(func.count(User.id)))
        return result.scalar_one()
    
    async def create(self, db: AsyncSession, user_data: UserCreate) -> User:
        """创建新用户"""
        hashed_password = get_password_hash(user_data.password)
        
        # 检查是否为第一个用户，如果是则设置为管理员
        user_count = await self.get_user_count(db)
        is_first_user = user_count == 0
        
        db_user = User(
            username=user_data.username,
            hashed_password=hashed_password,
            is_admin=is_first_user  # 第一个用户自动成为管理员
        )
        db.add(db_user)
        await db.commit()
        await db.refresh(db_user)
        return db_user
    
    async def authenticate(self, db: AsyncSession, username: str, password: str) -> Optional[User]:
        """用户认证"""
        user = await self.get_by_username(db, username)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user


user_crud = UserCRUD()