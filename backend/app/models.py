from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base


# ===============================
# User Model
# ===============================
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    role = Column(String, nullable=False)  # student / instructor

    # Relationships
    assignments = relationship(
        "Assignment",
        back_populates="creator",
        cascade="all, delete"
    )

    submissions = relationship(
        "Submission",
        back_populates="student",
        cascade="all, delete"
    )


# ===============================
# Assignment Model
# ===============================
class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)

    marks = Column(Integer, nullable=True)
    difficulty = Column(String, nullable=True)
    deadline = Column(String, nullable=True)

    created_by = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    # Relationships
    creator = relationship("User", back_populates="assignments")

    submissions = relationship(
        "Submission",
        back_populates="assignment",
        cascade="all, delete",
        passive_deletes=True
    )


# ===============================
# Submission Model
# ===============================
class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    assignment_id = Column(
        Integer,
        ForeignKey("assignments.id", ondelete="CASCADE"),
        nullable=False
    )

    content = Column(Text, nullable=True)

    plagiarism_risk = Column(String, nullable=True)
    score = Column(Integer, nullable=True)
    feedback = Column(Text, nullable=True)

    # Relationships
    student = relationship("User", back_populates="submissions")
    assignment = relationship("Assignment", back_populates="submissions")
