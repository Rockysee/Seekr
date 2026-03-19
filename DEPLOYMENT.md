# Streamlit Cloud Deployment Guide

## Quick Start (5 minutes)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial Resilience Matrix commit"
git remote add origin <your-github-repo>
git push -u origin main
```

### Step 2: Deploy to Streamlit Cloud
1. Go to [share.streamlit.io](https://share.streamlit.io)
2. Click **"New app"** → **"From existing repo"**
3. Select:
   - **Repository:** your-github-user/resilience-matrix-app
   - **Branch:** main
   - **Main file path:** app.py
4. Click **"Deploy!"**

### Step 3: Configure Secrets
Once deployed, go to your app's **Settings** (⚙️):
1. Click **"Secrets"**
2. Copy contents from `.streamlit/secrets.toml` and paste them
3. Save

The app will redeploy automatically! 🎉

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `RESILIENCE_MASTER_KEY` | ✅ | Encryption key for health data |
| `MAKE_COM_WEBHOOK_URL` | ❌ | Crisis escalation webhook |
| `TELE_MANAS_API_KEY` | ❌ | Government telemedicine integration |
| `WHATSAPP_ACCESS_TOKEN` | ❌ | WhatsApp Business API (optional) |

## Monitoring

- **View logs:** App → Settings → View logs
- **Check health:** App dashboard shows CPU, RAM, session count
- **Scale up:** Settings → App tier (if needed)

## Troubleshooting

**Module not found errors:**
- Streamlit Cloud will auto-install from `requirements.txt`
- If missing, manually add to requirements.txt and recommit

**Secrets not loading:**
- Ensure keys match exactly (case-sensitive)
- Redeploy after updating secrets

**Out of memory:**
- Upgrade to Streamlit Cloud paid tier
- Or optimize data storage (use S3 for large datasets)

## Performance Tips

1. **Cache expensive operations:**
   ```python
   @st.cache_resource
   def create_analyzer():
       return AcousticBiomarkerAnalyzer()
   ```

2. **Stream large calculations:**
   ```python
   with st.spinner('Analyzing...'):
       result = expensive_function()
   ```

3. **Use session state efficiently:**
   ```python
   if 'key' not in st.session_state:
       st.session_state.key = default_value
   ```

## Cost Estimate

- **Free tier:** Up to 3 apps, 1GB RAM
- **Pro tier:** $5/month per app, dedicated resources
- **For production:** Business tier ($999+/month) with SLA

**Your app fits in free tier!** ✅
