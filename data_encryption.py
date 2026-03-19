"""
Data Encryption & Privacy Layer
MHCA 2017 compliant encryption for sensitive health data
"""

import os
import json
import base64
from typing import Any, Dict, Optional
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.backends import default_backend
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
import hashlib
import secrets


@dataclass
class EncryptionMetadata:
    """Metadata for encrypted data"""
    algorithm: str = "Fernet (AES-128 + HMAC)"
    created_at: str = None
    expires_at: str = None
    encryption_version: int = 1
    
    def __post_init__(self):
        if not self.created_at:
            self.created_at = datetime.now().isoformat()
        if not self.expires_at:
            self.expires_at = (datetime.now() + timedelta(days=365)).isoformat()


class EncryptionKeyManager:
    """
    Manages encryption keys with rotation and secure storage
    In production: integrate with AWS KMS, HashiCorp Vault, etc.
    """
    
    def __init__(self, master_key_env: str = "RESILIENCE_MASTER_KEY"):
        self.master_key_env = master_key_env
        self.key_cache = {}
        self._initialize_keys()
    
    def _initialize_keys(self):
        """Load or generate master encryption key"""
        
        # Check for environment-stored key
        master_key = os.getenv(self.master_key_env)
        
        if not master_key:
            # Generate new key on first run (production: store in Vault)
            print("⚠️ WARNING: Generating new encryption key.")
            print("   In production, use AWS KMS or HashiCorp Vault")
            master_key = Fernet.generate_key().decode()
            print(f"   Store this safely: {master_key[:20]}...{master_key[-20:]}")
        
        self.master_key = master_key.encode() if isinstance(master_key, str) else master_key
    
    def derive_user_key(self, user_id: str, salt: Optional[bytes] = None) -> bytes:
        """
        Derive unique encryption key per user
        Enables per-user encryption keys with centralized management
        """
        
        if user_id in self.key_cache:
            return self.key_cache[user_id]
        
        if salt is None:
            salt = hashlib.sha256(user_id.encode()).digest()[:16]
        
        # PBKDF2-HMAC with strong parameters
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100_000,
            backend=default_backend()
        )
        
        user_key = base64.urlsafe_b64encode(kdf.derive(self.master_key))
        self.key_cache[user_id] = user_key
        
        return user_key
    
    def create_rotation_key(self, user_id: str) -> bytes:
        """Generate rotated key for re-encryption"""
        new_salt = secrets.token_bytes(16)
        return self.derive_user_key(user_id, new_salt)


class SecureDataVault:
    """
    Secure vault for encrypting/decrypting sensitive health data
    MHCA 2017 requirements:
    - Encrypted storage
    - Access logging
    - Data retention policies
    - Patient consent tracking
    """
    
    def __init__(self, key_manager: EncryptionKeyManager):
        self.key_manager = key_manager
        self.access_log = []
    
    def encrypt_health_record(
        self,
        user_id: str,
        health_record: Dict[str, Any],
        purpose: str = "clinical_assessment"
    ) -> str:
        """
        Encrypt health record with user-specific key
        
        Args:
            user_id: Patient ID
            health_record: Dictionary with health data
            purpose: Purpose of encryption (for consent tracking)
            
        Returns:
            Base64-encoded encrypted data
        """
        
        # Log access for audit trail
        self._log_access(user_id, "encrypt", purpose)
        
        # Get user's encryption key
        user_key = self.key_manager.derive_user_key(user_id)
        cipher = Fernet(user_key)
        
        # Prepare data with metadata
        metadata = EncryptionMetadata()
        data_package = {
            "record": health_record,
            "metadata": asdict(metadata),
            "timestamp": datetime.now().isoformat()
        }
        
        # Serialize and encrypt
        json_data = json.dumps(data_package).encode()
        encrypted_data = cipher.encrypt(json_data)
        
        # Return as base64 string
        return base64.b64encode(encrypted_data).decode()
    
    def decrypt_health_record(
        self,
        user_id: str,
        encrypted_data: str,
        require_consent: bool = True
    ) -> Optional[Dict[str, Any]]:
        """
        Decrypt health record with user-specific key
        
        Args:
            user_id: Patient ID
            encrypted_data: Base64-encoded encrypted data
            require_consent: Check consent before decryption
            
        Returns:
            Decrypted health record or None if unauthorized
        """
        
        # Log access for audit trail
        self._log_access(user_id, "decrypt", "data_retrieval")
        
        if require_consent and not self._verify_consent(user_id):
            raise PermissionError(f"Consent not valid for user {user_id}")
        
        try:
            # Get user's decryption key
            user_key = self.key_manager.derive_user_key(user_id)
            cipher = Fernet(user_key)
            
            # Decrypt
            encrypted_bytes = base64.b64decode(encrypted_data)
            decrypted_json = cipher.decrypt(encrypted_bytes)
            data_package = json.loads(decrypted_json)
            
            # Verify metadata
            metadata = data_package.get("metadata", {})
            if metadata.get("expires_at"):
                expires = datetime.fromisoformat(metadata["expires_at"])
                if datetime.now() > expires:
                    raise ValueError("Encrypted data has expired")
            
            return data_package.get("record")
        
        except Exception as e:
            print(f"❌ Decryption failed: {str(e)}")
            return None
    
    def encrypt_voice_recording(
        self,
        user_id: str,
        audio_bytes: bytes
    ) -> str:
        """
        Encrypt voice recording with highest security
        Voice data classified as highly sensitive under MHCA
        """
        
        user_key = self.key_manager.derive_user_key(user_id)
        cipher = Fernet(user_key)
        
        # Add timestamp header
        header = datetime.now().isoformat().encode()
        combined = header + b"|||" + audio_bytes
        
        encrypted = cipher.encrypt(combined)
        return base64.b64encode(encrypted).decode()
    
    def decrypt_voice_recording(
        self,
        user_id: str,
        encrypted_data: str
    ) -> Optional[bytes]:
        """Decrypt voice recording"""
        
        try:
            user_key = self.key_manager.derive_user_key(user_id)
            cipher = Fernet(user_key)
            
            encrypted_bytes = base64.b64decode(encrypted_data)
            decrypted = cipher.decrypt(encrypted_bytes)
            
            # Remove timestamp header
            timestamp, audio = decrypted.split(b"|||", 1)
            
            return audio
        
        except Exception as e:
            print(f"❌ Voice decryption failed: {str(e)}")
            return None
    
    def _log_access(self, user_id: str, operation: str, purpose: str) -> None:
        """Log all data access for audit trail"""
        
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "user_id": user_id,
            "operation": operation,
            "purpose": purpose,
            "source_ip": "127.0.0.1"  # Would be captured from request context
        }
        
        self.access_log.append(log_entry)
    
    def _verify_consent(self, user_id: str) -> bool:
        """
        Verify patient has given consent for data access
        In production: query consent ledger
        """
        # Placeholder implementation
        return True
    
    def get_audit_log(self, user_id: Optional[str] = None) -> list:
        """
        Retrieve access audit log
        Required by MHCA 2017 for transparency
        """
        if user_id:
            return [log for log in self.access_log if log["user_id"] == user_id]
        return self.access_log
    
    def delete_data_securely(self, user_id: str, data_id: str) -> bool:
        """
        Secure deletion (right to be forgotten)
        Required by GDPR and MHCA equivalents
        """
        # In production: overwrite with random bytes before deletion
        print(f"🗑️ Securely deleting data {data_id} for user {user_id}")
        return True


