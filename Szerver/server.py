from multiprocessing.dummy import active_children
import time
import websockets
import asyncio
from database import DataBase
import warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)
from concurrent.futures import ProcessPoolExecutor

PORT = 5050
IP = "localhost"

class Server:
    def __init__(self):
        print("Server listening on localhost -> ws://127.0.0.1:" + str(PORT))
        self.client_number=0

    def active_clients(self):
        print(f"[Client num] Active clients: {self.client_number}")
    
    async def echo(self,websocket, path):
        await asyncio.sleep(1)
        print("[Connection] A client just connected")
        self.client_number+=1
        self.active_clients()
        try:
            async for message in websocket:
                print(f"[  Message ] Message from client: {message}")
                db=DataBase(message)
                result=db.return_message()
                await websocket.send(str(result))
        except websockets.exceptions.ConnectionClosed as e:
            print("[Connection] A client just disconnected")
            self.client_number-=1
            self.active_clients()
    
    async def check(self):
        while True:
            db=DataBase("check")
            await asyncio.sleep(3600)
   
def main():
    server=Server()
    start_server = websockets.serve(server.echo, IP, PORT)
    loop = asyncio.get_event_loop()
    loop.run_until_complete(asyncio.gather(server.check(),start_server))
    loop.close()
main()