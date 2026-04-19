import smtplib
import ssl
from email.message import EmailMessage
from bin.config import GMAIL_ADDRESS, GMAIL_APP_PASSWORD, SMTP_SERVER, SMTP_PORT


def send_email(subject: str, body: str, to_email: str) -> bool:
    try:
        msg = EmailMessage()
        msg["Subject"] = subject
        msg["From"] = GMAIL_ADDRESS
        msg["To"] = to_email
        msg.set_content(body)

        context = ssl.create_default_context()

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls(context=context)
            server.login(GMAIL_ADDRESS, GMAIL_APP_PASSWORD)
            server.send_message(msg)

        return True

    except Exception as e:
        print("Email send error:", e)
        return False


def send_email_otp(email: str, otp: str) -> bool:
    print(f"OTP send : {email} , : {otp}")
    subject = "Your OTP Code"
    body = f"""
Your OTP Code is: {otp}

This OTP will expire soon.
If you did not request this, ignore this email.
"""

    return send_email(subject, body, email)


# def send_email_otp(email: str, otp: str) -> bool:
#     print(f"OTP send : {email} , : {otp}")
#     return True


# send_email_otp("atharvthakre37@gmail.com", "123456")
