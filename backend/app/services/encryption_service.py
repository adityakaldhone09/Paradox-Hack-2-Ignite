import os
from typing import Tuple
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from app.core.config import settings

class EncryptionService:
    def __init__(self, key_hex: str = None):
        key_str = key_hex or settings.ENCRYPTION_KEY
        # Convert hex string to 32 bytes for AES-256
        self.key = bytes.fromhex(key_str)
        if len(self.key) != 32:
            raise ValueError("Master encryption key must be exactly 32 bytes (64 hex characters) for AES-256")
        self.aesgcm = AESGCM(self.key)

    def encrypt(self, plaintext: bytes, associated_data: bytes = None) -> Tuple[bytes, str, str]:
        """
        Encrypt plaintext using AES-256-GCM.
        Returns:
            (ciphertext, iv_hex, tag_hex)
        Note: AESGCM in cryptography appends the 16-byte authentication tag to the ciphertext.
        """
        # 12-byte (96-bit) IV as recommended for AES-GCM
        iv = os.urandom(12)
        encrypted_data = self.aesgcm.encrypt(iv, plaintext, associated_data)
        
        # Split ciphertext and tag (last 16 bytes is tag)
        ciphertext = encrypted_data[:-16]
        tag = encrypted_data[-16:]
        
        return ciphertext, iv.hex(), tag.hex()

    def decrypt(self, ciphertext: bytes, iv_hex: str, tag_hex: str, associated_data: bytes = None) -> bytes:
        """
        Decrypt ciphertext using AES-256-GCM and verify authentication tag.
        """
        iv = bytes.fromhex(iv_hex)
        tag = bytes.fromhex(tag_hex)
        # Recombine ciphertext + tag for cryptography AESGCM.decrypt
        encrypted_payload = ciphertext + tag
        return self.aesgcm.decrypt(iv, encrypted_payload, associated_data)

encryption_service = EncryptionService()
