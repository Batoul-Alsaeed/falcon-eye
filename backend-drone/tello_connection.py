# tello_connection.py

from djitellopy import Tello

def connect_tello():
    # إنشاء كائن تلو
    tello = Tello()

    # الاتصال بالدرون
    tello.connect()
    print("Connected to Tello. Battery:", tello.get_battery())

    # تشغيل بث الفيديو
    tello.streamon()
    print("Video stream ON ⚡")

    return tello
