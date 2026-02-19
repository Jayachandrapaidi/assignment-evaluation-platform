from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas

router = APIRouter(
    prefix="/assignments",
    tags=["Assignments"]
)


# ==============================
# Create Assignment
# ==============================
@router.post(
    "/",
    response_model=schemas.AssignmentResponse,
    status_code=status.HTTP_201_CREATED
)
def create_assignment(
    data: schemas.AssignmentCreate,
    db: Session = Depends(get_db)
):
    assignment = models.Assignment(**data.dict())

    db.add(assignment)
    db.commit()
    db.refresh(assignment)

    return assignment


# ==============================
# Get All Assignments
# ==============================
@router.get(
    "/",
    response_model=list[schemas.AssignmentResponse]
)
def get_assignments(db: Session = Depends(get_db)):
    return db.query(models.Assignment).all()


# ==============================
# Get Single Assignment
# ==============================
@router.get(
    "/{assignment_id}",
    response_model=schemas.AssignmentResponse
)
def get_assignment(assignment_id: int, db: Session = Depends(get_db)):
    assignment = db.query(models.Assignment).filter(
        models.Assignment.id == assignment_id
    ).first()

    if not assignment:
        raise HTTPException(
            status_code=404,
            detail="Assignment not found"
        )

    return assignment


# ==============================
# Update Assignment
# ==============================
@router.put(
    "/{assignment_id}",
    response_model=schemas.AssignmentResponse
)
def update_assignment(
    assignment_id: int,
    data: schemas.AssignmentUpdate,
    db: Session = Depends(get_db)
):
    assignment = db.query(models.Assignment).filter(
        models.Assignment.id == assignment_id
    ).first()

    if not assignment:
        raise HTTPException(
            status_code=404,
            detail="Assignment not found"
        )

    for key, value in data.dict(exclude_unset=True).items():
        setattr(assignment, key, value)

    db.commit()
    db.refresh(assignment)

    return assignment


# ==============================
# Delete Assignment
# ==============================
@router.delete(
    "/{assignment_id}",
    status_code=status.HTTP_200_OK
)
def delete_assignment(
    assignment_id: int,
    db: Session = Depends(get_db)
):
    assignment = db.query(models.Assignment).filter(
        models.Assignment.id == assignment_id
    ).first()

    if not assignment:
        raise HTTPException(
            status_code=404,
            detail="Assignment not found"
        )

    db.delete(assignment)
    db.commit()

    return {"message": "Assignment deleted successfully"}
