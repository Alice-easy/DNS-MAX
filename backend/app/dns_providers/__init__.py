from typing import Dict, Any
from app.dns_providers.base import DNSProvider
from app.dns_providers.aliyun import AliyunProvider
from app.dns_providers.cloudflare import CloudflareProvider
from app.dns_providers.tencent import TencentProvider


def get_provider_adapter(provider_name: str, credentials: Dict[str, Any]) -> DNSProvider:
    """根据服务商名称返回对应的适配器实例"""
    if provider_name == 'aliyun':
        return AliyunProvider(credentials)
    elif provider_name == 'cloudflare':
        return CloudflareProvider(credentials)
    elif provider_name == 'tencent':
        return TencentProvider(credentials)
    else:
        raise ValueError(f"Unsupported provider: {provider_name}")


__all__ = [
    "DNSProvider",
    "AliyunProvider", 
    "CloudflareProvider",
    "TencentProvider",
    "get_provider_adapter"
]