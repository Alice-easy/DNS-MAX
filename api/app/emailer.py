import httpx
from email.message import EmailMessage
import smtplib
from sqlalchemy.orm import Session

async def send_verification(db: Session, to: str, verify_url: str):
    """发送验证邮件，从数据库读取邮件配置"""
    from .config import get_config_value
    
    subj = "Verify your email"
    html = f"""<p>点击验证：</p><p><a href="{verify_url}">{verify_url}</a></p>"""
    
    mail_provider = get_config_value(db, "MAIL_PROVIDER", "SMTP")
    email_from = get_config_value(db, "EMAIL_FROM", "DomainApp <no-reply@yourdomain.com>")

    if mail_provider == "RESEND":
        api_key = get_config_value(db, "RESEND_API_KEY", "")
        if not api_key:
            raise ValueError("Resend API key not configured")
            
        async with httpx.AsyncClient(base_url="https://api.resend.com") as client:
            r = await client.post("/emails",
                headers={"Authorization": f"Bearer {api_key}"},
                json={"from": email_from,
                      "to": [to],
                      "subject": subj,
                      "html": html})
            r.raise_for_status()
    else:
        smtp_host = get_config_value(db, "SMTP_HOST", "smtp.sendgrid.net")
        smtp_port = int(get_config_value(db, "SMTP_PORT", "587"))
        smtp_user = get_config_value(db, "SMTP_USER", "")
        smtp_pass = get_config_value(db, "SMTP_PASS", "")
        
        if not smtp_user or not smtp_pass:
            raise ValueError("SMTP credentials not configured")
        
        msg = EmailMessage()
        msg["From"] = email_from
        msg["To"] = to
        msg["Subject"] = subj
        msg.set_content("请复制到浏览器打开验证链接：" + verify_url)
        msg.add_alternative(html, subtype="html")
        with smtplib.SMTP(smtp_host, smtp_port) as s:
            s.starttls()
            s.login(smtp_user, smtp_pass)
            s.send_message(msg)
