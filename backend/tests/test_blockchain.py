import pytest
from app.services.blockchain_service import blockchain_service

@pytest.mark.asyncio
async def test_blockchain_transaction_mining():
    tx = await blockchain_service.record_transaction(
        event_type="PAPER_CREATED",
        paper_id="PAP-TEST-01",
        actor_id="tester@veriq.local",
        payload_data={"sha256": "abcdef1234567890"}
    )
    assert tx["tx_hash"].startswith("0x")
    assert tx["block_number"] >= 1
    assert tx["status"] == "CONFIRMED"
    assert tx["event_type"] == "PAPER_CREATED"

@pytest.mark.asyncio
async def test_network_status():
    status = await blockchain_service.get_network_status()
    assert status["status"] == "CONNECTED"
    assert status["block_height"] >= 1
    assert status["total_transactions"] >= 1