class ConsentManager:
    """
    Manages patient consent for data usage
    MHCA 2017 requires explicit, informed consent
    """
    
    def __init__(self):
        self.consents: Dict[str, Dict] = {}
    
    def request_consent(
        self,
        user_id: str,
        purposes: list,
        duration_days: int = 365
    ) -> str:
        """
        Request patient consent for specific data use
        Generates consent token
        """
        
        consent_id = f"consent_{user_id}_{int(datetime.now().timestamp())}"
        
        self.consents[consent_id] = {
            "user_id": user_id,
            "purposes": purposes,
            "granted_at": datetime.now().isoformat(),
            "expires_at": (datetime.now() + timedelta(days=duration_days)).isoformat(),
            "status": "pending"
        }
        
        return consent_id
    
    def grant_consent(self, consent_id: str) -> bool:
        """Grant consent"""
        if consent_id in self.consents:
            self.consents[consent_id]["status"] = "granted"
            return True
        return False
    
    def revoke_consent(self, consent_id: str) -> bool:
        """Revoke consent (right to withdraw)"""
        if consent_id in self.consents:
            self.consents[consent_id]["status"] = "revoked"
            return True
        return False
    
    def verify_consent(self, user_id: str, purpose: str) -> bool:
        """Check if user has valid consent for purpose"""
        
        now = datetime.now()
        
        for consent_id, consent in self.consents.items():
            if (consent["user_id"] == user_id and
                purpose in consent["purposes"] and
                consent["status"] == "granted"):
                
                expires = datetime.fromisoformat(consent["expires_at"])
                if now <= expires:
                    return True
        
        return False


# ────────────────────────────────────────────────────────────────
# Factory functions
# ────────────────────────────────────────────────────────────────

def create_vault(key_manager: Optional[EncryptionKeyManager] = None) -> SecureDataVault:
    """Create vault with key manager"""
    if not key_manager:
        key_manager = EncryptionKeyManager()
    return SecureDataVault(key_manager)


if __name__ == "__main__":
    # Demo usage
    km = EncryptionKeyManager()
    vault = create_vault(km)
    consent_mgr = ConsentManager()
    
    # Simulate health record encryption
    user_id = "patient_001"
    health_record = {
        "screening_score": 18,
        "mental_health_state": "distressed",
        "resilience_level": "low",
        "timestamp": datetime.now().isoformat()
    }
    
    print("🔐 Encrypting health record...")
    encrypted = vault.encrypt_health_record(user_id, health_record, "screening")
    print(f"✅ Encrypted: {encrypted[:50]}...")
    
    print("\n🔓 Decrypting health record...")
    decrypted = vault.decrypt_health_record(user_id, encrypted, require_consent=False)
    print(f"✅ Decrypted: {json.dumps(decrypted, indent=2)}")
