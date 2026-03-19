"""
Make.com & WhatsApp Business API Integration
Automated escalation and crisis response workflows
"""

import requests
import json
from typing import Dict, Optional, List
from dataclasses import dataclass
from datetime import datetime, timedelta
from enum import Enum
import os


class EscalationLevel(Enum):
    """Escalation severity levels"""
    LOW = 1
    MODERATE = 2
    HIGH = 3
    CRITICAL = 4


@dataclass
class ContactInfo:
    """Emergency contact details"""
    contact_type: str  # "phone", "email", "whatsapp"
    address: str
    name: str = "Contact"
    priority: int = 1


@dataclass
class EscalationEvent:
    """Records escalation trigger"""
    user_id: str
    level: EscalationLevel
    timestamp: datetime
    reason: str
    gateway: str  # "whatsapp", "sms", "email"
    status: str = "pending"


class MakeComWebhookClient:
    """
    Client for triggering Make.com scenarios
    Make.com acts as no-code orchestration layer
    """
    
    def __init__(self, webhook_url: Optional[str] = None):
        """
        Initialize Make.com webhook client
        
        Args:
            webhook_url: Make.com scenario webhook URL
                        (from environment: MAKE_COM_WEBHOOK_URL)
        """
        self.webhook_url = webhook_url or os.getenv(
            "MAKE_COM_WEBHOOK_URL",
            "https://hook.make.com/[scenario-id]"
        )
    
    def trigger_escalation(
        self,
        user_id: str,
        escalation_level: EscalationLevel,
        health_data: Dict,
        contact_info: ContactInfo
    ) -> Optional[str]:
        """
        Trigger Make.com scenario for crisis escalation
        
        Webhook receives:
        - User health metrics
        - Calculated risk level
        - Emergency contact details
        - Message templates for WhatsApp/SMS
        
        Returns:
            Execution ID from Make.com
        """
        
        payload = {
            "user_id": user_id,
            "escalation_level": escalation_level.name,
            "severity_score": escalation_level.value,
            "timestamp": datetime.now().isoformat(),
            "health_data": {
                "mental_health_state": health_data.get("mental_health_state"),
                "resilience_level": health_data.get("resilience_level"),
                "composite_score": health_data.get("score"),
                "risk_flag": health_data.get("risk_flag")
            },
            "contact": {
                "type": contact_info.contact_type,
                "address": contact_info.address,
                "name": contact_info.name,
                "priority": contact_info.priority
            }
        }
        
        try:
            response = requests.post(
                self.webhook_url,
                json=payload,
                timeout=10
            )
            
            if response.status_code == 200:
                print(f"✅ Make.com escalation triggered: {escalation_level.name}")
                return response.json().get("execution_id")
            else:
                print(f"❌ Make.com webhook failed: {response.status_code}")
                return None
        
        except requests.exceptions.RequestException as e:
            print(f"❌ Webhook connection error: {str(e)}")
            return None


