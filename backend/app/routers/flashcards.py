from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..models import Flashcard
from ..schemas import FlashcardOut

router = APIRouter(prefix="/api/flashcards", tags=["flashcards"])


@router.get("/", response_model=list[FlashcardOut])
async def get_flashcards(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Flashcard).order_by(Flashcard.number, Flashcard.id))
    return result.scalars().all()


@router.get("/{flashcard_id}", response_model=FlashcardOut)
async def get_flashcard(flashcard_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Flashcard).where(Flashcard.id == flashcard_id))
    card = result.scalar_one_or_none()
    if card is None:
        raise HTTPException(status_code=404, detail="Flashcard not found")
    return card
