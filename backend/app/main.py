from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import flashcards

app = FastAPI(title="Portfolio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://spryszynski.pl",
    ],
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(flashcards.router)
    