class WhatsAppBusinessClient:
    """
    WhatsApp Business API client
    Sends templated messages for crisis escalation and support

    This client is optional. If credentials are not configured, all send
    methods will return False (no-op).
    """

    def __init__(
        self,
        phone_number_id: Optional[str] = None,
        access_token: Optional[str] = None,
        business_account_id: Optional[str] = None
    ):
        """Initialize WhatsApp Business client"""
        self.phone_number_id = phone_number_id or os.getenv("WHATSAPP_PHONE_NUMBER_ID")
        self.access_token = access_token or os.getenv("WHATSAPP_ACCESS_TOKEN")
        self.business_account_id = business_account_id or os.getenv("WHATSAPP_BUSINESS_ACCOUNT_ID")
        
        self.base_url = "https://graph.instagram.com/v18.0"
        self.message_templates = self._load_templates()

    def is_configured(self) -> bool:
        """Return True if the WhatsApp client has the minimum required credentials."""
        return bool(self.phone_number_id and self.access_token)
    
    def _load_templates(self) -> Dict[str, Dict]:
        """Load pre-approved WhatsApp message templates"""
        
        return {
            "screening_complete": {
                "template_name": "screening_results",
                "params": ["first_name", "score", "support_link"]
            },
            "moderate_risk": {
                "template_name": "moderate_risk_alert",
                "params": ["first_name", "support_resource", "hotline"]
            },
            "high_risk": {
                "template_name": "crisis_support",
                "params": ["first_name", "tele_manas_link", "hotline"]
            },
            "follow_up": {
                "template_name": "wellness_checkin",
                "params": ["first_name", "dashboard_link"]
            }
        }
    
    def send_screening_results(
        self,
        recipient_phone: str,
        user_name: str,
        score: int,
        support_link: str
    ) -> bool:
        """Send screening completion message"""
        
        message = f"""
Hi {user_name}! 👋

Your Resilience Matrix screening is complete.

📊 Your Score: {score}/100

🔗 View Detailed Insights: {support_link}

Remember: This is a screening tool, not a diagnosis. 
Reach out to mental health professionals if needed.

Take care! 💚
"""
        
        return self._send_text_message(recipient_phone, message)
    
    def send_crisis_alert(
        self,
        recipient_phone: str,
        user_name: str,
        crisis_level: str
    ) -> bool:
        """Send crisis escalation alert"""
        
        message = f"""
🚨 **CRISIS SUPPORT ALERT** 🚨

Hi {user_name},

Our analysis indicates you may need immediate support right now.

📞 **Immediate Options:**
• Tele-MANAS: Connect with counselor instantly
• AASRA Hotline: 9820466726 (24/7)
• iCall: 9152987821 (Chat support)

💙 You're not alone. Help is available NOW.

Tap the link above or call immediately if you're in crisis.
"""
        
        return self._send_text_message(recipient_phone, message)
    
    def send_wellness_checkin(
        self,
        recipient_phone: str,
        user_name: str,
        last_score: int
    ) -> bool:
        """Send periodic wellness follow-up"""
        
        message = f"""
Hi {user_name}! 👋

Just checking in on your wellbeing. 💙

Last time you reached out, your score was {last_score}.
How are you doing today?

📱 Take the quick wellness check:
[Dashboard Link]

You've got this! 💪
"""
        
        return self._send_text_message(recipient_phone, message)
    
    def _send_text_message(
        self,
        recipient_phone: str,
        message_text: str
    ) -> bool:
        """
        Send WhatsApp text message via Business API
        
        Args:
            recipient_phone: Phone number with country code (e.g., "+919876543210")
            message_text: Plain text message
            
        Returns:
            Success status
        """
        
        if not self.is_configured():
            print("⚠️ WhatsApp credentials not configured (skipping)")
            return False
        
        url = f"{self.base_url}/{self.phone_number_id}/messages"
        
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": recipient_phone,
            "type": "text",
            "text": {
                "preview_url": True,
                "body": message_text
            }
        }
        
        try:
            response = requests.post(
                url,
                json=payload,
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                print(f"✅ WhatsApp message sent to {recipient_phone}")
                return True
            else:
                print(f"❌ WhatsApp API error: {response.status_code}")
                return False
        
        except requests.exceptions.RequestException as e:
            print(f"❌ WhatsApp send failed: {str(e)}")
            return False


class TeleManasBridge:
    """
    Integration with Tele-MANAS (Government of India telemedicine service)
    Connects users in crisis to qualified mental health professionals
    """
    
    def __init__(self, api_url: Optional[str] = None, api_key: Optional[str] = None):
        """
        Initialize Tele-MANAS bridge
        
        Environment:
        - TELE_MANAS_API_URL
        - TELE_MANAS_API_KEY
        """
        self.api_url = api_url or os.getenv("TELE_MANAS_API_URL", "https://telemanas.health.gov.in/api")
        self.api_key = api_key or os.getenv("TELE_MANAS_API_KEY")
    
    def create_referral(
        self,
        user_id: str,
        user_name: str,
        user_phone: str,
        severity: str,
        clinical_notes: str
    ) -> Optional[str]:
        """
        Create referral to Tele-MANAS counselor
        
        Args:
            user_id: Internal user ID
            user_name: Patient name
            user_phone: Contact phone
            severity: "mild", "moderate", "severe"
            clinical_notes: Screening results and observations
            
        Returns:
            Appointment ID if successful
        """
        
        payload = {
            "external_user_id": user_id,
            "patient_name": user_name,
            "phone": user_phone,
            "severity_level": severity,
            "clinical_summary": clinical_notes,
            "referral_source": "resilience_matrix",
            "requested_at": datetime.now().isoformat()
        }
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        try:
            response = requests.post(
                f"{self.api_url}/referrals",
                json=payload,
                headers=headers,
                timeout=15
            )
            
            if response.status_code == 201:
                data = response.json()
                appointment_id = data.get("appointment_id")
                print(f"✅ Tele-MANAS referral created: {appointment_id}")
                return appointment_id
            else:
                print(f"❌ Tele-MANAS referral failed: {response.status_code}")
                return None
        
        except requests.exceptions.RequestException as e:
            print(f"❌ Tele-MANAS connection error: {str(e)}")
            return None
    
    def get_appointment_status(self, appointment_id: str) -> Optional[Dict]:
        """Check appointment status"""
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
        }
        
        try:
            response = requests.get(
                f"{self.api_url}/appointments/{appointment_id}",
                headers=headers,
                timeout=10
            )
            
            return response.json() if response.status_code == 200 else None
        
        except requests.exceptions.RequestException:
            return None


