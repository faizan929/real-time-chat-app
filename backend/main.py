 

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import json
from routes import registerRoutes
from database import engine, Base
import models

Base.metadata.create_all(bind = engine)

app = FastAPI()


app.include_router(registerRoutes.router)


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

connected_users = {}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("connection accepted")
    while True:
        try:
            data = await websocket.receive_text()
            parsed = json.loads(data)
            username = parsed.get("user")
            connected_users[username] = websocket
            response = {
                "user": "server", 
                "message": f"Frontend said: {parsed.get('message', '')}" 
            }
            
            print("responding with", response) 
            user_list = list(connected_users.keys())
            for ws in connected_users.values():
                await ws.send_text(json.dumps({
                    "type" : "user_list",
                    "users" : user_list
                }) 
)
            
               
        except WebSocketDisconnect:
            print("Client Disconnected ")
            disconnected_user = None
            for name, ws in connected_users.items():
                if ws == websocket:
                    disconnected_user = name
                    break
           
            if disconnected_user:
                connected_users.pop(disconnected_user)

        except Exception as e:
            print(f"Websocket error: {e}")
            break
    

if __name__ == "__main__":
    import uvicorn 
    uvicorn.run(app, host = '127.0.0.1', port = 8000)

