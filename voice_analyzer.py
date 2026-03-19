"""
Acoustic Biomarker Analysis Module
Extracts voice stress indicators for mental health assessment
"""

import numpy as np
import librosa
import soundfile as sf
from scipy import signal, stats
from pathlib import Path
from typing import Tuple, Dict, Optional
from dataclasses import dataclass
from datetime import datetime


@dataclass
class VoiceAnalysisResult:
    """Container for voice stress analysis output"""
    timestamp: datetime
    stress_score: float  # 0-1 normalized stress level
    pitch_features: Dict[str, float]
    prosody_features: Dict[str, float]
    temporal_features: Dict[str, float]
    overall_confidence: float
    interpretation: str


class AcousticBiomarkerAnalyzer:
    """
    Analyzes voice recordings for stress indicators
    Uses prosody, pitch, and temporal features as proxies for mental state
    """
    
    def __init__(self, sample_rate: int = 44100):
        self.sample_rate = sample_rate
        self.feature_cache = {}
    
    def analyze_audio_file(self, audio_path: str) -> VoiceAnalysisResult:
        """
        Load and analyze audio file
        
        Args:
            audio_path: Path to WAV/MP3 audio file
            
        Returns:
            VoiceAnalysisResult with stress indicators
        """
        # Load audio
        y, sr = librosa.load(audio_path, sr=self.sample_rate)
        
        return self.analyze_audio_array(y, sr)
    
    def analyze_audio_array(
        self,
        audio_array: np.ndarray,
        sample_rate: Optional[int] = None
    ) -> VoiceAnalysisResult:
        """
        Analyze raw audio array
        
        Args:
            audio_array: Raw audio samples
            sample_rate: Sample rate (uses instance default if None)
            
        Returns:
            VoiceAnalysisResult
        """
        sr = sample_rate or self.sample_rate
        
        # Extract features
        pitch_features = self._extract_pitch_features(audio_array, sr)
        prosody_features = self._extract_prosody_features(audio_array, sr)
        temporal_features = self._extract_temporal_features(audio_array, sr)
        
        # Compute stress score
        stress_score = self._compute_stress_score(
            pitch_features,
            prosody_features,
            temporal_features
        )
        
        # Generate interpretation
        interpretation = self._interpret_stress(stress_score)
        
        return VoiceAnalysisResult(
            timestamp=datetime.now(),
            stress_score=stress_score,
            pitch_features=pitch_features,
            prosody_features=prosody_features,
            temporal_features=temporal_features,
            overall_confidence=0.75,  # Placeholder - varies by model training
            interpretation=interpretation
        )
    
    # ────────────────────────────────────────────────────────────
    # FEATURE EXTRACTION METHODS
    # ────────────────────────────────────────────────────────────
    
    def _extract_pitch_features(self, y: np.ndarray, sr: int) -> Dict[str, float]:
        """Extract F0 (fundamental frequency) features"""
        
        # Compute fundamental frequency
        f0 = librosa.yin(y, 40, 400, sr=sr)
        
        # Remove unvoiced frames (likely NaN or zero)
        f0_voiced = f0[f0 > 0]
        
        if len(f0_voiced) == 0:
            return {
                "mean_pitch": 0,
                "pitch_std": 0,
                "pitch_range": 0,
                "pitch_stability": 0
            }
        
        return {
            "mean_pitch": float(np.nanmean(f0_voiced)),
            "pitch_std": float(np.nanstd(f0_voiced)),
            "pitch_range": float(np.nanmax(f0_voiced) - np.nanmin(f0_voiced)),
            "pitch_stability": float(1.0 - (np.nanstd(f0_voiced) / (np.nanmean(f0_voiced) + 1e-6)))
        }
    
    def _extract_prosody_features(self, y: np.ndarray, sr: int) -> Dict[str, float]:
        """Extract prosodic features (rhythm, energy patterns)"""
        
        # Speech rate via zero-crossing rate
        zcr = librosa.feature.zero_crossing_rate(y)[0]
        
        # Speech energy
        energy = np.abs(librosa.stft(y)) ** 2
        energy_contour = np.sqrt(np.sum(energy, axis=0))
        
        # Pause detection (low energy frames)
        energy_threshold = np.median(energy_contour) * 0.2
        pauses = np.sum(energy_contour < energy_threshold)
        speech_fraction = 1.0 - (pauses / len(energy_contour))
        
        return {
            "mean_zcr": float(np.mean(zcr)),
            "zcr_std": float(np.std(zcr)),
            "mean_energy": float(np.mean(energy_contour)),
            "energy_std": float(np.std(energy_contour)),
            "speech_fraction": float(speech_fraction),
            "pause_count": float(pauses)
        }
    
    def _extract_temporal_features(self, y: np.ndarray, sr: int) -> Dict[str, float]:
        """Extract timing and rhythm features"""
        
        # Onset detection (speech beats)
        onset_frames = librosa.onset.onset_detect(y=y, sr=sr)
        onsets_per_sec = len(onset_frames) / (len(y) / sr)
        
        # Spectral centroid (brightness, typically lower in stressed speech)
        spec_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
        
        # MFCC coefficients (cepstral features)
        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        mfcc_delta = librosa.feature.delta(mfcc)
        mfcc_delta_mean = np.mean(np.abs(mfcc_delta))
        
        return {
            "onsets_per_second": float(onsets_per_sec),
            "mean_spectral_centroid": float(np.mean(spec_centroid)),
            "spectral_centroid_std": float(np.std(spec_centroid)),
            "mfcc_delta_activity": float(mfcc_delta_mean),
        }
    
    # ────────────────────────────────────────────────────────────
    # STRESS SCORING
    # ────────────────────────────────────────────────────────────
    
    def _compute_stress_score(
        self,
        pitch_features: Dict,
        prosody_features: Dict,
        temporal_features: Dict
    ) -> float:
        """
        Compute normalized stress score (0-1)
        
        Stress indicators:
        - High pitch variance (unstable voice)
        - Low pitch stability
        - Reduced speech fraction (hesitations/pauses)
        - Abnormal speech rate (zcr)
        - Lower spectral brightness
        """
        
        scores = []
        
        # Pitch stability (lower is more stressed)
        if pitch_features["pitch_stability"] > 0:
            stability_score = pitch_features["pitch_stability"]
            scores.append((1.0 - stability_score, 0.25))  # Weight: 0.25
        
        # Speech fragmentation (more pauses = more stress)
        if prosody_features["speech_fraction"] > 0:
            fragmentation = 1.0 - prosody_features["speech_fraction"]
            scores.append((fragmentation, 0.25))
        
        # Speech rate anomaly
        zcr_normalcy = 1.0 / (1.0 + abs(prosody_features["mean_zcr"] - 0.1))
        scores.append((1.0 - zcr_normalcy, 0.15))
        
        # Spectral brightness (lower = more stressed)
        centroid_norm = temporal_features["mean_spectral_centroid"] / 8000.0  # Normalize
        centroid_stress = 1.0 - np.clip(centroid_norm, 0, 1)
        scores.append((centroid_stress, 0.20))
        
        # Rhythmic instability
        if temporal_features["mfcc_delta_activity"] > 0:
            rhythm_stress = np.clip(temporal_features["mfcc_delta_activity"] / 0.5, 0, 1)
            scores.append((rhythm_stress, 0.15))
        
        # Weighted average
        if scores:
            total_weight = sum(w for _, w in scores)
            stress_score = sum(s * w for s, w in scores) / total_weight
        else:
            stress_score = 0.5
        
        return float(np.clip(stress_score, 0, 1))
    
    def _interpret_stress(self, stress_score: float) -> str:
        """Generate human-readable interpretation"""
        
        if stress_score < 0.2:
            return "🟢 Very Low Stress - Voice patterns indicate calm, stable emotional state"
        elif stress_score < 0.4:
            return "🟢 Low Stress - Generally composed speech patterns detected"
        elif stress_score < 0.6:
            return "🟡 Moderate Stress - Some vocal characteristics suggest mild tension"
        elif stress_score < 0.8:
            return "🔴 High Stress - Voice analysis indicates significant stress markers"
        else:
            return "🔴 Very High Stress - Multiple indicators suggest acute stress response"


