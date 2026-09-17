import os
import re
from typing import Tuple, Optional, Dict, Any, List
from app.core.config import settings

class StorageError(Exception):
    def __init__(self, code: str, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(message)
        self.code = code
        self.message = message
        self.details = details or {}

class StorageReferenceMissingError(StorageError):
    def __init__(self, message: str = "Encrypted artifact reference missing in paper record"):
        super().__init__("STORAGE_REFERENCE_MISSING", message)

class StorageArtifactNotFoundError(StorageError):
    def __init__(self, target_path: str, message: str = "Encrypted off-chain paper artifact not found in storage"):
        super().__init__("STORAGE_ARTIFACT_NOT_FOUND", message, {"searched_path": target_path})

class StorageReadError(StorageError):
    def __init__(self, target_path: str, reason: str):
        super().__init__("STORAGE_READ_ERROR", f"Failed to read encrypted paper artifact: {reason}", {"path": target_path})

class StorageService:
    def __init__(self, storage_dir: Optional[str] = None):
        self.storage_dir = storage_dir or settings.STORAGE_DIR
        os.makedirs(self.storage_dir, exist_ok=True)

    def normalize_filename(self, raw_path: Optional[str]) -> Optional[str]:
        if not raw_path:
            return None
        # Handle both Windows ('\') and POSIX ('/') separators
        clean = raw_path.replace("\\", "/")
        return clean.split("/")[-1]

    def store_encrypted_artifact(
        self,
        identifier: str,
        ciphertext: bytes,
        bucket: str = "encrypted_papers"
    ) -> Tuple[str, str]:
        """
        Store encrypted paper artifact atomically in off-chain private storage.
        Returns:
            Tuple of (canonical_object_path, absolute_storage_path)
        """
        filename = f"{identifier}.enc" if not identifier.endswith(".enc") else identifier
        canonical_object_path = f"{bucket}/{filename}"
        absolute_path = os.path.join(self.storage_dir, filename)

        temp_path = f"{absolute_path}.tmp.{os.getpid()}"
        try:
            with open(temp_path, "wb") as f:
                f.write(ciphertext)
            os.replace(temp_path, absolute_path)
        except Exception as e:
            if os.path.exists(temp_path):
                os.remove(temp_path)
            raise StorageError("STORAGE_WRITE_FAILED", f"Failed to write encrypted artifact: {e}")

        return canonical_object_path, absolute_path

    def locate_artifact_path(self, paper: Any) -> Tuple[Optional[str], List[str]]:
        """
        Resolve the canonical storage path on disk for a paper record,
        handling canonical relative references, legacy absolute paths, and standard naming conventions
        across any deployment working directory (e.g. Render, Docker, local).
        """
        # Determine all candidate storage directories across various runtime roots
        search_dirs: List[str] = []
        for d in [
            self.storage_dir,
            os.path.abspath(self.storage_dir) if self.storage_dir else None,
            os.path.join(settings.BASE_DIR, "storage", "encrypted_papers"),
            os.path.join(settings.BASE_DIR, "backend", "storage", "encrypted_papers"),
            os.path.join(os.getcwd(), "storage", "encrypted_papers"),
            os.path.join(os.getcwd(), "backend", "storage", "encrypted_papers"),
        ]:
            if d and d not in search_dirs:
                search_dirs.append(d)

        # Collect candidate filenames
        filenames: List[str] = []
        storage_object_path = getattr(paper, "storage_object_path", None)
        if storage_object_path:
            norm = self.normalize_filename(storage_object_path)
            if norm and norm not in filenames:
                filenames.append(norm)

        direct_path = getattr(paper, "encrypted_file_path", None)
        if direct_path:
            if os.path.exists(direct_path) and os.path.isfile(direct_path):
                return direct_path, [direct_path]
            norm_direct = self.normalize_filename(direct_path)
            if norm_direct and norm_direct not in filenames:
                filenames.append(norm_direct)

        paper_id = getattr(paper, "paper_id", None)
        if paper_id:
            name = f"{paper_id}.enc"
            if name not in filenames:
                filenames.append(name)

        db_id = getattr(paper, "id", None)
        if db_id:
            name = f"{db_id}.enc"
            if name not in filenames:
                filenames.append(name)

        # Build candidate file paths across all candidate directories
        candidates: List[str] = []
        for sdir in search_dirs:
            for fname in filenames:
                candidate = os.path.join(sdir, fname)
                if candidate not in candidates:
                    candidates.append(candidate)

        for path in candidates:
            if os.path.exists(path) and os.path.isfile(path):
                return path, candidates

        return None, candidates

    def resolve_encrypted_paper_artifact(self, paper: Any) -> Tuple[bytes, str]:
        """
        Retrieve exact encrypted off-chain bytes for a paper.
        Returns:
            Tuple of (ciphertext_bytes, resolved_path)
        Raises:
            StorageReferenceMissingError
            StorageArtifactNotFoundError
            StorageReadError
        """
        if not getattr(paper, "encrypted_file_path", None) and not getattr(paper, "storage_object_path", None):
            raise StorageReferenceMissingError(f"No storage reference configured for paper {getattr(paper, 'paper_id', 'UNKNOWN')}")

        resolved_path, checked_candidates = self.locate_artifact_path(paper)

        if not resolved_path or not os.path.exists(resolved_path):
            primary_path = checked_candidates[0] if checked_candidates else "unknown"
            raise StorageArtifactNotFoundError(
                target_path=primary_path,
                message=f"Encrypted off-chain artifact could not be located on storage for paper {getattr(paper, 'paper_id', 'UNKNOWN')}"
            )

        try:
            with open(resolved_path, "rb") as f:
                ciphertext = f.read()
            if len(ciphertext) == 0:
                raise StorageReadError(resolved_path, "Artifact file is empty (0 bytes)")
            return ciphertext, resolved_path
        except StorageReadError:
            raise
        except Exception as e:
            raise StorageReadError(resolved_path, str(e))

    def verify_artifact_exists(self, paper: Any) -> bool:
        path, _ = self.locate_artifact_path(paper)
        return path is not None and os.path.exists(path)

storage_service = StorageService()
