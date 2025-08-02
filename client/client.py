import asyncio
import websockets

async def listen_and_send(uri):
    async with websockets.connect(uri) as websocket:
        print("Connected to Server")  
        async def send():
            try:
                while True:
                    msg = input("You:")
                    if msg.lower() == "exit":
                        await websocket.close()
                        break
                    await websocket.send(msg)
            except Exception as e:
                print(f"Send error: {e}")
            
        async def receive():
            try:
                while True:
                    response = await websocket.recv()
                    print(f"\nServer: {response}")
            except websockets.ConnectionClosed:
                print("Disconnected from server")
               
        await asyncio.gather(send(), receive())

if __name__ == "__main__":
    asyncio.run(listen_and_send("ws://localhost:9003"))