class CrisisEscalationOrchestrator:
    """
    Orchestrates multi-channel crisis response
    Combines Make.com, WhatsApp, and Tele-MANAS
    """
    
    def __init__(
        self,
        make_client: Optional[MakeComWebhookClient] = None,
        whatsapp_client: Optional[WhatsAppBusinessClient] = None,
        telemanas: Optional[TeleManasBridge] = None
    ):
        self.make_client = make_client or MakeComWebhookClient()
        self.whatsapp_client = whatsapp_client or WhatsAppBusinessClient()
        self.telemanas = telemanas or TeleManasBridge()
        self.escalation_history: List[EscalationEvent] = []
    
    def escalate_crisis(
        self,
        user_id: str,
        user_name: str,
        user_phone: str,
        health_data: Dict,
        crisis_reason: str
    ) -> Dict[str, any]:
        """
        Execute full crisis escalation protocol
        Triggers across all channels for maximum user reach
        
        Returns:
            Status dictionary with action results
        """
        
        escalation_event = EscalationEvent(
            user_id=user_id,
            level=EscalationLevel.CRITICAL,
            timestamp=datetime.now(),
            reason=crisis_reason,
            gateway="multi-channel"
        )
        
        results = {
            "timestamp": datetime.now().isoformat(),
            "user_id": user_id,
            "actions": {}
        }
        
        # 1. WhatsApp immediate alert (optional)
        if self.whatsapp_client.is_configured():
            wa_sent = self.whatsapp_client.send_crisis_alert(user_phone, user_name, "CRITICAL")
            results["actions"]["whatsapp_alert"] = wa_sent
            print(f"📲 WhatsApp alert: {'✅ Sent' if wa_sent else '❌ Failed'}")
        else:
            results["actions"]["whatsapp_alert"] = None
            print("📲 WhatsApp alert: skipped (not configured)")
        
        # 2. Tele-MANAS referral
        clinical_notes = f"Crisis escalation: {crisis_reason}\nScore: {health_data.get('score')}"
        appointment_id = self.telemanas.create_referral(
            user_id, user_name, user_phone, "severe", clinical_notes
        )
        results["actions"]["telemanas_referral"] = appointment_id
        print(f"🏥 Tele-MANAS: {'✅ Referred' if appointment_id else '❌ Failed'}")
        
        # 3. Trigger Make.com orchestration
        contact = ContactInfo(
            contact_type="whatsapp",
            address=user_phone,
            name=user_name,
            priority=1
        )
        
        execution_id = self.make_client.trigger_escalation(
            user_id,
            EscalationLevel.CRITICAL,
            health_data,
            contact
        )
        results["actions"]["make_com_execution"] = execution_id
        print(f"🔗 Make.com: {'✅ Triggered' if execution_id else '❌ Failed'}")
        
        # Record escalation
        escalation_event.status = "completed" if any(results["actions"].values()) else "failed"
        self.escalation_history.append(escalation_event)
        
        return results


# ────────────────────────────────────────────────────────────────
# Factory functions
# ────────────────────────────────────────────────────────────────

def create_orchestrator() -> CrisisEscalationOrchestrator:
    """Create crisis escalation orchestrator with all integrations"""
    return CrisisEscalationOrchestrator()


if __name__ == "__main__":
    # Demo usage
    print("🚀 Resilience Matrix Integration Demo\n")
    
    orchestrator = create_orchestrator()
    
    # Simulate crisis escalation
    health_data = {
        "mental_health_state": "crisis",
        "resilience_level": "low",
        "score": 5,
        "risk_flag": True
    }
    
    results = orchestrator.escalate_crisis(
        user_id="user_demo_001",
        user_name="Rajesh",
        user_phone="+919876543210",
        health_data=health_data,
        crisis_reason="Severe depressive symptoms with suicidal ideation"
    )
    
    print("\n📊 Escalation Results:")
    print(json.dumps(results, indent=2))
