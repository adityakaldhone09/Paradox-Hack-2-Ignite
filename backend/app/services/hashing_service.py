import hashlib
from typing import Union

class HashingService:
    @staticmethod
    def calculate_sha256(data: Union[bytes, str]) -> str:
        """Calculate standard SHA-256 hash in hexadecimal format."""
        if isinstance(data, str):
            data = data.encode('utf-8')
        return hashlib.sha256(data).hexdigest()

    @staticmethod
    def calculate_file_hash(file_bytes: bytes) -> str:
        """Calculate SHA-256 of file buffer."""
        return hashlib.sha256(file_bytes).hexdigest()

    @staticmethod
    def verify_integrity(file_bytes: bytes, expected_hash: str) -> bool:
        """Verify that current file bytes match the expected blockchain-anchored hash."""
        current_hash = hashlib.sha256(file_bytes).hexdigest()
        return current_hash.lower() == expected_hash.lower()

    @staticmethod
    def compute_merkle_root(hashes: list[str]) -> str:
        """Compute Merkle root from a list of hashes."""
        if not hashes:
            return hashlib.sha256(b"").hexdigest()
        current_level = hashes[:]
        while len(current_level) > 1:
            next_level = []
            for i in range(0, len(current_level), 2):
                left = current_level[i]
                right = current_level[i + 1] if i + 1 < len(current_level) else left
                combined = hashlib.sha256((left + right).encode('utf-8')).hexdigest()
                next_level.append(combined)
            current_level = next_level
        return current_level[0]

hashing_service = HashingService()
