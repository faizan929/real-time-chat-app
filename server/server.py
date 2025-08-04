import asyncio 
import websockets
import os
connected_users = {}
chat_history = [] # this will store list of tuples (username, message)

def print_with_prompt(msg):
    print(f"\r{msg}\n Server: ", end="", flush = True)


#RECEIVE MESSAGES
async def receive_messages(websocket):
    try:
        async for message in websocket:
                sender = connected_users.get(websocket, "Unknown")

                if message.lower().startswith("/to"):
                    parts = message.split(' ', 2)
                    if len(parts) < 2:
                        await websocket.send("Invalid format, use /to <username> <message>")
                        continue
                    _, target_username, msg_content = parts

                    # FIND THE TARGET WEBSOCKET
                    target_ws = None
                    for ws, uname in connected_users.items():
                        if uname == target_username:
                            target_ws = ws
                            break 

                    if target_ws:
                        await target_ws.send(f"[Private] {sender}: {msg_content}")
                        await websocket.send(f"sent to {target_username}")
                        chat_history.append((f"{sender} => {target_username}", msg_content))
                    else:
                        await websocket.send(f"User '{target_username}' not found or not online.")
                elif message.strip() == "/users":
                    user_list = ','.join(connected_users.values())
                    await websocket.send(f"Online users: {user_list}")
        
                else:
                    if message.strip() == "/users":
                        user = ','.join(connected_users.values())
                        await websocket.send(f" Online users: {user_list}")
                    else:
                        await websocket.send("Use /to <username> <message> for private chats. ")

    except websockets.ConnectionClosed:
        print(f"{sender} disconnected...")
        connected_users.pop(websocket, None)


# SEND MESSAGES 
async def send_messages(websocket):
    try:
        while True:
            msg = await asyncio.to_thread(input, " Server: ")
            for user_ws, username in connected_users.items():
                await user_ws.send(f"[Broadcast from server] {msg}")
            #await websocket.send(msg)
    except websockets.ConnectionClosed:
        print("Cant send, client disconnected")
        connected_users.pop(websocket, None)


#HANDLER FUNCTION
async def handler(websocket):
    raw = await websocket.recv()
    if raw.startswith("[USERNAME]"):
        username = raw[len("[USERNAME]"):]
        if username in connected_users.values():
            await websocket.send(f"Username '{username}' is already taken. Try another.")
            await websocket.close()
            return
        connected_users[websocket] = username
        print(f"{username} joined the chat.")
    else:
        await websocket.close()
        return 
    
    try:    
        await asyncio.gather(
            receive_messages(websocket),
            send_messages(websocket)
    )
    except:
        pass
    finally:
        if websocket in connected_users:
            print(f"{connected_users[websocket]} disconnected")
            del connected_users[websocket]

# CHAT HISTORY
    def save_chat_history_to_file(filename= "chat_log.txt"):
        os.makedirs("logs", exist_ok=True)
        path = os.path.join("logs", filename)
        with open(filename, "w") as f:
            for user, msg in chat_history:
                f.write(f"{user}:{msg}\n")



async def main():
    async with websockets.serve(handler, "localhost", 9002):
        print("Server stared on ws://localhost:9002")
        await asyncio.Future()



if __name__ == "__main__":
    asyncio.run(main())

