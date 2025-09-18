// 用户相关类型
export interface User {
  id: number;
  username: string;
  created_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// DNS服务商相关类型
export interface DNSProvider {
  id: number;
  user_id: number;
  provider_name: 'aliyun' | 'cloudflare' | 'tencent';
  created_at: string;
}

export interface ProviderCreateRequest {
  provider_name: 'aliyun' | 'cloudflare' | 'tencent';
  credentials: Record<string, any>;
}

// 域名相关类型
export interface Domain {
  id: number;
  user_id: number;
  provider_id: number;
  domain_name: string;
  provider: DNSProvider;
  created_at: string;
}

export interface DomainCreateRequest {
  domain_name: string;
  provider_id: number;
}

// DNS记录相关类型
export interface DNSRecord {
  id: number;
  domain_id: number;
  record_id_on_provider?: string;
  subdomain: string;
  record_type: string;
  record_value: string;
  ttl: number;
  created_at: string;
  updated_at: string;
}

export interface DNSRecordCreateRequest {
  subdomain: string;
  record_type: string;
  record_value: string;
  ttl?: number;
}

export interface DNSRecordUpdateRequest {
  subdomain?: string;
  record_type?: string;
  record_value?: string;
  ttl?: number;
}

// 通用响应类型
export interface BaseResponse {
  success: boolean;
  message: string;
}

export interface ErrorResponse extends BaseResponse {
  success: false;
  error_code?: string;
  details?: Record<string, any>;
}