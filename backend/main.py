 

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# FRONTEND WILL ACCESS THE BACKEND HERE

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost:5173"],  
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

@app.get("/")
def read_root():
    return {"message": "FastAPI is running"}