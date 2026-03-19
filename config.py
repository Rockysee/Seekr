"""Configuration loader for The Resilience Matrix.

Loads environment variables from:
- .env file (local development)
- Streamlit secrets.toml (Streamlit Cloud, auto-converted to env vars)
- Environment variables (production)

This module centralizes configuration for:
- WhatsApp / Make.com automation
- Tele-MANAS integration
- Encryption key management
- Deployment-specific overrides

The .env file should not be committed to version control.
"""

from __future__ import annotations

from typing import Optional

from dotenv import load_dotenv
from pydantic import Field, HttpUrl, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

# Load .env from project root (local development)
load_dotenv()


class Settings(BaseSettings):
    """Configuration settings for The Resilience Matrix.
    
    In development: loads from .env file
    In Streamlit Cloud: loads from secrets.toml (auto-converted to env vars)
    """

    # Core app settings
    APP_NAME: str = Field("Resilience Matrix", description="Human-friendly application name")
    ENV: str = Field("development", description="Application environment")
    DEBUG: bool = Field(True, description="Enable debug mode")

    # Encryption key (required in production)
    RESILIENCE_MASTER_KEY: Optional[SecretStr] = Field(
        None, description="Master key used to derive per-user encryption keys"
    )

    # Make.com webhook URL for orchestration (optional)
    MAKE_COM_WEBHOOK_URL: Optional[HttpUrl] = Field(
        None, description="Make.com scenario webhook that handles escalation workflows"
    )

    # Tele-MANAS integration (optional; for crisis escalation)
    TELE_MANAS_API_URL: Optional[HttpUrl] = Field(
        None, description="Tele-MANAS API base URL"
    )
    TELE_MANAS_API_KEY: Optional[SecretStr] = Field(
        None, description="API key for Tele-MANAS integration"
    )

    # WhatsApp Business (optional)
    WHATSAPP_PHONE_NUMBER_ID: Optional[str] = None
    WHATSAPP_ACCESS_TOKEN: Optional[SecretStr] = None
    WHATSAPP_BUSINESS_ACCOUNT_ID: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        # Prioritize environment variables over defaults
        case_sensitive=False,
    )


# Global settings instance for imports
settings = Settings()


def ensure_required_settings() -> None:
    """Validate required settings for production deployment."""
    if settings.ENV == "production":
        missing = []
        if not settings.RESILIENCE_MASTER_KEY:
            missing.append("RESILIENCE_MASTER_KEY")
        if missing:
            raise RuntimeError(f"Missing required environment variables: {', '.join(missing)}")


if __name__ == "__main__":
    print(settings.model_dump_json(indent=2, exclude_none=True))
