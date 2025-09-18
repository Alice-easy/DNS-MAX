from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.models import DNSProvider, Domain, DNSRecord
from app.schemas.dns import ProviderCreate, DomainCreate, DNSRecordCreate, DNSRecordUpdate
from app.core.security import encrypt_credentials, decrypt_credentials


class DNSProviderCRUD:
    async def get_by_user(self, db: AsyncSession, user_id: int) -> List[DNSProvider]:
        """获取用户的所有DNS服务商"""
        result = await db.execute(
            select(DNSProvider).where(DNSProvider.user_id == user_id)
        )
        return result.scalars().all()
    
    async def get_by_id(self, db: AsyncSession, provider_id: int, user_id: int) -> Optional[DNSProvider]:
        """根据ID获取DNS服务商"""
        result = await db.execute(
            select(DNSProvider).where(
                DNSProvider.id == provider_id,
                DNSProvider.user_id == user_id
            )
        )
        return result.scalar_one_or_none()
    
    async def create(self, db: AsyncSession, provider_data: ProviderCreate, user_id: int) -> DNSProvider:
        """创建DNS服务商凭证"""
        encrypted_creds = encrypt_credentials(provider_data.credentials)
        db_provider = DNSProvider(
            user_id=user_id,
            provider_name=provider_data.provider_name,
            encrypted_credentials=encrypted_creds
        )
        db.add(db_provider)
        await db.commit()
        await db.refresh(db_provider)
        return db_provider
    
    async def delete(self, db: AsyncSession, provider_id: int, user_id: int) -> bool:
        """删除DNS服务商"""
        result = await db.execute(
            select(DNSProvider).where(
                DNSProvider.id == provider_id,
                DNSProvider.user_id == user_id
            )
        )
        provider = result.scalar_one_or_none()
        if not provider:
            return False
        
        await db.delete(provider)
        await db.commit()
        return True
    
    def get_decrypted_credentials(self, provider: DNSProvider) -> dict:
        """获取解密后的凭证"""
        return decrypt_credentials(provider.encrypted_credentials)


class DomainCRUD:
    async def get_by_user(self, db: AsyncSession, user_id: int) -> List[Domain]:
        """获取用户的所有域名"""
        result = await db.execute(
            select(Domain).where(Domain.user_id == user_id)
            .options(selectinload(Domain.provider))
        )
        return result.scalars().all()
    
    async def get_by_id(self, db: AsyncSession, domain_id: int, user_id: int) -> Optional[Domain]:
        """根据ID获取域名"""
        result = await db.execute(
            select(Domain).where(
                Domain.id == domain_id,
                Domain.user_id == user_id
            ).options(selectinload(Domain.provider))
        )
        return result.scalar_one_or_none()
    
    async def create(self, db: AsyncSession, domain_data: DomainCreate, user_id: int) -> Domain:
        """创建域名"""
        db_domain = Domain(
            user_id=user_id,
            provider_id=domain_data.provider_id,
            domain_name=domain_data.domain_name
        )
        db.add(db_domain)
        await db.commit()
        await db.refresh(db_domain, ["provider"])
        return db_domain
    
    async def delete(self, db: AsyncSession, domain_id: int, user_id: int) -> bool:
        """删除域名"""
        result = await db.execute(
            select(Domain).where(
                Domain.id == domain_id,
                Domain.user_id == user_id
            )
        )
        domain = result.scalar_one_or_none()
        if not domain:
            return False
        
        await db.delete(domain)
        await db.commit()
        return True


class DNSRecordCRUD:
    async def get_by_domain(self, db: AsyncSession, domain_id: int, user_id: int) -> List[DNSRecord]:
        """获取域名的所有DNS记录"""
        # 首先验证域名属于该用户
        domain_result = await db.execute(
            select(Domain).where(
                Domain.id == domain_id,
                Domain.user_id == user_id
            )
        )
        domain = domain_result.scalar_one_or_none()
        if not domain:
            return []
        
        result = await db.execute(
            select(DNSRecord).where(DNSRecord.domain_id == domain_id)
        )
        return result.scalars().all()
    
    async def get_by_id(self, db: AsyncSession, record_id: int, user_id: int) -> Optional[DNSRecord]:
        """根据ID获取DNS记录"""
        result = await db.execute(
            select(DNSRecord)
            .join(Domain)
            .where(
                DNSRecord.id == record_id,
                Domain.user_id == user_id
            )
        )
        return result.scalar_one_or_none()
    
    async def create(self, db: AsyncSession, record_data: DNSRecordCreate, domain_id: int, user_id: int) -> Optional[DNSRecord]:
        """创建DNS记录"""
        # 验证域名属于该用户
        domain_result = await db.execute(
            select(Domain).where(
                Domain.id == domain_id,
                Domain.user_id == user_id
            )
        )
        domain = domain_result.scalar_one_or_none()
        if not domain:
            return None
        
        db_record = DNSRecord(
            domain_id=domain_id,
            subdomain=record_data.subdomain,
            record_type=record_data.record_type,
            record_value=record_data.record_value,
            ttl=record_data.ttl
        )
        db.add(db_record)
        await db.commit()
        await db.refresh(db_record)
        return db_record
    
    async def update(self, db: AsyncSession, record_id: int, record_data: DNSRecordUpdate, user_id: int) -> Optional[DNSRecord]:
        """更新DNS记录"""
        result = await db.execute(
            select(DNSRecord)
            .join(Domain)
            .where(
                DNSRecord.id == record_id,
                Domain.user_id == user_id
            )
        )
        record = result.scalar_one_or_none()
        if not record:
            return None
        
        update_data = record_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(record, field, value)
        
        await db.commit()
        await db.refresh(record)
        return record
    
    async def delete(self, db: AsyncSession, record_id: int, user_id: int) -> bool:
        """删除DNS记录"""
        result = await db.execute(
            select(DNSRecord)
            .join(Domain)
            .where(
                DNSRecord.id == record_id,
                Domain.user_id == user_id
            )
        )
        record = result.scalar_one_or_none()
        if not record:
            return False
        
        await db.delete(record)
        await db.commit()
        return True


# 实例化CRUD对象
provider_crud = DNSProviderCRUD()
domain_crud = DomainCRUD()
record_crud = DNSRecordCRUD()