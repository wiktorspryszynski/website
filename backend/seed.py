"""Seed the database from ../frontend/src/flashcards.json"""
import asyncio
import json
from pathlib import Path

from app.database import engine, AsyncSessionLocal, Base
from app.models import Flashcard


async def main():
    json_path = Path(__file__).parent.parent / "frontend" / "src" / "flashcards.json"
    data = json.loads(json_path.read_text(encoding="utf-8"))

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        for item in data:
            session.add(Flashcard(
                number=item.get("number"),
                question=item["question"],
                answer=item["answer"],
            ))
        await session.commit()

    print(f"Seeded {len(data)} flashcards.")


if __name__ == "__main__":
    asyncio.run(main())
