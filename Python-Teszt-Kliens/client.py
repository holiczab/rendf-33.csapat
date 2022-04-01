import websockets
import asyncio
import warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)

def Operator(name):
    print(f"Welcome {name} - Operator! Select your desired service!\n")
    print("----------------------\n")
    print("")
    number=input("Menu item: ")
    while (type(number)!= int ) or (number>2):
        number=input("Menu item: ")
        if number==0:
            return
    
def Repairer(name):
    print(f"Welcome {name} - Repairer! Select your desired service!\n")
    print("----------------------\n")
    print("")
    number=input("Menu item: ")
    while (type(number)!= int ) or (number>2):
        number=input("Menu item: ")
        if number==0:
            return

def DeviceCorrespondent(name):
    print(f"Welcome {name} - DeviceCorrespondent! Select your desired service!")
    print("----------------------")
    print("1 - Query devices")
    print("2 - Add new device")
    print("3 - Delete device")
    print("----------------------")
    print("4 - Query categories")
    print("5 - Add new category")
    print("6 - Delete category")
    print("----------------------")
    number=input("Menu item: ")
    if number==1:
        asyncio.get_event_loop().run_until_complete(listen("queryd","sdvc;"))

    
    
async def listen(mode,msg):
    url = "ws://127.0.0.1:5050"
    async with websockets.connect(url) as ws:
        await ws.send(str(msg))
        while True:
            msg = await ws.recv()
            if mode=="login":
                if msg=="Username-Password incorrect":
                    return
                elif msg.split(';')[1] == "Operator": Operator(msg.split(';')[2])
                elif msg.split(';')[1] == "Repairer": Repairer(msg.split(';')[2])
                elif msg.split(';')[1] == "DeviceCorrespondent": DeviceCorrespondent(msg.split(';')[2])
            elif mode=="queryd":
                print(msg)
            #msg=input("Message: ")
            #await ws.send(str(msg))
    
def main():
    print("Maintenance management system")
    print("Login\n----------------------\n")
    username=input("Username : ")
    password=input("Password : ")
    asyncio.get_event_loop().run_until_complete(listen("login","pwd;{0};{1}".format(username,password)))

main()
