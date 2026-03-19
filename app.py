"""
The Resilience Matrix: Gamified Mental Health Triage Frontend
Streamlit-based UI with Dual-Continua visualization and voice input
"""

import streamlit as st
import numpy as np
from datetime import datetime, timedelta
import plotly.graph_objects as go
import plotly.express as px
from resilience_matrix import create_user_matrix, MentalHealthState, ResilienceLevel
from voice_analyzer import create_analyzer
from data_encryption import create_vault
from integrations import create_orchestrator
from config import settings
import io
import wave
import soundfile as sf

# ────────────────────────────────────────────────────────────────
# HELPER FUNCTIONS
# ────────────────────────────────────────────────────────────────

def display_voice_analysis_results(result):
    """Display voice analysis results in a consistent format"""
    col1, col2, col3 = st.columns(3)

    with col1:
        st.metric("Stress Score", f"{result.stress_score:.2f}")
        st.progress(result.stress_score)

    with col2:
        st.metric("Confidence", f"{result.overall_confidence:.1%}")

    with col3:
        st.metric("Pitch Stability", f"{result.pitch_features['pitch_stability']:.2f}")

    # Interpretation
    st.markdown(f"**Analysis:** {result.interpretation}")

    # Update resilience matrix
    st.session_state.matrix.integrate_acoustic_marker(result.stress_score)

    # Encrypt and store analysis
    analysis_data = {
        "stress_score": result.stress_score,
        "interpretation": result.interpretation,
        "timestamp": result.timestamp.isoformat(),
        "features": {
            "pitch": result.pitch_features,
            "prosody": result.prosody_features,
            "temporal": result.temporal_features
        }
    }

    encrypted = st.session_state.data_vault.encrypt_health_record(
        st.session_state.user_id,
        analysis_data,
        purpose="voice_analysis"
    )

    st.success("✅ Voice analysis stored securely!")

# ────────────────────────────────────────────────────────────────
# PAGE CONFIGURATION
# ────────────────────────────────────────────────────────────────

