from typing import Any, Dict
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# Configure FastMail
conf = ConnectionConfig(
    MAIL_USERNAME=settings.SMTP_USER or "dummy_user",
    MAIL_PASSWORD=settings.SMTP_PASSWORD or "dummy_password",
    MAIL_FROM=settings.EMAILS_FROM_EMAIL,
    MAIL_PORT=settings.SMTP_PORT,
    MAIL_SERVER=settings.SMTP_HOST or "localhost",
    MAIL_FROM_NAME=settings.EMAILS_FROM_NAME,
    MAIL_STARTTLS=settings.SMTP_TLS,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=bool(settings.SMTP_USER),
    VALIDATE_CERTS=True,
    SUPPRESS_SEND=0 if settings.SMTP_HOST else 1, # Suppress sending if no SMTP host is configured (logs instead)
)

fm = FastMail(conf)

async def send_quote_notification(email_to: str, status: str, quote_data: Dict[str, Any]):
    """
    Send an email notification about a quote status change.
    """
    if status == "Requested":
        subject = "Bathycat - Quote Request Received"
        body = f"""
        <h2>Quote Request Received</h2>
        <p>Hi {quote_data.get('customer_name')},</p>
        <p>We have successfully received your custom Bathycat quote request!</p>
        <p>Our team will review your requirements and get back to you shortly.</p>
        <br>
        <p>Best regards,<br>The Bathycat Team</p>
        """
    elif status == "Approved":
        subject = "Bathycat - Quote Request Approved"
        body = f"""
        <h2>Quote Approved</h2>
        <p>Hi {quote_data.get('customer_name')},</p>
        <p>Great news! Your custom Bathycat quote has been approved.</p>
        <p>A dealer will now begin fulfilling your order.</p>
        <br>
        <p>Best regards,<br>The Bathycat Team</p>
        """
    elif status == "Rejected":
        subject = "Bathycat - Quote Request Update"
        body = f"""
        <h2>Quote Update</h2>
        <p>Hi {quote_data.get('customer_name')},</p>
        <p>Unfortunately, your custom Bathycat quote request could not be approved at this time.</p>
        <p>Please contact our sales team if you have any questions.</p>
        <br>
        <p>Best regards,<br>The Bathycat Team</p>
        """
    elif status == "Completed":
        subject = "Bathycat - Order Completed"
        body = f"""
        <h2>Order Completed</h2>
        <p>Hi {quote_data.get('customer_name')},</p>
        <p>Your custom Bathycat order has been marked as Completed by your dealer!</p>
        <p>They will reach out to you shortly regarding delivery.</p>
        <br>
        <p>Best regards,<br>The Bathycat Team</p>
        """
    else:
        # Fallback for unknown status
        subject = f"Bathycat - Quote Status Updated to {status}"
        body = f"<p>Your quote status has been updated to: <b>{status}</b></p>"

    message = MessageSchema(
        subject=subject,
        recipients=[email_to],
        body=body,
        subtype=MessageType.html
    )

    try:
        await fm.send_message(message)
        if conf.SUPPRESS_SEND:
            logger.info(f"SUPPRESSED EMAIL SEND (Local Dev): To: {email_to} | Subject: {subject}")
            print(f"--- EMAIL SUPPRESSED (NO SMTP HOST CONFIGURED) ---\nTO: {email_to}\nSUBJECT: {subject}\nBODY:\n{body}\n----------------------------------------------------")
    except Exception as e:
        logger.error(f"Failed to send email to {email_to}: {str(e)}")