class VoiceDatastore:
    """Manages encrypted storage of voice recordings and metadata"""
    
    def __init__(self, storage_path: str = "./data/voice_recordings"):
        self.storage_path = Path(storage_path)
        self.storage_path.mkdir(parents=True, exist_ok=True)
        self.metadata = {}
    
    def save_recording(
        self,
        user_id: str,
        audio_array: np.ndarray,
        sample_rate: int,
        analysis_result: VoiceAnalysisResult
    ) -> str:
        """
        Save audio recording with metadata
        In production, audio would be encrypted before storage
        
        Returns:
            Recording ID
        """
        
        recording_id = f"{user_id}_{datetime.now().timestamp()}"
        
        # In production: Encrypt audio_array before saving
        wav_path = self.storage_path / f"{recording_id}.wav"
        sf.write(str(wav_path), audio_array, sample_rate)
        
        # Store metadata
        self.metadata[recording_id] = {
            "user_id": user_id,
            "timestamp": analysis_result.timestamp.isoformat(),
            "stress_score": analysis_result.stress_score,
            "interpretation": analysis_result.interpretation,
            "confidence": analysis_result.overall_confidence
        }
        
        return recording_id


# ────────────────────────────────────────────────────────────────
# Factory function for Streamlit integration
# ────────────────────────────────────────────────────────────────

def create_analyzer() -> AcousticBiomarkerAnalyzer:
    """Factory for instantiating analyzer"""
    return AcousticBiomarkerAnalyzer()


if __name__ == "__main__":
    # Demo usage
    analyzer = create_analyzer()
    
    # Create synthetic audio (silence + speech simulation)
    sr = 44100
    duration = 3  # seconds
    t = np.linspace(0, duration, int(sr * duration))
    
    # Simulate speech-like signal
    f0 = 120  # Hz (male voice baseline)
    y = np.sin(2 * np.pi * f0 * t)
    y += 0.1 * np.sin(2 * np.pi * 200 * t)  # Formant
    y += 0.05 * np.random.randn(len(y))  # Noise
    
    result = analyzer.analyze_audio_array(y, sr)
    print(f"Stress Score: {result.stress_score:.2f}")
    print(f"Interpretation: {result.interpretation}")
    print(f"Pitch Mean: {result.pitch_features['mean_pitch']:.1f} Hz")
