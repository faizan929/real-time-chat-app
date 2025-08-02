import asyncio 
import websockets

connected_users = set()

async def receive_messages(websocket):

    try:
        async for message in websocket:
                print(f"Client: {message}")
                await websocket.send(f"Server received: {message}")

    except websockets.ConnectionClosed:
        print("Client disconnected..")
    
async def send_messages(websocket):
    try:
        while True:
            msg = input("Server: ")
            await websocket.send(msg)
    except websockets.ConnectionClosed:
        print("Cant send, client disconnected")

async def handler(websocket):
    await asyncio.gather(
        receive_messages(websocket),
        send_messages(websocket)
    )

async def main():
    async with websockets.serve(handler, "localhost", 9003):
        print("Server stared on ws://localhost:9002")
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())
