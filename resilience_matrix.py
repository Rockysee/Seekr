"""
Dual-Continua Model State Machine
Maps users across Mental Health (Flourishing ↔ Crisis)
and Resilience dimensions (High ↔ Low)
"""

from transitions import Machine
from enum import Enum
from typing import Optional, Dict, Any
from datetime import datetime
from dataclasses import dataclass


class MentalHealthState(Enum):
    """Primary mental health trajectory"""
    FLOURISHING = "flourishing"
    STABLE = "stable"
    LANGUISHING = "languishing"
    DISTRESSED = "distressed"
    CRISIS = "crisis"


class ResilienceLevel(Enum):
    """Resilience dimension (secondary indicator)"""
    HIGH = "high"
    MODERATE = "moderate"
    LOW = "low"


@dataclass
class UserCheckpoint:
    """Represents a user's health state at a point in time"""
    mental_health: MentalHealthState
    resilience: ResilienceLevel
    timestamp: datetime
    score: float  # 0-100 composite score
    risk_flag: bool = False
    acoustic_marker: Optional[float] = None  # Voice stress (0-1)


class ResilienceMatrix:
    """
    Dual-Continua state machine managing user journey
    through mental health and resilience dimensions
    """

    def __init__(self, user_id: str):
        self.user_id = user_id
        self.checkpoints: list[UserCheckpoint] = []
        
        # Define states: combination of (MentalHealth, Resilience)
        self.states = [
            f"{mh.value}_{res.value}"
            for mh in MentalHealthState
            for res in ResilienceLevel
        ]
        
        # Initialize state machine
        self.machine = Machine(
            model=self,
            states=self.states,
            initial="flourishing_high",
            auto_transitions=False,
            ordered_transitions=False
        )
        
        # Register transitions (movement across continua)
        self._register_transitions()
    
    def _register_transitions(self):
        """Define allowed state transitions"""
        
        # Positive transitions (towards flourishing)
        self.machine.add_transition(
            'improve',
            '*',
            'flourishing_high',
            before='log_transition',
            after='record_checkpoint'
        )
        
        # Degradation transitions (towards crisis)
        self.machine.add_transition(
            'deteriorate',
            ['flourishing_high', 'flourishing_moderate'],
            'distressed_moderate',
            before='log_transition',
            after=['record_checkpoint', 'alert_escalation']
        )
        
        self.machine.add_transition(
            'acute_crisis',
            '*',
            'crisis_low',
            before='log_transition',
            after=['record_checkpoint', 'trigger_emergency_protocol']
        )
        
        # Lateral resilience adjustments (managed manually)
        # The helper methods compute a new state and update the machine directly.
    
    def log_transition(self) -> None:
        """Log state changes"""
        print(f"[{self.user_id}] Transition @ {datetime.now().isoformat()}: {self.state}")
    
    def record_checkpoint(self) -> None:
        """Record current state as checkpoint"""
        checkpoint = UserCheckpoint(
            mental_health=self._parse_mental_health(self.state),
            resilience=self._parse_resilience(self.state),
            timestamp=datetime.now(),
            score=self._calculate_score(),
            risk_flag=self._assess_risk()
        )
        self.checkpoints.append(checkpoint)
    
    def alert_escalation(self) -> None:
        """Trigger alert for health degradation"""
        latest = self.checkpoints[-1] if self.checkpoints else None
        if latest:
            latest.risk_flag = True
    
    def trigger_emergency_protocol(self) -> None:
        """Activate acute distress override (Tele-MANAS integration)"""
        print(f"⚠️ EMERGENCY: Acute crisis detected for {self.user_id}")
        print("→ Initiating Tele-MANAS integration")
        # Make.com webhook / WhatsApp escalation would be triggered here
    
    def _parse_mental_health(self, state: str) -> MentalHealthState:
        """Extract mental health component from state"""
        mh_part = state.rsplit('_', 1)[0]
        return MentalHealthState(mh_part)
    
    def _parse_resilience(self, state: str) -> ResilienceLevel:
        """Extract resilience component from state"""
        res_part = state.rsplit('_', 1)[1]
        return ResilienceLevel(res_part)
    
    def _increase_resilience(self) -> str:
        """Upgrade resilience within current mental health level"""
        mh = self._parse_mental_health(self.state)
        res = self._parse_resilience(self.state)
        
        resilience_order = [ResilienceLevel.LOW, ResilienceLevel.MODERATE, ResilienceLevel.HIGH]
        idx = resilience_order.index(res)
        new_res = resilience_order[min(idx + 1, len(resilience_order) - 1)]
        
        return f"{mh.value}_{new_res.value}"
    
    def _decrease_resilience(self) -> str:
        """Downgrade resilience within current mental health level"""
        mh = self._parse_mental_health(self.state)
        res = self._parse_resilience(self.state)
        
        resilience_order = [ResilienceLevel.LOW, ResilienceLevel.MODERATE, ResilienceLevel.HIGH]
        idx = resilience_order.index(res)
        new_res = resilience_order[max(idx - 1, 0)]
        
        return f"{mh.value}_{new_res.value}"
    
    def build_resilience(self) -> None:
        """Increase resilience level within current mental health state."""
        next_state = self._increase_resilience()
        self.machine.set_state(next_state, self)
        self.log_transition()
        self.record_checkpoint()

    def lose_resilience(self) -> None:
        """Decrease resilience level within current mental health state."""
        next_state = self._decrease_resilience()
        self.machine.set_state(next_state, self)
        self.log_transition()
        self.record_checkpoint()
    
    def _calculate_score(self) -> float:
        """Compute composite health score (0-100)"""
        mh = self._parse_mental_health(self.state)
        res = self._parse_resilience(self.state)
        
        # Mental health weight: 60%, resilience: 40%
        mh_scores = {
            MentalHealthState.FLOURISHING: 100,
            MentalHealthState.STABLE: 75,
            MentalHealthState.LANGUISHING: 50,
            MentalHealthState.DISTRESSED: 25,
            MentalHealthState.CRISIS: 0
        }
        
        res_scores = {
            ResilienceLevel.HIGH: 100,
            ResilienceLevel.MODERATE: 50,
            ResilienceLevel.LOW: 0
        }
        
        return (mh_scores[mh] * 0.6) + (res_scores[res] * 0.4)
    
    def _assess_risk(self) -> bool:
        """Determine if current state poses acute risk"""
        score = self._calculate_score()
        return score < 25  # Distressed + Low resilience
    
    def integrate_acoustic_marker(self, voice_stress: float) -> None:
        """
        Incorporate voice stress analysis (0-1 scale)
        Influences resilience assessment
        """
        if self.checkpoints:
            self.checkpoints[-1].acoustic_marker = voice_stress
            
            # If stress detected, reduce resilience temporarily
            if voice_stress > 0.7:  # High stress threshold
                self.lose_resilience()
                self.record_checkpoint()
    
    def get_current_checkpoint(self) -> Optional[UserCheckpoint]:
        """Retrieve latest health checkpoint"""
        return self.checkpoints[-1] if self.checkpoints else None
    
    def get_trajectory(self, limit: int = 10) -> list[UserCheckpoint]:
        """Retrieve recent trajectory (for analytics)"""
        return self.checkpoints[-limit:]


# Module initialization function for Streamlit
def create_user_matrix(user_id: str) -> ResilienceMatrix:
    """Factory function to instantiate a new user matrix"""
    return ResilienceMatrix(user_id)
