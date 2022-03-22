import websockets
import asyncio

async def listen():
    url = input("Enter url: ") #"ws://127.0.0.1:5050"
    async with websockets.connect(url) as ws:
        msg=input("Message: ")
        await ws.send(str(msg))
        while True:
            msg = await ws.recv()
            print("Message has been sent to the server!")
            msg=input("Message: ")
            await ws.send(str(msg))
            
asyncio.get_event_loop().run_until_complete(listen())