from tencentcloud.common import credential
from tencentcloud.dnspod.v20210323 import dnspod_client, models
from sqlalchemy.orm import Session
from typing import List, Dict

def get_client(db: Session):
    """获取 DNSPod 客户端，从数据库读取配置"""
    from .config import get_config_value
    
    secret_id = get_config_value(db, "DNSPOD_SECRET_ID", "")
    secret_key = get_config_value(db, "DNSPOD_SECRET_KEY", "")
    
    if not secret_id or not secret_key:
        raise ValueError("DNSPod credentials not configured")
    
    cred = credential.Credential(secret_id, secret_key)
    return dnspod_client.DnspodClient(cred, "")

def list_domains(db: Session) -> List[Dict[str, any]]:
    """获取 DNSPod 账号下所有托管域名"""
    client = get_client(db)
    req = models.DescribeDomainListRequest()
    req.Type = "ALL"
    req.Offset = 0
    req.Limit = 3000  # DNSPod 支持最多 3000 个域名
    
    resp = client.DescribeDomainList(req)
    
    domains = []
    if resp.DomainList:
        for domain in resp.DomainList:
            domains.append({
                "id": domain.DomainId,
                "name": domain.Name,
                "status": domain.Status,
                "records": domain.RecordCount if hasattr(domain, 'RecordCount') else 0
            })
    
    return domains

def create_record(db: Session, domain: str, subdomain: str, record_type: str, value: str, ttl: int = None):
    """创建 DNS 记录"""
    from .config import get_config_value
    
    client = get_client(db)
    req = models.CreateRecordRequest()
    req.Domain = domain
    req.SubDomain = subdomain
    req.RecordType = record_type
    req.RecordLine = "默认"
    req.Value = value
    req.TTL = ttl or int(get_config_value(db, "DNS_DEFAULT_TTL", "600"))
    return client.CreateRecord(req)

def delete_record(db: Session, domain: str, record_id: int):
    """删除 DNS 记录"""
    client = get_client(db)
    req = models.DeleteRecordRequest()
    req.Domain = domain
    req.RecordId = record_id
    return client.DeleteRecord(req)
