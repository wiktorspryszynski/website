from pydantic import BaseModel


class FlashcardOut(BaseModel):
    id: int
    number: int | None
    question: str
    answer: str

    model_config = {"from_attributes": True}
