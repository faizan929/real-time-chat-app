 

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI()

# FRONTEND WILL ACCESS THE BACKEND HERE

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost:5173", "http://127.0.0.1:5173"],  
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

@app.get("/")
def read_root():
    return {"message": "FastAPI is running"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("connection accepted")
    while True:
        try:
            data = await websocket.receive_text()
            parsed = json.loads(data)
            response = {
                "user": "server", 
                "message": f"you said: {parsed.get('message', '')}" 
            }
            
            
            await websocket.send_text(json.dumps(response))
               
        except WebSocketDisconnect:
            print("Client Disconnected ")
        except Exception as e:
            print(f"Websocket error: {e}")
            break
    