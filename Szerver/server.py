import websockets
import asyncio
from database import DataBase

PORT = 5050


print("Server listening on Port " + str(PORT))

async def echo(websocket, path):
    print("[Connection] A client just connected")
    try:
        async for message in websocket:
            print(f"[  Message ] Message from client: {message}")
            await websocket.send("Pong: " + message)
            db=DataBase()
    except websockets.exceptions.ConnectionClosed as e:
        print("[Connection] A client just disconnected")

start_server = websockets.serve(echo, "localhost", PORT)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()