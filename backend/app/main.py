from fastapi import FastAPI
from app.api import api_router
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for dev (later restrict)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/data", StaticFiles(directory="data"), name="data")
app.include_router(api_router)



