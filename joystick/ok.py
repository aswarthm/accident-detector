import asyncio
import websocket
import keyboard
import mouse
import time
from pyjoystick.sdl2 import Key, Joystick, run_event_loop
import math

msg = ""

def print_add(joy):
    print('Added', joy)


def print_remove(joy):
    print('Removed', type(joy))

def key_received(key):
    global msg
    print("hi")
    name = key.keyname
    value = round(key.value, 2)
    msgg = name + " " + str(value)
    print(msgg)
    if(msgg == "Axis 2 1.0"):
        # print("F")
        msg = "F"
        hello()
    elif(msgg == "Axis 2 0.0"):
        # print("S")
        msg = "S"
        hello()
    elif(msgg == "Axis 5 1.0"):
        # print("B")
        msg = "B"
        hello()
    elif(msgg == "Axis 5 0.0"):
        # print("S")
        msg = "S"
        hello()
    elif(key.keyname == "Axis 0" and value > 0.5):
        # print("R")
        msg = "R"
        hello()
    elif(key.keyname == "Axis 0" and value < 0.2):
        # print("S")
        msg = "S"
        hello()
    elif(key.keyname == "-Axis 0" and value < -0.5):
        # print("L")
        msg = "L"
        hello()
    elif(key.keyname == "-Axis 0" and value > -0.2):
        # print("S")
        msg = "S"
        hello()
    print(msg)


def hello():
    global msg
    print("in ws fyunc")
    print("socket", msg)
    ws.send(msg)

# while True:
    # hello()
ws = websocket.create_connection("ws://192.168.137.228:80")
print(ws)
run_event_loop(print_add, print_remove, key_received)
    # try:
    #     asyncio.run(start())
    # except:
    #     time.sleep(1)
    #     print("reconnecting")
    #     pass    
