import pytest
from app.services.hashing_service import hashing_service
from app.services.encryption_service import encryption_service

def test_sha256_hashing():
    sample_text = b"VeriQ Confidential Question Paper Set 2026"
    hash1 = hashing_service.calculate_file_hash(sample_text)
    hash2 = hashing_service.calculate_file_hash(sample_text)
    assert len(hash1) == 64
    assert hash1 == hash2

    tampered_text = b"VeriQ Confidential Question Paper Set 2026 - MODIFIED"
    tampered_hash = hashing_service.calculate_file_hash(tampered_text)
    assert hash1 != tampered_hash
    assert not hashing_service.verify_integrity(tampered_text, hash1)

def test_aes_256_gcm_encryption_and_decryption():
    plaintext = b"SECRET_EXAM_QUESTIONS_DATA_TOP_SECRET"
    ciphertext, iv_hex, tag_hex = encryption_service.encrypt(plaintext)
    
    assert len(iv_hex) == 24  # 12 bytes = 24 hex chars
    assert len(tag_hex) == 32 # 16 bytes = 32 hex chars
    assert ciphertext != plaintext

    recovered = encryption_service.decrypt(ciphertext, iv_hex, tag_hex)
    assert recovered == plaintext

def test_aes_gcm_tamper_detection():
    plaintext = b"TAMPER_TEST_DATA"
    ciphertext, iv_hex, tag_hex = encryption_service.encrypt(plaintext)
    
    # Tamper with single byte in ciphertext
    tampered_ciphertext = bytearray(ciphertext)
    tampered_ciphertext[0] ^= 0xFF
    
    with pytest.raises(Exception):
        encryption_service.decrypt(bytes(tampered_ciphertext), iv_hex, tag_hex)

def test_merkle_root():
    hashes = [
        "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e"
    ]
    merkle = hashing_service.compute_merkle_root(hashes)
    assert len(merkle) == 64
