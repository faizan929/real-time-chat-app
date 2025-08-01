import asyncio 
import websockets


connected_users = set()

async def handler(websocket):
    connected_users.add(websocket)
    try:
        async for message in websocket:
            for user in connected_users:
                print(f"received: {message}")
                if user != websocket:
                    await user.send(message)
    except websockets.exceptions.ConnectionClosed:
        print("Client disconnected..")
    finally:
        connected_users.remove(websocket)

async def main():
    async with websockets.serve(handler, "localhost", 9002):
        print("Server started on ws://localhost:9002")
    
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())
    