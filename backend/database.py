from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from typing import List
from typing import Optional
from sqlalchemy import ForeignKey
from sqlalchemy import String, Integer, Date
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship


class Base(DeclarativeBase):
  pass

class App(Base):
  __tablename__ = "application"

  id: Mapped[int] = mapped_column(primary_key=True)
  name: Mapped[str] = mapped_column(String(50), nullable=False)
  description: Mapped[str] = mapped_column(String(500), nullable=True)

class Review(Base):
  __tablename__ = "review"

  id: Mapped[int] = mapped_column(primary_key=True)
  app_id: Mapped[int] = mapped_column(ForeignKey("application.id"))
  name: Mapped[str] = mapped_column(String(20), nullable=False)
  rating: Mapped[int] = mapped_column(Integer, nullable=False)
  content: Mapped[str] = mapped_column(String(500), nullable=False)
  date: Mapped[Date] = mapped_column(Date, nullable=False)
  topic_id: Mapped[int] = mapped_column(ForeignKey("topic.id"), nullable=True)
  sentiment_score: Mapped[int] = mapped_column(Integer, nullable=True)

class Topic(Base):
  __tablename__ = "topic"
  
  id: Mapped[int] = mapped_column(primary_key=True)
  app_id: Mapped[int] = mapped_column(ForeignKey("application.id"))
  content: Mapped[str] = mapped_column(String(150), nullable=False)


db = SQLAlchemy(model_class=Base)