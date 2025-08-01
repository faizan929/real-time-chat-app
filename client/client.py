import asyncio
import websockets

async def listen_and_send(uri):
    async with websockets.connect(uri) as websocket:
        print("Connected to Server")  
        async def send():
            while True:
                msg = input("You:")
                if msg.lower() == "exit":
                    break
                await websocket.send(msg)
        async def receive():
            while True:
                try:
                    response = await websockets.recv()
                    print(f"\nFriend: {response}")
                except websockets.ConnectionClosed:
                    print("Disconnected from server")
                    break

        await asyncio.gather(send(), receive())

if __name__ == "__main__":
    asyncio.run((listen_and_send)("ws://localhost:9002"))