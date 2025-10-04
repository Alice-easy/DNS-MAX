import os, httpx
from email.message import EmailMessage
import smtplib

async def send_verification(to: str, verify_url: str):
    subj = "Verify your email"
    html = f"""<p>点击验证：</p><p><a href="{verify_url}">{verify_url}</a></p>"""

    if os.getenv("MAIL_PROVIDER") == "RESEND":
        async with httpx.AsyncClient(base_url="https://api.resend.com") as client:
            r = await client.post("/emails",
                headers={"Authorization": f"Bearer {os.getenv('RESEND_API_KEY')}"},
                json={"from": os.getenv("EMAIL_FROM"),
                      "to": [to],
                      "subject": subj,
                      "html": html})
            r.raise_for_status()
    else:
        msg = EmailMessage()
        msg["From"] = os.getenv("EMAIL_FROM")
        msg["To"] = to
        msg["Subject"] = subj
        msg.set_content("请复制到浏览器打开验证链接：" + verify_url)
        msg.add_alternative(html, subtype="html")
        with smtplib.SMTP(os.getenv("SMTP_HOST"), int(os.getenv("SMTP_PORT"))) as s:
            s.starttls()
            s.login(os.getenv("SMTP_USER"), os.getenv("SMTP_PASS"))
            s.send_message(msg)
