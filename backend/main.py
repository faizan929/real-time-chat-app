 

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import json
from routes import registerRoutes
from database import engine, Base
import models
from routes import userRoutes
from routes import messageRoutes

Base.metadata.create_all(bind = engine)

app = FastAPI()

origins = ["https://real-time-chat-app-git-main-faizan929s-projects.vercel.app",
           "http://localhost:5173",
           "http://127.0.0.1:5173" ]



app.include_router(registerRoutes.router, prefix = "/api")
app.include_router(userRoutes.router, prefix = "/api")
app.include_router(messageRoutes.router, prefix = "/api")




app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"], 
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

@app.get("/")
def root():
    return {"message": "Backend is running"}


@app.get("/api/health")
def read_root():
    return {"message": "FastAPI is running"}

connected_users = {}


group_members = {
    "newgrouptest": ["Faizan Sheikh", "Aman Sheikh", "testlogin"],
    "family": ["Faizan Sheikh", "Brother", "Mom"],
}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("connection accepted")
    sender_username = None 
    
    try:
        while True:
            data = await websocket.receive_text()
            parsed = json.loads(data)
            sender_username = parsed.get("user")
            msg_type = parsed.get("type","message")

            if msg_type == "connect":
                connected_users[sender_username] = websocket
                await update_user_list()
                continue


            if msg_type == "typing":
                recipient_username = parsed.get("to")
                if recipient_username in connected_users:
                    await connected_users[recipient_username].send_text(json.dumps({
                        "type" : "typing",
                        "from" : sender_username
                    }))
                    continue
            if msg_type == "stop_typing":
                 recipient_username = parsed.get("to")
                 if recipient_username in connected_users:
                    await connected_users[recipient_username].send_text(json.dumps({
                        "type" : "stop_typing",
                        "from" : sender_username
                    }))
                    continue
          
                
            
            recipient_username = parsed.get("to")
            msg_txt = parsed.get("message")
  
            
            if msg_type == "group_message":
                group_id = parsed.get("to")
                msg_txt = parsed.get("message")

                if not group_id or not msg_txt:
                    continue
                    
               
                message_payload = {
                    "type": "group_message",
                    "group": group_id,
                    "from": sender_username, 
                    "message": msg_txt
                
                }

                members = group_members.get(group_id, [])
                for member in members:
                    if member in connected_users and member != sender_username:
                        try:
                            await connected_users[member].send_text(json.dumps(message_payload))
                        except:
                            connected_users.pop(member, None)

                continue


            if not sender_username or not msg_txt:
                continue

            connected_users[sender_username] = websocket

            message_payload = {
                "user": sender_username, 
                "to": recipient_username,
                "message": msg_txt
            }

            if recipient_username and recipient_username in connected_users:
                print("Responding", message_payload)
                recipient_ws = connected_users[recipient_username]
                try:
                    await recipient_ws.send_text(json.dumps(message_payload))
                except:
                    connected_users.pop(recipient_username, None)


            await websocket.send_text(json.dumps({
                "type": "ack",
                "status": "message_received"
            }))
            
    except WebSocketDisconnect:
        print("Client Disconnected ")
        
               
    except Exception as e:
            print(f"Websocket error, {e}")
    finally:
        if sender_username and sender_username in connected_users:
            connected_users.pop(sender_username, None)
            await update_user_list()
                
async def update_user_list():
    user_list = list(connected_users.keys())
    disconnected_users = []
    for username, ws in connected_users.items():
        try:
            await ws.send_text(json.dumps({
                "type": "user_list",
                "users": user_list
            }))
        except:
            disconnected_users.append(username)
    
    for username in disconnected_users:
        connected_users.pop(username, None)

            
               
if __name__ == "__main__":
    import uvicorn 
    import os 
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host = '127.0.0.1', port = port, reload = False)

