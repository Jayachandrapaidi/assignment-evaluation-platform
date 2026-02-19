from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas
from ..ai_engine import calculate_plagiarism, generate_feedback
import os
import shutil
from uuid import uuid4

router = APIRouter(
    prefix="/submissions",
    tags=["Submissions"]
)


# ==========================================
# Create Submission (Text)
# ==========================================
@router.post(
    "/",
    response_model=schemas.SubmissionResponse,
    status_code=status.HTTP_201_CREATED
)
def create_submission(
    data: schemas.SubmissionCreate,
    db: Session = Depends(get_db)
):

    # Validate assignment
    assignment = db.query(models.Assignment).filter(
        models.Assignment.id == data.assignment_id
    ).first()

    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    # Get existing submissions for plagiarism comparison
    existing_submissions = db.query(models.Submission).filter(
        models.Submission.assignment_id == data.assignment_id
    ).all()

    existing_texts = [s.content for s in existing_submissions if s.content]

    # AI Evaluation
    plagiarism = calculate_plagiarism(data.content, existing_texts)
    feedback, score = generate_feedback(data.content)

    submission = models.Submission(
        student_id=data.student_id,
        assignment_id=data.assignment_id,
        content=data.content,
        plagiarism_risk=f"{plagiarism}%",
        score=score,
        feedback=feedback
    )

    db.add(submission)
    db.commit()
    db.refresh(submission)

    return submission


# ==========================================
# Get All Submissions (Instructor)
# ==========================================
@router.get(
    "/",
    response_model=list[schemas.SubmissionResponse]
)
def get_all_submissions(db: Session = Depends(get_db)):
    return db.query(models.Submission).all()


# ==========================================
# Get Submissions By Student (Fix 404 issue)
# ==========================================
@router.get(
    "/student/{student_id}",
    response_model=list[schemas.SubmissionResponse]
)
def get_submissions_by_student(
    student_id: int,
    db: Session = Depends(get_db)
):
    submissions = db.query(models.Submission).filter(
        models.Submission.student_id == student_id
    ).all()

    return submissions


# ==========================================
# Get Submissions By Assignment
# ==========================================
@router.get(
    "/assignment/{assignment_id}",
    response_model=list[schemas.SubmissionResponse]
)
def get_submissions_by_assignment(
    assignment_id: int,
    db: Session = Depends(get_db)
):
    return db.query(models.Submission).filter(
        models.Submission.assignment_id == assignment_id
    ).all()


# ==========================================
# Delete Submission
# ==========================================
@router.delete(
    "/{submission_id}",
    status_code=status.HTTP_200_OK
)
def delete_submission(
    submission_id: int,
    db: Session = Depends(get_db)
):
    submission = db.query(models.Submission).filter(
        models.Submission.id == submission_id
    ).first()

    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    db.delete(submission)
    db.commit()

    return {"message": "Submission deleted successfully"}


# ==========================================
# Delete Feedback (Reset Score + Feedback)
# ==========================================
@router.patch(
    "/{submission_id}",
    response_model=schemas.SubmissionResponse
)
def delete_feedback(
    submission_id: int,
    db: Session = Depends(get_db)
):
    submission = db.query(models.Submission).filter(
        models.Submission.id == submission_id
    ).first()

    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    submission.feedback = None
    submission.score = None

    db.commit()
    db.refresh(submission)

    return submission


# ==========================================
# Upload PDF
# ==========================================
@router.post("/upload", status_code=status.HTTP_201_CREATED)
def upload_pdf(
    student_id: int = Form(...),
    assignment_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    # Ensure upload folder exists
    os.makedirs("uploads", exist_ok=True)

    # Unique filename
    unique_filename = f"{uuid4()}_{file.filename}"
    file_location = f"uploads/{unique_filename}"

    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    submission = models.Submission(
        student_id=student_id,
        assignment_id=assignment_id,
        content=f"PDF Uploaded: {file.filename}",
        plagiarism_risk="Pending",
        score=0,
        feedback="Pending Evaluation"
    )

    db.add(submission)
    db.commit()
    db.refresh(submission)

    return {
        "message": "PDF uploaded successfully",
        "submission_id": submission.id
    }
