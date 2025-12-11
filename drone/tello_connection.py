# tello_connection.py

from djitellopy import Tello

def connect_tello():
    tello = Tello()
    tello.connect()
    print("Connected to Tello. Battery:", tello.get_battery())
    return tello
