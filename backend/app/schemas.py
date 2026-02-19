from pydantic import BaseModel
from typing import Optional


# ===============================
# Assignment Schemas
# ===============================

class AssignmentBase(BaseModel):
    title: str
    description: Optional[str] = None


class AssignmentCreate(AssignmentBase):
    created_by: int


class AssignmentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None


class AssignmentResponse(AssignmentBase):
    id: int
    created_by: int

    class Config:
        orm_mode = True


# ===============================
# Submission Schemas
# ===============================

class SubmissionBase(BaseModel):
    student_id: int
    assignment_id: int
    content: Optional[str] = None


class SubmissionCreate(SubmissionBase):
    pass


class SubmissionUpdate(BaseModel):
    content: Optional[str] = None
    plagiarism_risk: Optional[str] = None
    score: Optional[int] = None
    feedback: Optional[str] = None


class SubmissionResponse(SubmissionBase):
    id: int
    plagiarism_risk: Optional[str]
    score: Optional[int]
    feedback: Optional[str]

    class Config:
        orm_mode = True
