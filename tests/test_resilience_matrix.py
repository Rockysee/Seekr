import unittest

from resilience_matrix import ResilienceMatrix, MentalHealthState, ResilienceLevel


class TestResilienceMatrix(unittest.TestCase):
    def setUp(self):
        self.matrix = ResilienceMatrix(user_id="test_user")

    def test_initial_state(self):
        self.assertEqual(self.matrix.state, "flourishing_high")
        checkpoint = self.matrix.get_current_checkpoint()
        self.assertIsNone(checkpoint)

    def test_improve_transition_records_checkpoint(self):
        self.matrix.improve()
        checkpoint = self.matrix.get_current_checkpoint()
        self.assertIsNotNone(checkpoint)
        self.assertEqual(checkpoint.mental_health, MentalHealthState.FLOURISHING)
        self.assertEqual(checkpoint.resilience, ResilienceLevel.HIGH)

    def test_deteriorate_transition_sets_risk_flag(self):
        self.matrix.deteriorate()
        checkpoint = self.matrix.get_current_checkpoint()
        self.assertTrue(checkpoint.risk_flag)
        self.assertEqual(self.matrix.state, "distressed_moderate")

    def test_acute_crisis_transition(self):
        self.matrix.acute_crisis()
        self.assertEqual(self.matrix.state, "crisis_low")
        checkpoint = self.matrix.get_current_checkpoint()
        self.assertTrue(checkpoint.risk_flag)

    def test_resilience_adjustments(self):
        # Loss then gain should return to original resilience
        self.matrix.lose_resilience()
        self.assertIn("_moderate", self.matrix.state)
        self.matrix.build_resilience()
        self.assertIn("_high", self.matrix.state)


if __name__ == "__main__":
    unittest.main()
