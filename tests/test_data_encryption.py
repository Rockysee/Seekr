import unittest

from data_encryption import EncryptionKeyManager, SecureDataVault


class TestDataEncryption(unittest.TestCase):
    def setUp(self):
        self.key_manager = EncryptionKeyManager()
        self.vault = SecureDataVault(self.key_manager)
        self.user_id = "test_user"
        self.record = {"foo": "bar", "score": 42}

    def test_encrypt_decrypt_record(self):
        encrypted = self.vault.encrypt_health_record(self.user_id, self.record, purpose="unit_test")
        self.assertIsInstance(encrypted, str)
        decrypted = self.vault.decrypt_health_record(self.user_id, encrypted, require_consent=False)
        self.assertEqual(decrypted, self.record)

    def test_audit_log_is_recorded(self):
        _ = self.vault.encrypt_health_record(self.user_id, self.record, purpose="audit_test")
        logs = self.vault.get_audit_log(self.user_id)
        self.assertTrue(any(log["operation"] == "encrypt" for log in logs))


if __name__ == "__main__":
    unittest.main()
