
from pyjoystick.sdl2 import Key, Joystick, run_event_loop
joy = None
def print_add(joyy):
    global joy
    print('Added', joyy)
    joy = joyy


def print_remove(joy):
    print('Removed', type(joy))

def key_received(key):
    print('received', key)
    if key.value == Key.HAT_UP:
        print("het up")
    elif key.value == Key.HAT_DOWN:
        print("hast down")
    if key.value == Key.HAT_LEFT:
        print("left")
    elif key.value == Key.HAT_UPLEFT:
        print("upleft")
    elif key.value == Key.HAT_DOWNLEFT:
        print("donlweft")
    elif key.value == Key.HAT_RIGHT:
        print("het right")
    elif key.value == Key.HAT_UPRIGHT:
        print("up right")
    elif key.value == Key.HAT_DOWNRIGHT:
        print("odwen right")

run_event_loop(print_add, print_remove, key_received)