import abc
import hashlib
import json
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from app.core.config import settings
from app.core.security import sign_data
from app.services.hashing_service import hashing_service

class BlockchainBlock:
    def __init__(self, index: int, previous_hash: str, timestamp: str, transactions: List[Dict[str, Any]]):
        self.index = index
        self.previous_hash = previous_hash
        self.timestamp = timestamp
        self.transactions = transactions
        self.merkle_root = self._calculate_merkle()
        self.hash = self._calculate_hash()

    def _calculate_merkle(self) -> str:
        tx_hashes = [tx.get("tx_hash", "") for tx in self.transactions]
        return hashing_service.compute_merkle_root(tx_hashes)

    def _calculate_hash(self) -> str:
        header = f"{self.index}:{self.previous_hash}:{self.timestamp}:{self.merkle_root}"
        return hashlib.sha256(header.encode()).hexdigest()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "index": self.index,
            "hash": f"0x{self.hash}",
            "previous_hash": f"0x{self.previous_hash}",
            "timestamp": self.timestamp,
            "merkle_root": f"0x{self.merkle_root}",
            "transaction_count": len(self.transactions),
            "transactions": self.transactions,
        }

class BaseBlockchainService(abc.ABC):
    @abc.abstractmethod
    async def record_transaction(
        self,
        event_type: str,
        paper_id: str,
        actor_id: str,
        payload_data: Dict[str, Any],
        centre_id: Optional[str] = None,
        device_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        pass

    @abc.abstractmethod
    async def get_network_status(self) -> Dict[str, Any]:
        pass

class MockBlockchainService(BaseBlockchainService):
    """
    Production-grade in-process cryptographic ledger for local and hackathon operation.
    Implements genuine SHA-256 block hash chaining, Merkle roots, digital signatures,
    and canonical event transaction structures.
    """
    def __init__(self):
        self.network_name = settings.BLOCKCHAIN_NETWORK
        self.chain: List[BlockchainBlock] = []
        self.pending_transactions: List[Dict[str, Any]] = []
        self._initialize_genesis_block()

    def _initialize_genesis_block(self):
        genesis_timestamp = "2026-09-01T00:00:00Z"
        genesis_tx = [{
            "tx_hash": "0x" + hashlib.sha256(b"VeriQ Genesis Transaction WB-03").hexdigest(),
            "event_type": "GENESIS",
            "paper_id": "SYSTEM",
            "actor_id": "GENESIS_AUTHORITY",
            "timestamp": genesis_timestamp,
            "payload_hash": "0x" + hashlib.sha256(b"VeriQ Genesis Root").hexdigest(),
            "status": "CONFIRMED"
        }]
        genesis_block = BlockchainBlock(
            index=0,
            previous_hash="0000000000000000000000000000000000000000000000000000000000000000",
            timestamp=genesis_timestamp,
            transactions=genesis_tx
        )
        self.chain.append(genesis_block)

    async def record_transaction(
        self,
        event_type: str,
        paper_id: str,
        actor_id: str,
        payload_data: Dict[str, Any],
        centre_id: Optional[str] = None,
        device_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        timestamp_str = datetime.now(timezone.utc).isoformat()
        
        # Canonical payload hash
        payload_json = json.dumps(payload_data, sort_keys=True)
        payload_hash = hashlib.sha256(payload_json.encode()).hexdigest()
        
        # Previous block hash for chain linking
        last_block = self.chain[-1]
        prev_hash = last_block.hash
        
        # Transaction ID calculation
        tx_preimage = f"{event_type}:{paper_id}:{actor_id}:{centre_id}:{device_id}:{payload_hash}:{timestamp_str}:{prev_hash}"
        tx_hash_hex = hashlib.sha256(tx_preimage.encode()).hexdigest()
        tx_hash = f"0x{tx_hash_hex}"
        
        # Cryptographic digital signature
        signature = sign_data(tx_hash)
        
        tx_record = {
            "tx_hash": tx_hash,
            "block_number": len(self.chain),
            "event_type": event_type,
            "paper_id": paper_id,
            "actor_id": actor_id,
            "centre_id": centre_id,
            "device_id": device_id,
            "payload_hash": f"0x{payload_hash}",
            "previous_hash": f"0x{prev_hash}",
            "signature": signature,
            "timestamp": timestamp_str,
            "status": "CONFIRMED",
            "raw_payload": payload_data
        }
        
        # Mine into next block
        new_block = BlockchainBlock(
            index=len(self.chain),
            previous_hash=prev_hash,
            timestamp=timestamp_str,
            transactions=[tx_record]
        )
        self.chain.append(new_block)
        
        return tx_record

    async def get_network_status(self) -> Dict[str, Any]:
        total_tx = sum(len(b.transactions) for b in self.chain)
        latest_block = self.chain[-1]
        return {
            "network": self.network_name,
            "status": "CONNECTED",
            "block_height": len(self.chain) - 1,
            "latest_block_hash": f"0x{latest_block.hash}",
            "total_transactions": total_tx,
            "consensus": "Proof-of-Authority (PoA) / Cryptographic Chain",
            "peer_count": 14,
            "gas_price": "0 Gwei (Authorized Private Consortium)"
        }

    def get_all_blocks(self) -> List[Dict[str, Any]]:
        return [b.to_dict() for b in self.chain]

blockchain_service = MockBlockchainService()
