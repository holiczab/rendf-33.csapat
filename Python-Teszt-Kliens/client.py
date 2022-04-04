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

def menu(number):
    if number=="1":
        print("1")
        msg=asyncio.get_event_loop().run_until_complete(listen("sdvc;"))
        msg_check(msg)
        print("Query devices - completed!")
    elif number=="2":
        ID=input("ID: ")
        name=input("Name: ")
        category=input("Category: ")
        description=input("Description: ")
        location=input("Location: ")
        msg=asyncio.get_event_loop().run_until_complete(listen(f"advc;{ID};{name};{category};{description};{location}"))
        msg_check(msg)
        print("Add new device - completed!")
    elif number=="3":
        ID=input("ID: ")
        msg=asyncio.get_event_loop().run_until_complete(listen(f"ddvc;{ID}"))
        msg_check(msg)
        print("Delete device - completed!")
    elif number=="4":
        msg=asyncio.get_event_loop().run_until_complete(listen("scat;"))
        msg_check(msg)
        print("Query categories - completed!")
    elif number=="5":
        ID =input("ID: ")
        name =input("Name: ")
        parent =input("Parent: ")
        interval =input("Interval: ")
        spec =input("Specification: ")
        standard =input("StandardTime: ")
        req =input("RequiredQualification: ")
        msg=asyncio.get_event_loop().run_until_complete(listen(f"acat;{ID};{name};{parent};{interval};{spec};{standard};{req}"))
        msg_check(msg)
        print("Add new category - completed!")
    elif number=="6":
        ID=input("ID: ")
        msg=asyncio.get_event_loop().run_until_complete(listen(f"dcat;{ID}"))
        msg_check(msg)
        print("Delete category - completed!")

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
    while True:
        number=input("Menu item: ")
        if int(number) and int(number)>0 and int(number)<7:
            menu(number)
        else: break
    return
    
async def listen(msg):
    url = "ws://127.0.0.1:5050"
    async with websockets.connect(url) as ws:
        await ws.send(str(msg))
        while True:
            msg = await ws.recv()
            return msg
            #msg=input("Message: ")
            #await ws.send(str(msg))
def msg_check(msg):
    if ';' in msg:
        if msg=="Username-Password incorrect": return
        elif msg.split(';')[1] == "Operator": Operator(msg.split(';')[2])
        elif msg.split(';')[1] == "Repairer": Repairer(msg.split(';')[2])
        elif msg.split(';')[1] == "DeviceCorrespondent": DeviceCorrespondent(msg.split(';')[2])
        else: print(msg)

def main():
    print("Maintenance management system")
    print("Login\n----------------------\n")
    username=input("Username : ")
    password=input("Password : ")
    msg=asyncio.get_event_loop().run_until_complete(listen("pwd;{0};{1}".format(username,password)))
    msg_check(msg)

main()
