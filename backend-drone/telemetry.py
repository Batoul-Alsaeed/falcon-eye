# telemetry.py

from tello_connection import connect_tello

def read_telemetry():
    tello = connect_tello()

    data = {
        "battery": tello.get_battery(),
        "height_cm": tello.get_height(),
        "flight_time_sec": tello.get_flight_time(),
        "temperature": tello.get_temperature(),
    }

    return data


if __name__ == "__main__":
    telemetry = read_telemetry()
    print("Telemetry Data:")
    for k, v in telemetry.items():
        print(f"{k}: {v}")
