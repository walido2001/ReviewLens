from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import String, Text, ForeignKey
from flask_sqlalchemy import SQLAlchemy

class Base(DeclarativeBase):
    """Base class for all models"""
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

db = SQLAlchemy(model_class=Base)

class App(Base):
    __tablename__ = "application"

    id: Mapped[str] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    description: Mapped[str] = mapped_column(Text)
    
    reviews: Mapped[List["Review"]] = relationship(
        back_populates="app",
        cascade="all, delete-orphan",
        lazy="selectin"
    )
    topics: Mapped[List["Topic"]] = relationship(
        back_populates="app",
        cascade="all, delete-orphan",
        lazy="selectin"
    )

class Review(Base):
    __tablename__ = "review"

    id: Mapped[int] = mapped_column(primary_key=True)
    app_id: Mapped[str] = mapped_column(
        ForeignKey("application.id", ondelete="CASCADE")
    )
    name: Mapped[str] = mapped_column(String(50))
    rating: Mapped[int]
    content: Mapped[str] = mapped_column(Text)
    date: Mapped[datetime]
    topic_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("topic.id", ondelete="SET NULL"),
        nullable=True
    )
    sentiment_score: Mapped[Optional[float]] = mapped_column(nullable=True)

    app: Mapped["App"] = relationship(back_populates="reviews")
    topic: Mapped[Optional["Topic"]] = relationship(back_populates="reviews")

class Topic(Base):
    __tablename__ = "topic"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    app_id: Mapped[str] = mapped_column(
        ForeignKey("application.id", ondelete="CASCADE")
    )
    content: Mapped[str] = mapped_column(Text)

    app: Mapped["App"] = relationship(back_populates="topics")
    reviews: Mapped[List["Review"]] = relationship(back_populates="topic")