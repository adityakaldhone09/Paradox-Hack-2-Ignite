from app.core.security import verify_password, get_password_hash, create_access_token, decode_token, sign_data, verify_signature

def test_password_hashing():
    raw_pwd = "SecureTestPassword123"
    hashed = get_password_hash(raw_pwd)
    assert verify_password(raw_pwd, hashed)
    assert not verify_password("WrongPassword", hashed)

def test_jwt_tokens():
    payload = {"sub": "user_123", "email": "test@veriq.local", "role": "EXAM_AUTHORITY"}
    token = create_access_token(payload)
    decoded = decode_token(token)
    assert decoded is not None
    assert decoded["sub"] == "user_123"
    assert decoded["email"] == "test@veriq.local"

def test_digital_signature():
    message = "PAP-2026-MATH:APPROVED:2026-09-16T12:00:00Z"
    sig = sign_data(message)
    assert verify_signature(message, sig)
    assert not verify_signature(message + "TAMPER", sig)
