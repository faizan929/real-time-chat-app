
import os
import uvicorn
from fastapi import FastAPI

app = FastAPI()


@app.get("/get")
async def root():
    return {"message": "Hello from FastAPI on Railway!"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="127.0.0.1", port=port, reload = True)
