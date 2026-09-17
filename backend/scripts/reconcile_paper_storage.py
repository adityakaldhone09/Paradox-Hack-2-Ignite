import asyncio
import os
import sys
import subprocess
from sqlalchemy import select, text
from datetime import timezone

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.config import settings
from app.core.security import sign_data, verify_signature
from app.db.session import AsyncSessionLocal, engine
from app.models.entities import Paper
from app.services.encryption_service import encryption_service
from app.services.hashing_service import hashing_service
from app.services.storage_service import storage_service

async def reconcile():
    print("=" * 70)
    print("🔍 VeriQ Paper Storage & Cryptographic Reconciliation Utility")
    print("=" * 70)

    # 1. Ensure DB schema has storage_bucket and storage_object_path columns
    print("🛠️  Step 1: Ensuring database schema has canonical storage columns...")
    async with engine.begin() as conn:
        try:
            await conn.execute(text("ALTER TABLE papers ADD COLUMN IF NOT EXISTS storage_bucket VARCHAR(100) DEFAULT 'encrypted_papers';"))
            await conn.execute(text("ALTER TABLE papers ADD COLUMN IF NOT EXISTS storage_object_path VARCHAR(500);"))
            print("   ✅ Schema verified / upgraded successfully.")
        except Exception as e:
            print(f"   ℹ️ Schema check: {e}")

    # 2. Ensure storage directory exists
    os.makedirs(settings.STORAGE_DIR, exist_ok=True)
    print(f"📁 Storage directory: {settings.STORAGE_DIR}")

    # 3. Process all papers
    async with AsyncSessionLocal() as session:
        res = await session.execute(select(Paper).order_by(Paper.created_at.asc()))
        papers = res.scalars().all()
        print(f"📋 Found {len(papers)} paper records in database.\n")

        recovered_count = 0
        verified_count = 0
        failed_count = 0

        repo_root = os.path.abspath(os.path.join(settings.BASE_DIR, ".."))

        for p in papers:
            print(f"📄 Checking [{p.paper_id}] - \"{p.title}\"")
            dest_file = os.path.join(settings.STORAGE_DIR, f"{p.paper_id}.enc")
            ciphertext = None

            # Check if already present on disk
            if os.path.exists(dest_file):
                with open(dest_file, "rb") as f:
                    ciphertext = f.read()
                print(f"   ✓ File already present on disk ({len(ciphertext)} bytes)")
            else:
                # Try locating through storage_service candidates
                path, _ = storage_service.locate_artifact_path(p)
                if path and os.path.exists(path):
                    with open(path, "rb") as f:
                        ciphertext = f.read()
                    print(f"   ✓ Found artifact at candidate path: {path}")
                    # Standardize to {paper_id}.enc
                    with open(dest_file, "wb") as f:
                        f.write(ciphertext)
                else:
                    # Attempt recovery from Git tree object database (commit d4c3547^)
                    try:
                        git_path = f"d4c3547^:backend/storage/encrypted_papers/{p.paper_id}.enc"
                        git_out = subprocess.check_output(["git", "cat-file", "-p", git_path], cwd=repo_root)
                        with open(dest_file, "wb") as f:
                            f.write(git_out)
                        ciphertext = git_out
                        print(f"   ♻️ Restored authentic artifact from git history ({len(ciphertext)} bytes)")
                        recovered_count += 1
                    except Exception as ge:
                        print(f"   ⚠️ Could not recover from git: {ge}")

            if not ciphertext:
                print(f"   ❌ FAILED: No encrypted artifact available for {p.paper_id}")
                failed_count += 1
                continue

            # Verify cryptographic validity
            try:
                decrypted = encryption_service.decrypt(ciphertext, p.encryption_iv, p.encryption_tag)
                calculated_hash = hashing_service.calculate_file_hash(decrypted)

                if calculated_hash.lower() == p.sha256_hash.lower():
                    print(f"   🔒 Cryptographic Match: SHA-256 verified ({calculated_hash[:16]}...)")
                    verified_count += 1
                else:
                    print(f"   ❌ HASH MISMATCH! Calculated: {calculated_hash} vs DB: {p.sha256_hash}")
                    failed_count += 1
                    continue
            except Exception as de:
                print(f"   ❌ DECRYPTION FAILED: {de}")
                failed_count += 1
                continue

            # Verify or generate authority digital signature
            expected_sig_payload = f"{p.paper_id}:{p.sha256_hash}"
            if not p.digital_signature or not verify_signature(expected_sig_payload, p.digital_signature):
                p.digital_signature = sign_data(expected_sig_payload)
                print(f"   ✍️ Authority digital signature generated and attached")
            else:
                print(f"   ✍️ Authority digital signature valid")

            # Canonicalize storage references
            p.storage_bucket = "encrypted_papers"
            p.storage_object_path = f"encrypted_papers/{p.paper_id}.enc"
            p.encrypted_file_path = dest_file

        await session.commit()
        print("\n" + "=" * 70)
        print(f"🎉 Reconciliation Summary:")
        print(f"   Total Papers:       {len(papers)}")
        print(f"   Recovered Files:    {recovered_count}")
        print(f"   Verified Valid:     {verified_count}")
        print(f"   Failed / Incomplete:{failed_count}")
        print("=" * 70)

if __name__ == "__main__":
    asyncio.run(reconcile())
