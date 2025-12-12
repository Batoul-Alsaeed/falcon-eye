# flight_basic.py

import time
from tello_connection import connect_tello

tello = connect_tello()

print("Taking off...")
tello.takeoff()

time.sleep(3)

print("Hovering...")
time.sleep(2)

print("Landing...")
tello.land()

print("Flight complete.")
