from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from app.db.session import get_db
from app.models.entities import Examination, Paper, PaperCentreAssignment, User
from app.schemas.schemas import ExamCreate, ExamResponse
from app.api.deps import get_current_user, require_roles

router = APIRouter(prefix="/exams", tags=["Examinations"])

@router.get("", response_model=List[ExamResponse])
async def list_examinations(
    search: Optional[str] = Query(None),
    department: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Examination)
    if search:
        query = query.where(
            or_(
                Examination.name.ilike(f"%{search}%"),
                Examination.exam_id.ilike(f"%{search}%"),
                Examination.subject.ilike(f"%{search}%")
            )
        )
    if department:
        query = query.where(Examination.department == department)
    if status:
        query = query.where(Examination.status == status)

    query = query.order_by(Examination.created_at.desc())
    res = await db.execute(query)
    exams = res.scalars().all()

    output = []
    for ex in exams:
        # Count papers
        p_res = await db.execute(select(func.count(Paper.id)).where(Paper.exam_id == ex.id))
        paper_count = p_res.scalar_one() or 0

        # Count assigned centres across papers of this exam
        c_res = await db.execute(
            select(func.count(func.distinct(PaperCentreAssignment.centre_id)))
            .join(Paper, PaperCentreAssignment.paper_id == Paper.id)
            .where(Paper.exam_id == ex.id)
        )
        centres_count = c_res.scalar_one() or 0

        output.append(ExamResponse(
            id=ex.id,
            exam_id=ex.exam_id,
            name=ex.name,
            department=ex.department,
            subject=ex.subject,
            exam_type=ex.exam_type,
            exam_date=ex.exam_date,
            start_time=ex.start_time,
            end_time=ex.end_time,
            security_level=ex.security_level,
            status=ex.status,
            total_papers=paper_count,
            assigned_centres_count=centres_count,
            created_at=ex.created_at
        ))
    return output

@router.post("", response_model=ExamResponse, status_code=status.HTTP_201_CREATED)
async def create_examination(
    req: ExamCreate,
    user: User = Depends(require_roles(["SUPER_ADMIN", "EXAM_AUTHORITY"])),
    db: AsyncSession = Depends(get_db)
):
    existing = await db.execute(select(Examination).where(Examination.exam_id == req.exam_id))
    if existing.scalars().first():
        raise HTTPException(status_code=400, detail=f"Examination ID '{req.exam_id}' already exists")

    exam = Examination(
        name=req.name,
        exam_id=req.exam_id,
        department=req.department,
        subject=req.subject,
        exam_type=req.exam_type,
        exam_date=req.exam_date,
        start_time=req.start_time,
        end_time=req.end_time,
        security_level=req.security_level,
        status="SCHEDULED"
    )
    db.add(exam)
    await db.commit()
    await db.refresh(exam)

    return ExamResponse(
        id=exam.id,
        exam_id=exam.exam_id,
        name=exam.name,
        department=exam.department,
        subject=exam.subject,
        exam_type=exam.exam_type,
        exam_date=exam.exam_date,
        start_time=exam.start_time,
        end_time=exam.end_time,
        security_level=exam.security_level,
        status=exam.status,
        total_papers=0,
        assigned_centres_count=0,
        created_at=exam.created_at
    )

@router.get("/{id}")
async def get_examination(id: str, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    exam_res = await db.execute(select(Examination).where(or_(Examination.id == id, Examination.exam_id == id)))
    exam = exam_res.scalars().first()
    if not exam:
        raise HTTPException(status_code=404, detail="Examination not found")

    papers_res = await db.execute(select(Paper).where(Paper.exam_id == exam.id))
    papers = papers_res.scalars().all()

    return {
        "id": exam.id,
        "exam_id": exam.exam_id,
        "name": exam.name,
        "department": exam.department,
        "subject": exam.subject,
        "exam_type": exam.exam_type,
        "exam_date": exam.exam_date,
        "start_time": exam.start_time,
        "end_time": exam.end_time,
        "security_level": exam.security_level,
        "status": exam.status,
        "created_at": exam.created_at.isoformat(),
        "papers": [
            {
                "id": p.id,
                "paper_id": p.paper_id,
                "title": p.title,
                "sha256_hash": p.sha256_hash,
                "status": p.status,
                "version": p.version
            }
            for p in papers
        ]
    }
