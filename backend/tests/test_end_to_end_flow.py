import pytest
import hashlib
from app.services.hashing_service import hashing_service
from app.services.encryption_service import encryption_service
from app.services.blockchain_service import blockchain_service

@pytest.mark.asyncio
async def test_complete_cryptographic_and_blockchain_lifecycle():
    # 1. Plaintext Question Paper Content
    sample_paper_content = b"""
    UNIVERSAL ACADEMIC BOARD - FINAL EXAMINATION 2026
    Course: CS-301 Advanced Database Systems
    Section A: Explain ACID vs BASE consistency models in distributed ledger systems.
    Section B: Derive the SHA-256 Merkle root for a consortium block containing 4 transactions.
    """
    
    # 2. Compute SHA-256 Plaintext Digest
    plaintext_sha256 = hashing_service.calculate_file_hash(sample_paper_content)
    assert len(plaintext_sha256) == 64
    
    # 3. Authenticated AES-256-GCM Envelope Encryption
    ciphertext, iv_hex, tag_hex = encryption_service.encrypt(sample_paper_content)
    assert ciphertext != sample_paper_content
    assert len(iv_hex) == 24
    assert len(tag_hex) == 32
    
    # Verify Decryption succeeds
    decrypted_content = encryption_service.decrypt(ciphertext, iv_hex, tag_hex)
    assert decrypted_content == sample_paper_content
    
    # 4. Anchor Paper Creation to Blockchain Ledger
    tx1 = await blockchain_service.record_transaction(
        event_type="PAPER_CREATED",
        paper_id="PAP-E2E-TEST-01",
        actor_id="setter@veriq.local",
        payload_data={
            "sha256": plaintext_sha256,
            "cipher": "AES-256-GCM",
            "iv": iv_hex,
            "tag": tag_hex
        }
    )
    assert tx1["status"] == "CONFIRMED"
    assert tx1["tx_hash"].startswith("0x")
    block_num_1 = tx1["block_number"]
    assert block_num_1 >= 1
    
    # 5. Anchor Centre Authorization Event
    tx2 = await blockchain_service.record_transaction(
        event_type="CENTRE_AUTHORIZED",
        paper_id="PAP-E2E-TEST-01",
        actor_id="admin@veriq.local",
        centre_id="CENTRE-C101",
        device_id="DEV-C101-01",
        payload_data={
            "ip_range": "192.168.1.0/24",
            "device_fingerprint": "a1b2c3d4e5f67890"
        }
    )
    assert tx2["status"] == "CONFIRMED"
    assert tx2["previous_hash"] != ""
    assert tx2["block_number"] > block_num_1
    
    # 6. Verify Blockchain Block Hash Chaining
    all_blocks = blockchain_service.get_all_blocks()
    assert len(all_blocks) >= 3 # Genesis + tx1 + tx2
    
    for i in range(1, len(all_blocks)):
        curr_b = all_blocks[i]
        prev_b = all_blocks[i-1]
        assert curr_b["previous_hash"] == prev_b["hash"]
        assert len(curr_b["merkle_root"]) > 2
        assert curr_b["transaction_count"] > 0
        
    # 7. Check Network Telemetry
    net_status = await blockchain_service.get_network_status()
    assert net_status["status"] == "CONNECTED"
    assert net_status["total_transactions"] >= len(all_blocks)
    assert net_status["block_height"] >= 2
