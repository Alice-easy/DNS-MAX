from typing import List, Dict, Any
from alibabacloud_alidns20150109.client import Client as AlidnsClient
from alibabacloud_tea_openapi import models as open_api_models
from alibabacloud_alidns20150109 import models as alidns_models
from app.dns_providers.base import DNSProvider, ProviderAPIError, UnifiedDNSRecord


class AliyunProvider(DNSProvider):
    """阿里云DNS适配器"""
    
    def __init__(self, credentials: Dict[str, Any]):
        super().__init__(credentials)
        self.access_key_id = credentials.get("access_key_id")
        self.access_key_secret = credentials.get("access_key_secret")
        
        # 初始化阿里云DNS客户端
        config = open_api_models.Config(
            access_key_id=self.access_key_id,
            access_key_secret=self.access_key_secret,
            endpoint='dns.aliyuncs.com'
        )
        self.client = AlidnsClient(config)
    
    async def list_records(self, domain_name: str) -> List[Dict[str, Any]]:
        """列出指定域名的所有DNS记录"""
        try:
            request = alidns_models.DescribeDomainRecordsRequest(
                domain_name=domain_name
            )
            
            response = self.client.describe_domain_records(request)
            records = []
            
            for record in response.body.domain_records.record:
                unified_record = UnifiedDNSRecord(
                    record_id=record.record_id,
                    subdomain=record.rr if record.rr != "@" else "@",
                    record_type=record.type,
                    value=record.value,
                    ttl=record.ttl,
                    provider_name="aliyun",
                    extra_info={
                        "line": record.line,
                        "status": record.status,
                        "locked": record.locked
                    }
                )
                records.append(unified_record.to_dict())
            
            return records
            
        except Exception as e:
            raise ProviderAPIError(f"Failed to list records: {str(e)}", "aliyun")
    
    async def create_record(self, domain_name: str, record_data: Dict[str, Any]) -> Dict[str, Any]:
        """创建一个新的DNS记录"""
        try:
            request = alidns_models.AddDomainRecordRequest(
                domain_name=domain_name,
                rr=record_data.get("subdomain", "@"),
                type=record_data["record_type"],
                value=record_data["record_value"],
                ttl=record_data.get("ttl", 600)
            )
            
            response = self.client.add_domain_record(request)
            
            # 获取新创建的记录详情
            detail_request = alidns_models.DescribeDomainRecordInfoRequest(
                record_id=response.body.record_id
            )
            detail_response = self.client.describe_domain_record_info(detail_request)
            record = detail_response.body
            
            unified_record = UnifiedDNSRecord(
                record_id=record.record_id,
                subdomain=record.rr if record.rr != "@" else "@",
                record_type=record.type,
                value=record.value,
                ttl=record.ttl,
                provider_name="aliyun",
                extra_info={
                    "line": record.line,
                    "status": record.status,
                    "locked": record.locked
                }
            )
            
            return unified_record.to_dict()
            
        except Exception as e:
            raise ProviderAPIError(f"Failed to create record: {str(e)}", "aliyun")
    
    async def update_record(self, domain_name: str, record_id: str, record_data: Dict[str, Any]) -> Dict[str, Any]:
        """更新一个已存在的DNS记录"""
        try:
            # 构造更新请求
            request = alidns_models.UpdateDomainRecordRequest(
                record_id=record_id
            )
            
            if "subdomain" in record_data:
                request.rr = record_data["subdomain"]
            if "record_type" in record_data:
                request.type = record_data["record_type"]
            if "record_value" in record_data:
                request.value = record_data["record_value"]
            if "ttl" in record_data:
                request.ttl = record_data["ttl"]
            
            self.client.update_domain_record(request)
            
            # 获取更新后的记录详情
            detail_request = alidns_models.DescribeDomainRecordInfoRequest(
                record_id=record_id
            )
            detail_response = self.client.describe_domain_record_info(detail_request)
            record = detail_response.body
            
            unified_record = UnifiedDNSRecord(
                record_id=record.record_id,
                subdomain=record.rr if record.rr != "@" else "@",
                record_type=record.type,
                value=record.value,
                ttl=record.ttl,
                provider_name="aliyun",
                extra_info={
                    "line": record.line,
                    "status": record.status,
                    "locked": record.locked
                }
            )
            
            return unified_record.to_dict()
            
        except Exception as e:
            raise ProviderAPIError(f"Failed to update record: {str(e)}", "aliyun")
    
    async def delete_record(self, domain_name: str, record_id: str) -> bool:
        """删除一个DNS记录"""
        try:
            request = alidns_models.DeleteDomainRecordRequest(
                record_id=record_id
            )
            
            self.client.delete_domain_record(request)
            return True
            
        except Exception as e:
            raise ProviderAPIError(f"Failed to delete record: {str(e)}", "aliyun")
    
    async def get_domain_info(self, domain_name: str) -> Dict[str, Any]:
        """获取域名的基本信息"""
        try:
            request = alidns_models.DescribeDomainInfoRequest(
                domain_name=domain_name
            )
            
            response = self.client.describe_domain_info(request)
            domain_info = response.body
            
            return {
                "domain_name": domain_info.domain_name,
                "domain_id": domain_info.domain_id,
                "status": "active",  # 阿里云默认为激活状态
                "provider": "aliyun"
            }
            
        except Exception as e:
            raise ProviderAPIError(f"Failed to get domain info: {str(e)}", "aliyun")