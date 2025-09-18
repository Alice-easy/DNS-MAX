from abc import ABC, abstractmethod
from typing import List, Dict, Any


class DNSProvider(ABC):
    """定义所有DNS服务商适配器必须实现的统一接口"""

    def __init__(self, credentials: Dict[str, Any]):
        self.credentials = credentials

    @abstractmethod
    async def list_records(self, domain_name: str) -> List[Dict[str, Any]]:
        """列出指定域名的所有DNS记录"""
        pass

    @abstractmethod
    async def create_record(self, domain_name: str, record_data: Dict[str, Any]) -> Dict[str, Any]:
        """创建一个新的DNS记录"""
        pass

    @abstractmethod
    async def update_record(self, domain_name: str, record_id: str, record_data: Dict[str, Any]) -> Dict[str, Any]:
        """更新一个已存在的DNS记录"""
        pass

    @abstractmethod
    async def delete_record(self, domain_name: str, record_id: str) -> bool:
        """删除一个DNS记录"""
        pass

    @abstractmethod
    async def get_domain_info(self, domain_name: str) -> Dict[str, Any]:
        """获取域名的基本信息"""
        pass


class ProviderAPIError(Exception):
    """DNS服务商API调用错误"""
    def __init__(self, message: str, provider: str, error_code: str = None):
        self.message = message
        self.provider = provider
        self.error_code = error_code
        super().__init__(f"[{provider}] {message}")


class UnifiedDNSRecord:
    """统一的DNS记录数据模型"""
    def __init__(self, record_id: str, subdomain: str, record_type: str, 
                 value: str, ttl: int, provider_name: str, extra_info: Dict = None):
        self.record_id = record_id
        self.subdomain = subdomain
        self.record_type = record_type
        self.value = value
        self.ttl = ttl
        self.provider_name = provider_name
        self.extra_info = extra_info or {}

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.record_id,
            "subdomain": self.subdomain,
            "record_type": self.record_type,
            "value": self.value,
            "ttl": self.ttl,
            "provider_name": self.provider_name,
            "extra_info": self.extra_info
        }