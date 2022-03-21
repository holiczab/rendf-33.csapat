import socket
import threading

HEADER = 64 #bytes
FORMAT = "utf-8"
DISCONNECT_MESSAGE = "!Disconnect"
#--------- IP/PORT megadása ---------

PORT = 5050
SERVER = "127.0.0.1"
#SERVER = socket.gethostbyname(socket.gethostname())
ADDR = (SERVER, PORT)

#--------- Socket meghatározás, bindolás ---------
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind(ADDR)
#--------- Indítás és csatlakozás kezelése ---------
def handle_client(conn, addr):
    print(f"[New connection] {addr}")
    connected = True
    while connected:
        msg_length=conn.recv(HEADER).decode(FORMAT)
        print(msg_length)
        if msg_length:
            msg_length=int(msg_length)
            msg=conn.recv(msg_length).decode(FORMAT)
            if msg==DISCONNECT_MESSAGE:
                connected = False
            print(f"[Client: {addr}] {msg}")
    conn.close()

def start():
    server.listen()
    print(f"[Running] IP of the server is : {SERVER}")
    while True:
        conn, addr = server.accept()
        thread = threading.Thread(target=handle_client,args=(conn,addr))
        thread.start()
        print(f"[Active connections] {threading.activeCount()-1}")


print("[Starting] Server is starting...")
start()