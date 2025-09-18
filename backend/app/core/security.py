import json
import base64
from datetime import datetime, timedelta
from typing import Optional, Any, Dict
from passlib.context import CryptContext
from jose import JWTError, jwt
from cryptography.fernet import Fernet
from app.core.config import settings


# 密码哈希上下文
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 加密器实例
fernet = Fernet(settings.encryption_key.encode() if len(settings.encryption_key) == 44 else base64.urlsafe_b64encode(settings.encryption_key.encode()[:32]))


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """验证密码"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """生成密码哈希"""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """创建JWT访问令牌"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    return encoded_jwt


def verify_token(token: str) -> Optional[Dict[str, Any]]:
    """验证JWT令牌"""
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        return payload
    except JWTError:
        return None


def encrypt_credentials(credentials: Dict[str, Any]) -> str:
    """加密DNS服务商凭证"""
    credentials_json = json.dumps(credentials)
    encrypted_data = fernet.encrypt(credentials_json.encode())
    return base64.urlsafe_b64encode(encrypted_data).decode()


def decrypt_credentials(encrypted_credentials: str) -> Dict[str, Any]:
    """解密DNS服务商凭证"""
    try:
        encrypted_data = base64.urlsafe_b64decode(encrypted_credentials.encode())
        decrypted_data = fernet.decrypt(encrypted_data)
        return json.loads(decrypted_data.decode())
    except Exception as e:
        raise ValueError(f"Failed to decrypt credentials: {str(e)}")


def generate_encryption_key() -> str:
    """生成新的加密密钥（仅用于开发环境）"""
    return Fernet.generate_key().decode()