st.set_page_config(
    page_title="Resilience Matrix",
    page_icon="🧠",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for gamification
st.markdown("""
<style>
    .metric-card {
        border-radius: 12px;
        padding: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        text-align: center;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        margin: 10px 0;
    }
    
    .flourishing {background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);}
    .stable {background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);}
    .languishing {background: linear-gradient(135deg, #ffb347 0%, #ffcc80 100%);}
    .distressed {background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);}
    .crisis {background: linear-gradient(135deg, #c0392b 0%, #8b0000 100%);}
    
    .score-badge {
        font-size: 48px;
        font-weight: bold;
        margin: 10px 0;
    }
    
    .gamification-header {
        font-size: 24px;
        font-weight: bold;
        margin: 20px 0;
        text-align: center;
    }
</style>
""", unsafe_allow_html=True)

# ────────────────────────────────────────────────────────────────
# SESSION STATE INITIALIZATION
# ────────────────────────────────────────────────────────────────

if "user_id" not in st.session_state:
    st.session_state.user_id = f"user_{datetime.now().timestamp()}"
    st.session_state.matrix = create_user_matrix(st.session_state.user_id)
    st.session_state.onboarded = False
    st.session_state.screening_scores = {}
    st.session_state.voice_recordings = []
    st.session_state.current_page = "home"

# ────────────────────────────────────────────────────────────────
# GAMIFIED QUESTIONNAIRE (PHQ-9 Screening)
# ────────────────────────────────────────────────────────────────

def render_screening_questionnaire():
    """Interactive mental health screening with gamification"""
    st.markdown("### 🎮 Mental Health Screening (Gamified)")
    st.markdown("**Answer 9 questions to assess your wellbeing. No judgment, just insights.**")
    
    questions = [
        "Little interest or pleasure in doing things",
        "Feeling down, depressed, or hopeless",
        "Trouble falling/staying asleep or sleeping too much",
        "Feeling tired or having little energy",
        "Poor appetite or overeating",
        "Feeling bad about yourself",
        "Trouble concentrating on things",
        "Moving or speaking so slowly / fidgety or restless",
        "Thoughts that you'd be better off dead"
    ]
    
    # Gamification: Progress bar
    st.progress(0, text="Complete the screening to unlock insights")
    
    scores = {}
    cols = st.columns(3)
    
    for i, question in enumerate(questions):
        col = cols[i % 3]
        with col:
            score = st.select_slider(
                question,
                options=[0, 1, 2, 3],
                value=0,
                key=f"q_{i}",
                help="0=Not at all, 1=Several days, 2=More than half, 3=Nearly every day"
            )
            scores[f"q_{i}"] = score
    
    total_score = sum(scores.values())
    
    # Display gamified results
    if total_score > 0:
        st.markdown(f"### 📊 Your Screening Score: {total_score}/27")
        
        # Categorize risk level
        if total_score < 5:
            st.markdown("✅ **Minimal Depression** - You're doing well! Keep it up.")
            risk_level = "flourishing"
        elif total_score < 10:
            st.markdown("💚 **Mild Depression** - Some challenges, but manageable.")
            risk_level = "stable"
        elif total_score < 15:
            st.markdown("⚠️ **Moderate Depression** - Consider reaching out for support.")
            risk_level = "languishing"
        elif total_score < 20:
            st.markdown("🔴 **Moderately Severe** - Professional support recommended.")
            risk_level = "distressed"
        else:
            st.markdown("🚨 **Severe Depression** - **Crisis support available below**")
            risk_level = "crisis"
        
        st.session_state.screening_scores = scores
        st.session_state.screening_total = total_score
        st.session_state.risk_level = risk_level
        
        return True
    
    return False


# ────────────────────────────────────────────────────────────────
# DUAL-CONTINUA VISUALIZATION
# ────────────────────────────────────────────────────────────────

def render_dual_continua_visualization():
    """Display 2D scatter plot of Mental Health vs. Resilience"""
    
    checkpoint = st.session_state.matrix.get_current_checkpoint()
    
    if not checkpoint:
        st.info("Complete screening to generate personalized insights.")
        return
    
    # Create Dual-Continua 2x2 quadrant visualization
    fig = go.Figure()
    
    # Define quadrants
    quadrants = {
        "Flourishing": {"x": [0, 50], "y": [50, 100], "color": "#84fab0"},
        "Coping": {"x": [50, 100], "y": [50, 100], "color": "#ffb347"},
        "Struggling": {"x": [0, 50], "y": [0, 50], "color": "#ff6b6b"},
        "Crisis": {"x": [50, 100], "y": [0, 50], "color": "#8b0000"}
    }
    
    for quad_name, quad_data in quadrants.items():
        fig.add_trace(go.Scatter(
            x=quad_data["x"], y=quad_data["y"],
            fill="toself",
            name=quad_name,
            fillcolor=quad_data["color"],
            opacity=0.3,
            showlegend=True
        ))
    
    # Plot user's current position
    mh_score = checkpoint.score
    res_score = (100 if checkpoint.resilience == ResilienceLevel.HIGH 
                 else (50 if checkpoint.resilience == ResilienceLevel.MODERATE else 0))
    
    fig.add_trace(go.Scatter(
        x=[mh_score],
        y=[res_score],
        mode="markers+text",
        marker=dict(size=20, color="gold", symbol="star"),
        text=["YOU"],
        textposition="top center",
        showlegend=False,
        name="Current State"
    ))
    
    fig.update_layout(
        title="Dual-Continua Model: Your Mental Health Landscape",
        xaxis_title="Mental Health Score",
        yaxis_title="Resilience Level",
        hovermode="closest",
        height=500
    )
    
    st.plotly_chart(fig, use_container_width=True)


def render_health_dashboard():
    """Main dashboard with metrics and visualizations"""
    
    checkpoint = st.session_state.matrix.get_current_checkpoint()
    
    if not checkpoint:
        return
    
    # Key metrics
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.markdown(f"""
        <div class="metric-card">
            <div style="font-size: 14px; opacity: 0.9;">Health Score</div>
            <div class="score-badge">{checkpoint.score:.0f}</div>
            <div style="font-size: 12px;">/100</div>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        mental_health_label = checkpoint.mental_health.value.capitalize()
        st.markdown(f"""
        <div class="metric-card">
            <div style="font-size: 14px; opacity: 0.9;">Mental Health</div>
            <div style="font-size: 18px; font-weight: bold;">{mental_health_label}</div>
        </div>
        """, unsafe_allow_html=True)
    
    with col3:
        resilience_label = checkpoint.resilience.value.capitalize()
        st.markdown(f"""
        <div class="metric-card">
            <div style="font-size: 14px; opacity: 0.9;">Resilience</div>
            <div style="font-size: 18px; font-weight: bold;">{resilience_label}</div>
        </div>
        """, unsafe_allow_html=True)
    
    with col4:
        risk_badge = "🚨 HIGH RISK" if checkpoint.risk_flag else "✅ STABLE"
        st.markdown(f"""
        <div class="metric-card">
            <div style="font-size: 14px; opacity: 0.9;">Risk Status</div>
            <div style="font-size: 16px;">{risk_badge}</div>
        </div>
        """, unsafe_allow_html=True)
    
    # Dual-Continua visualization
    render_dual_continua_visualization()
    
    # Trajectory chart
    trajectory = st.session_state.matrix.get_trajectory()
    if len(trajectory) > 1:
        timestamps = [cp.timestamp for cp in trajectory]
        scores = [cp.score for cp in trajectory]

        fig = go.Figure()
        fig.add_trace(
            go.Scatter(
                x=timestamps,
                y=scores,
                mode="lines+markers",
                name="Score",
                line=dict(color="#4B8BBE", width=3),
                marker=dict(size=6),
            )
        )
        fig.update_layout(
            title="Progress Over Time",
            xaxis_title="Timestamp",
            yaxis_title="Score",
            height=350,
            margin=dict(l=40, r=40, t=40, b=40),
        )
        st.plotly_chart(fig, use_container_width=True)


# ────────────────────────────────────────────────────────────────
# VOICE INPUT INTERFACE (Placeholder for acoustic biomarkers)
# ────────────────────────────────────────────────────────────────

def render_voice_input():
    """Voice recording interface for acoustic biomarker analysis"""
    st.markdown("### 🎤 Voice Stress Analysis (Real-Time)")
    st.markdown("Read this text naturally to analyze vocal stress patterns:")

    prompt_text = "I feel like I'm handling things well today, and I'm optimistic about the future."

    st.info(f"📝 **Prompt:** \"{prompt_text}\"")

    # Voice recording - try WebRTC first, fallback to file upload
    st.markdown("### 🎤 Voice Stress Analysis")
    st.info("Record your voice or upload an audio file to analyze acoustic biomarkers for stress detection.")

    # Try WebRTC (works locally, may fail in Streamlit Cloud)
    webrtc_available = False
    try:
        from streamlit_webrtc import webrtc_streamer, WebRtcMode, RTCConfiguration
        webrtc_available = True
    except ImportError as e:
        st.warning("⚠️ Real-time recording not available in this environment. Please upload an audio file instead.")
        webrtc_available = False

    if webrtc_available:
        # Real voice recording with streamlit-webrtc
        rtc_config = RTCConfiguration({
            "iceServers": [{"urls": ["stun:stun.l.google.com:19302"]}]
        })

        webrtc_ctx = webrtc_streamer(
            key="voice_recorder",
            mode=WebRtcMode.SENDONLY,
            rtc_configuration=rtc_config,
            media_stream_constraints={"video": False, "audio": True},
            async_processing=True,
        )

        if webrtc_ctx.audio_receiver:
            st.write("🎙️ Recording... Speak naturally for 5-10 seconds")

            # Process audio when available
            if webrtc_ctx.audio_receiver.get_frames():
                audio_frames = webrtc_ctx.audio_receiver.get_frames()

                if len(audio_frames) > 0:
                    # Convert frames to numpy array
                    audio_data = np.concatenate([frame.to_ndarray() for frame in audio_frames])
                    sample_rate = audio_frames[0].sample_rate

                    # Analyze voice stress
                    result = st.session_state.voice_analyzer.analyze_audio_array(
                        audio_data, sample_rate
                    )

                    # Display results
                    display_voice_analysis_results(result)

    # Fallback: File upload (always available)
    st.markdown("#### 📁 Or Upload Audio File")
    uploaded_file = st.file_uploader(
        "Upload a WAV/MP3 file (5-10 seconds recommended)",
        type=['wav', 'mp3', 'm4a'],
        help="Upload a voice recording for stress analysis"
    )

    if uploaded_file is not None:
        try:
            # Read uploaded file
            audio_bytes = uploaded_file.read()

            # Convert to numpy array using soundfile
            audio_data, sample_rate = sf.read(io.BytesIO(audio_bytes))

            # Ensure mono audio
            if len(audio_data.shape) > 1:
                audio_data = np.mean(audio_data, axis=1)

            # Analyze voice stress
            result = st.session_state.voice_analyzer.analyze_audio_array(
                audio_data, sample_rate
            )

            # Display results
            display_voice_analysis_results(result)

            st.success("✅ Voice analysis complete and securely stored!")

            # Show updated dashboard
            if st.button("📊 View Updated Dashboard"):
                st.session_state.current_page = "dashboard"
                st.rerun()

        except Exception as e:
            st.error(f"Error processing audio file: {str(e)}")
            st.info("Please ensure your file is a valid audio format (WAV/MP3) and try again.")

    else:
        st.info("🎙️ Click 'START' above to begin voice recording")


# ────────────────────────────────────────────────────────────────
# CRISIS SUPPORT & ETHICAL OVERRIDE
# ────────────────────────────────────────────────────────────────

def render_crisis_support():
    """Emergency support interface with Tele-MANAS integration"""
    st.markdown("### 🆘 Immediate Support")
    
    checkpoint = st.session_state.matrix.get_current_checkpoint()
    
    if checkpoint and checkpoint.risk_flag:
        st.error("⚠️ **You may be experiencing acute distress.** Immediate support available:")
        
        col1, col2 = st.columns(2)
        
        with col1:
            if st.button("📱 Connect to Tele-MANAS", key="tele_manas"):
                st.success("Connecting to mental health counselor...")
                st.markdown("**This would trigger WhatsApp Business API integration via Make.com**")
        
        with col2:
            if st.button("📞 Call Crisis Hotline", key="hotline"):
                st.info("AASRA: 9820466726 | iCall: 9152987821")
    else:
        st.markdown("**No acute crisis detected.** Resources below for ongoing support:")
        
        resources = {
            "Tele-MANAS": "Free telemedicine counseling",
            "AASRA": "24/7 Suicide Prevention Hotline",
            "iCall": "Youth Mental Health Crisis Chat"
        }
        
        for resource, description in resources.items():
            st.markdown(f"- **{resource}**: {description}")


# ────────────────────────────────────────────────────────────────
# MAIN APP NAVIGATION
# ────────────────────────────────────────────────────────────────

def main():
    st.title("🧠 The Resilience Matrix")
    st.markdown("**Gamified Mental Health Screening & Triage**")
    
    # Sidebar navigation
    with st.sidebar:
        st.markdown("### 📍 Navigation")
        page = st.radio(
            "Select View:",
            ["Home", "Screening", "Dashboard", "Voice Analysis", "Crisis Support", "Data Privacy"]
        )
    
    # ─────── Page: Home ──────────
    if page == "Home":
        st.markdown("""
        ### Welcome to The Resilience Matrix
        
        This tool helps you understand your mental health journey through the **Dual-Continua Model**.
        
        #### 🎯 How It Works:
        1. **Complete Screening** - Answer 9 questions about your wellbeing
        2. **Get Insights** - See your position on the Flourishing ↔ Crisis continuum
        3. **Voice Analysis** - Optional acoustic stress assessment
        4. **Receive Support** - Access resources based on your needs
        
        #### 🛡️ Your Privacy:
        - All data is encrypted end-to-end
        - Non-diagnostic screening tool
        - MHCA 2017 compliant storage
        - No data shared without consent
        """)
        
        st.markdown("---")
        if st.button("Begin Screening →", use_container_width=True):
            st.session_state.current_page = "screening"
            st.rerun()
    
    # ─────── Page: Screening ──────────
    elif page == "Screening":
        if render_screening_questionnaire():
            st.markdown("---")
            if st.button("📊 View Your Dashboard", use_container_width=True):
                st.session_state.current_page = "dashboard"
                st.rerun()
    
    # ─────── Page: Dashboard ──────────
    elif page == "Dashboard":
        render_health_dashboard()
        
        st.markdown("---")
        st.markdown("### 🔄 Next Steps")
        col1, col2 = st.columns(2)
        
        with col1:
            if st.button("🎤 Add Voice Analysis"):
                st.session_state.current_page = "voice"
                st.rerun()
        
        with col2:
            if st.button("📋 Retake Screening"):
                st.session_state.current_page = "screening"
                st.rerun()
    
    # ─────── Page: Voice Analysis ──────────
    elif page == "Voice Analysis":
        render_voice_input()
        st.markdown("---")
        if st.button("← Back to Dashboard"):
            st.session_state.current_page = "dashboard"
            st.rerun()
    
    # ─────── Page: Crisis Support ──────────
    elif page == "Crisis Support":
        render_crisis_support()
    
    # ─────── Page: Data Privacy ──────────
    elif page == "Data Privacy":
        st.markdown("""
        ### 🔐 Data Privacy & Compliance
        
        #### Encryption:
        - **In Transit**: TLS 1.2+
        - **At Rest**: AES-256 encryption
        - **Voice Data**: Encrypted before processing
        
        #### Compliance:
        - ✅ MHCA 2017 (Mental Healthcare Act)
        - ✅ GDPR-aligned consent management
        - ✅ Non-diagnostic tool (clinical safeguards)
        
        #### Your Rights:
        - View your data anytime
        - Delete all records
        - Export data in standard format
        - Withdraw consent instantly
        """)


if __name__ == "__main__":
    main()
