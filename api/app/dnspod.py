import os
from tencentcloud.common import credential
from tencentcloud.dnspod.v20210323 import dnspod_client, models

def get_client():
    cred = credential.Credential(os.getenv("DNSPOD_SECRET_ID"), os.getenv("DNSPOD_SECRET_KEY"))
    return dnspod_client.DnspodClient(cred, "")

def create_record(subdomain: str, record_type: str, value: str, ttl: int = None):
    client = get_client()
    req = models.CreateRecordRequest()
    req.Domain = os.getenv("DNS_ROOT_DOMAIN")     # example.com
    req.SubDomain = subdomain                      # alice
    req.RecordType = record_type                   # A / CNAME / TXT...
    req.RecordLine = "默认"
    req.Value = value
    req.TTL = ttl or int(os.getenv("DNS_DEFAULT_TTL","600"))
    return client.CreateRecord(req)

def delete_record(record_id: int):
    client = get_client()
    req = models.DeleteRecordRequest()
    req.Domain = os.getenv("DNS_ROOT_DOMAIN")
    req.RecordId = record_id
    return client.DeleteRecord(req)
