import httpx
from typing import List, Dict, Any
from app.dns_providers.base import DNSProvider, ProviderAPIError, UnifiedDNSRecord


class CloudflareProvider(DNSProvider):
    """Cloudflare DNS适配器"""
    
    def __init__(self, credentials: Dict[str, Any]):
        super().__init__(credentials)
        self.api_token = credentials.get("api_token")
        self.base_url = "https://api.cloudflare.com/client/v4"
        self.headers = {
            "Authorization": f"Bearer {self.api_token}",
            "Content-Type": "application/json"
        }
    
    async def _get_zone_id(self, domain_name: str) -> str:
        """获取域名的Zone ID"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/zones",
                headers=self.headers,
                params={"name": domain_name}
            )
            
            if response.status_code != 200:
                raise ProviderAPIError(
                    f"Failed to get zone info: {response.text}",
                    "cloudflare"
                )
            
            data = response.json()
            if not data["result"]:
                raise ProviderAPIError(
                    f"Domain {domain_name} not found in Cloudflare",
                    "cloudflare"
                )
            
            return data["result"][0]["id"]
    
    async def list_records(self, domain_name: str) -> List[Dict[str, Any]]:
        """列出指定域名的所有DNS记录"""
        try:
            zone_id = await self._get_zone_id(domain_name)
            
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/zones/{zone_id}/dns_records",
                    headers=self.headers
                )
                
                if response.status_code != 200:
                    raise ProviderAPIError(
                        f"Failed to list records: {response.text}",
                        "cloudflare"
                    )
                
                data = response.json()
                records = []
                
                for record in data["result"]:
                    unified_record = UnifiedDNSRecord(
                        record_id=record["id"],
                        subdomain=record["name"].replace(f".{domain_name}", "") or "@",
                        record_type=record["type"],
                        value=record["content"],
                        ttl=record["ttl"],
                        provider_name="cloudflare",
                        extra_info={"zone_id": zone_id}
                    )
                    records.append(unified_record.to_dict())
                
                return records
                
        except Exception as e:
            if isinstance(e, ProviderAPIError):
                raise
            raise ProviderAPIError(f"Unexpected error: {str(e)}", "cloudflare")
    
    async def create_record(self, domain_name: str, record_data: Dict[str, Any]) -> Dict[str, Any]:
        """创建一个新的DNS记录"""
        try:
            zone_id = await self._get_zone_id(domain_name)
            
            # 构造完整的记录名称
            subdomain = record_data.get("subdomain", "@")
            if subdomain == "@":
                full_name = domain_name
            else:
                full_name = f"{subdomain}.{domain_name}"
            
            record_payload = {
                "type": record_data["record_type"],
                "name": full_name,
                "content": record_data["record_value"],
                "ttl": record_data.get("ttl", 600)
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/zones/{zone_id}/dns_records",
                    headers=self.headers,
                    json=record_payload
                )
                
                if response.status_code != 200:
                    raise ProviderAPIError(
                        f"Failed to create record: {response.text}",
                        "cloudflare"
                    )
                
                data = response.json()
                result = data["result"]
                
                unified_record = UnifiedDNSRecord(
                    record_id=result["id"],
                    subdomain=subdomain,
                    record_type=result["type"],
                    value=result["content"],
                    ttl=result["ttl"],
                    provider_name="cloudflare",
                    extra_info={"zone_id": zone_id}
                )
                
                return unified_record.to_dict()
                
        except Exception as e:
            if isinstance(e, ProviderAPIError):
                raise
            raise ProviderAPIError(f"Unexpected error: {str(e)}", "cloudflare")
    
    async def update_record(self, domain_name: str, record_id: str, record_data: Dict[str, Any]) -> Dict[str, Any]:
        """更新一个已存在的DNS记录"""
        try:
            zone_id = await self._get_zone_id(domain_name)
            
            # 构造更新载荷
            update_payload = {}
            if "record_type" in record_data:
                update_payload["type"] = record_data["record_type"]
            if "record_value" in record_data:
                update_payload["content"] = record_data["record_value"]
            if "ttl" in record_data:
                update_payload["ttl"] = record_data["ttl"]
            if "subdomain" in record_data:
                subdomain = record_data["subdomain"]
                if subdomain == "@":
                    update_payload["name"] = domain_name
                else:
                    update_payload["name"] = f"{subdomain}.{domain_name}"
            
            async with httpx.AsyncClient() as client:
                response = await client.patch(
                    f"{self.base_url}/zones/{zone_id}/dns_records/{record_id}",
                    headers=self.headers,
                    json=update_payload
                )
                
                if response.status_code != 200:
                    raise ProviderAPIError(
                        f"Failed to update record: {response.text}",
                        "cloudflare"
                    )
                
                data = response.json()
                result = data["result"]
                
                subdomain = result["name"].replace(f".{domain_name}", "") or "@"
                unified_record = UnifiedDNSRecord(
                    record_id=result["id"],
                    subdomain=subdomain,
                    record_type=result["type"],
                    value=result["content"],
                    ttl=result["ttl"],
                    provider_name="cloudflare",
                    extra_info={"zone_id": zone_id}
                )
                
                return unified_record.to_dict()
                
        except Exception as e:
            if isinstance(e, ProviderAPIError):
                raise
            raise ProviderAPIError(f"Unexpected error: {str(e)}", "cloudflare")
    
    async def delete_record(self, domain_name: str, record_id: str) -> bool:
        """删除一个DNS记录"""
        try:
            zone_id = await self._get_zone_id(domain_name)
            
            async with httpx.AsyncClient() as client:
                response = await client.delete(
                    f"{self.base_url}/zones/{zone_id}/dns_records/{record_id}",
                    headers=self.headers
                )
                
                if response.status_code != 200:
                    raise ProviderAPIError(
                        f"Failed to delete record: {response.text}",
                        "cloudflare"
                    )
                
                return True
                
        except Exception as e:
            if isinstance(e, ProviderAPIError):
                raise
            raise ProviderAPIError(f"Unexpected error: {str(e)}", "cloudflare")
    
    async def get_domain_info(self, domain_name: str) -> Dict[str, Any]:
        """获取域名的基本信息"""
        try:
            zone_id = await self._get_zone_id(domain_name)
            
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/zones/{zone_id}",
                    headers=self.headers
                )
                
                if response.status_code != 200:
                    raise ProviderAPIError(
                        f"Failed to get domain info: {response.text}",
                        "cloudflare"
                    )
                
                data = response.json()
                result = data["result"]
                
                return {
                    "domain_name": result["name"],
                    "status": result["status"],
                    "zone_id": result["id"],
                    "provider": "cloudflare"
                }
                
        except Exception as e:
            if isinstance(e, ProviderAPIError):
                raise
            raise ProviderAPIError(f"Unexpected error: {str(e)}", "cloudflare")