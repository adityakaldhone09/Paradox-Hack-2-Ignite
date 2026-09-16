from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from app.db.session import get_db
from app.models.entities import BlockchainTransaction, Paper
from app.schemas.schemas import TransactionResponse
from app.services.blockchain_service import blockchain_service

router = APIRouter(prefix="/blockchain", tags=["Blockchain Explorer"])

@router.get("/status")
async def get_blockchain_status():
    return await blockchain_service.get_network_status()

@router.get("/blocks")
async def get_blockchain_blocks():
    return blockchain_service.get_all_blocks()

@router.get("/transactions", response_model=List[TransactionResponse])
async def list_blockchain_transactions(
    event_type: Optional[str] = Query(None),
    paper_id: Optional[str] = Query(None),
    limit: int = Query(50),
    db: AsyncSession = Depends(get_db)
):
    query = select(BlockchainTransaction).order_by(BlockchainTransaction.timestamp.desc()).limit(limit)
    if event_type:
        query = query.where(BlockchainTransaction.event_type == event_type)
    if paper_id:
        p = (await db.execute(select(Paper.id).where(or_(Paper.id == paper_id, Paper.paper_id == paper_id)))).scalar_one_or_none()
        if p:
            query = query.where(BlockchainTransaction.paper_id == p)

    res = await db.execute(query)
    txs = res.scalars().all()

    return [
        TransactionResponse(
            tx_hash=t.tx_hash,
            block_number=t.block_number,
            event_type=t.event_type,
            paper_id=t.paper_id,
            actor_id=t.actor_id,
            centre_id=t.centre_id,
            device_id=t.device_id,
            payload_hash=t.payload_hash,
            previous_hash=t.previous_hash,
            signature=t.signature,
            timestamp=t.timestamp.isoformat(),
            status=t.status
        )
        for t in txs
    ]

@router.get("/transactions/{tx_hash}")
async def get_blockchain_transaction(tx_hash: str, db: AsyncSession = Depends(get_db)):
    tx = (await db.execute(select(BlockchainTransaction).where(BlockchainTransaction.tx_hash == tx_hash))).scalars().first()
    if not tx:
        raise HTTPException(status_code=404, detail="Blockchain transaction not found")

    paper = (await db.execute(select(Paper).where(Paper.id == tx.paper_id))).scalars().first()

    return {
        "tx_hash": tx.tx_hash,
        "block_number": tx.block_number,
        "event_type": tx.event_type,
        "paper_id": paper.paper_id if paper else tx.paper_id,
        "paper_title": paper.title if paper else "System Record",
        "actor_id": tx.actor_id,
        "centre_id": tx.centre_id,
        "device_id": tx.device_id,
        "payload_hash": tx.payload_hash,
        "previous_hash": tx.previous_hash,
        "signature": tx.signature,
        "timestamp": tx.timestamp.isoformat(),
        "status": tx.status
    }

@router.get("/papers/{paper_id}")
async def get_paper_blockchain_history(paper_id: str, db: AsyncSession = Depends(get_db)):
    paper = (await db.execute(select(Paper).where(or_(Paper.id == paper_id, Paper.paper_id == paper_id)))).scalars().first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")

    txs = (await db.execute(
        select(BlockchainTransaction)
        .where(BlockchainTransaction.paper_id == paper.id)
        .order_by(BlockchainTransaction.timestamp.desc())
    )).scalars().all()

    return {
        "paper_id": paper.paper_id,
        "title": paper.title,
        "sha256_hash": paper.sha256_hash,
        "transaction_count": len(txs),
        "transactions": [
            {
                "tx_hash": t.tx_hash,
                "block_number": t.block_number,
                "event_type": t.event_type,
                "actor_id": t.actor_id,
                "timestamp": t.timestamp.isoformat(),
                "payload_hash": t.payload_hash,
                "status": t.status
            }
            for t in txs
        ]
    }
