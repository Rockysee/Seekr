# The Resilience Matrix: AI-Driven Psychiatric Triage

## Executive Summary
A gamified mental health lead generation system utilizing the **Dual-Continua Model** to map users from 'Flourishing' to 'Crisis'. Designed to eliminate operational leakage and bypass clinical stigma.

## Tech Stack
- **Frontend:** Streamlit
- **Logic:** Python / State-Machine
- **Moat:** Acoustic Biomarkers (Voice Stress Analysis)
- **Automation:** Make.com (optional WhatsApp Business API)

## Clinical Governance
- Non-diagnostic screening tool.
- Ethical override for acute distress (Tele-MANAS integration).
- Data Privacy: Encrypted storage compliant with MHCA 2017.

## Getting Started
1. Copy `.env.example` to `.env` and fill in your secrets.
2. Create & activate a Python virtual environment (recommended):
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the app:
   ```bash
   streamlit run app.py
   ```

## Running Tests

Run the unit tests:

```bash
python -m unittest discover -s tests
```

> ⚠️ **Note:** This project is best run with Python 3.11 / 3.12 due to current incompatibilities between Streamlit's protobuf dependency and Python 3.14.

## 🚀 Deployment

### Streamlit Cloud (Recommended - 5 mins)
See [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step instructions.

**Quick:**
1. Push to GitHub
2. Deploy from [share.streamlit.io](https://share.streamlit.io)
3. Add secrets in Settings
4. ✅ Done!

### Docker
```bash
docker compose up --build
```
Runs on `http://localhost:8501`
