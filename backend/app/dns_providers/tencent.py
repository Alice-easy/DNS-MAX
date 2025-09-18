from typing import List, Dict, Any
from tencentcloud.common import credential
from tencentcloud.dnspod.v20210323 import dnspod_client, models
from app.dns_providers.base import DNSProvider, ProviderAPIError, UnifiedDNSRecord


class TencentProvider(DNSProvider):
    """腾讯云DNSPod适配器"""
    
    def __init__(self, credentials: Dict[str, Any]):
        super().__init__(credentials)
        self.secret_id = credentials.get("secret_id")
        self.secret_key = credentials.get("secret_key")
        
        # 初始化腾讯云DNS客户端
        cred = credential.Credential(self.secret_id, self.secret_key)
        self.client = dnspod_client.DnspodClient(cred, "ap-guangzhou")
    
    async def list_records(self, domain_name: str) -> List[Dict[str, Any]]:
        """列出指定域名的所有DNS记录"""
        try:
            request = models.DescribeRecordListRequest()
            request.Domain = domain_name
            
            response = self.client.DescribeRecordList(request)
            records = []
            
            for record in response.RecordList:
                unified_record = UnifiedDNSRecord(
                    record_id=str(record.RecordId),
                    subdomain=record.Name if record.Name != "@" else "@",
                    record_type=record.Type,
                    value=record.Value,
                    ttl=record.TTL,
                    provider_name="tencent",
                    extra_info={
                        "line": record.Line,
                        "status": record.Status,
                        "weight": record.Weight
                    }
                )
                records.append(unified_record.to_dict())
            
            return records
            
        except Exception as e:
            raise ProviderAPIError(f"Failed to list records: {str(e)}", "tencent")
    
    async def create_record(self, domain_name: str, record_data: Dict[str, Any]) -> Dict[str, Any]:
        """创建一个新的DNS记录"""
        try:
            request = models.CreateRecordRequest()
            request.Domain = domain_name
            request.SubDomain = record_data.get("subdomain", "@")
            request.RecordType = record_data["record_type"]
            request.Value = record_data["record_value"]
            request.TTL = record_data.get("ttl", 600)
            
            response = self.client.CreateRecord(request)
            
            # 获取新创建的记录详情
            detail_request = models.DescribeRecordRequest()
            detail_request.Domain = domain_name
            detail_request.RecordId = response.RecordId
            
            detail_response = self.client.DescribeRecord(detail_request)
            record = detail_response.RecordInfo
            
            unified_record = UnifiedDNSRecord(
                record_id=str(record.RecordId),
                subdomain=record.SubDomain if record.SubDomain != "@" else "@",
                record_type=record.RecordType,
                value=record.Value,
                ttl=record.TTL,
                provider_name="tencent",
                extra_info={
                    "line": record.RecordLine,
                    "status": record.Status,
                    "weight": record.Weight
                }
            )
            
            return unified_record.to_dict()
            
        except Exception as e:
            raise ProviderAPIError(f"Failed to create record: {str(e)}", "tencent")
    
    async def update_record(self, domain_name: str, record_id: str, record_data: Dict[str, Any]) -> Dict[str, Any]:
        """更新一个已存在的DNS记录"""
        try:
            request = models.ModifyRecordRequest()
            request.Domain = domain_name
            request.RecordId = int(record_id)
            
            if "subdomain" in record_data:
                request.SubDomain = record_data["subdomain"]
            if "record_type" in record_data:
                request.RecordType = record_data["record_type"]
            if "record_value" in record_data:
                request.Value = record_data["record_value"]
            if "ttl" in record_data:
                request.TTL = record_data["ttl"]
            
            self.client.ModifyRecord(request)
            
            # 获取更新后的记录详情
            detail_request = models.DescribeRecordRequest()
            detail_request.Domain = domain_name
            detail_request.RecordId = int(record_id)
            
            detail_response = self.client.DescribeRecord(detail_request)
            record = detail_response.RecordInfo
            
            unified_record = UnifiedDNSRecord(
                record_id=str(record.RecordId),
                subdomain=record.SubDomain if record.SubDomain != "@" else "@",
                record_type=record.RecordType,
                value=record.Value,
                ttl=record.TTL,
                provider_name="tencent",
                extra_info={
                    "line": record.RecordLine,
                    "status": record.Status,
                    "weight": record.Weight
                }
            )
            
            return unified_record.to_dict()
            
        except Exception as e:
            raise ProviderAPIError(f"Failed to update record: {str(e)}", "tencent")
    
    async def delete_record(self, domain_name: str, record_id: str) -> bool:
        """删除一个DNS记录"""
        try:
            request = models.DeleteRecordRequest()
            request.Domain = domain_name
            request.RecordId = int(record_id)
            
            self.client.DeleteRecord(request)
            return True
            
        except Exception as e:
            raise ProviderAPIError(f"Failed to delete record: {str(e)}", "tencent")
    
    async def get_domain_info(self, domain_name: str) -> Dict[str, Any]:
        """获取域名的基本信息"""
        try:
            request = models.DescribeDomainRequest()
            request.Domain = domain_name
            
            response = self.client.DescribeDomain(request)
            domain_info = response.DomainInfo
            
            return {
                "domain_name": domain_info.Domain,
                "domain_id": str(domain_info.DomainId),
                "status": domain_info.Status,
                "provider": "tencent"
            }
            
        except Exception as e:
            raise ProviderAPIError(f"Failed to get domain info: {str(e)}", "tencent")