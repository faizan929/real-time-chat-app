import asyncio 
import websockets

connected_users = set()


def print_with_prompt(msg):
    print(f"\r{msg}\n Server: ", end="", flush = True)

async def receive_messages(websocket):
    try:
        async for message in websocket:
                print_with_prompt(f" Client says: {message}")
                await websocket.send(f"Server received: {message}")

    except websockets.ConnectionClosed:
        print("Client disconnected..")
        connected_users.remove(websocket)
    
async def send_messages(websocket):
    try:
        while True:
            msg = await asyncio.to_thread(input, " Server: ")
            for user in connected_users:
                await user.send(f"[Broadcast] {msg}")
            #await websocket.send(msg)
    except websockets.ConnectionClosed:
        print("Cant send, client disconnected")
        connected_users.remove(websocket)

async def handler(websocket):
    connected_users.add(websocket)
    print("New client connected")
    try:    
        await asyncio.gather(
            receive_messages(websocket),
            send_messages(websocket)
    )
    except:
        pass
    finally:
        if websocket in connected_users:
            connected_users.remove(websocket)

async def main():
    async with websockets.serve(handler, "localhost", 9002):
        print("Server stared on ws://localhost:9002")
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())
