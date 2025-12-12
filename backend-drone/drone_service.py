# drone_service.py
import time
from typing import Dict
from config import USE_SIMULATION

# --------- وضع Simulation (افتراضي الآن) ---------
_sim_state = {
    "mode": "Idle",
    "battery": 78,
    "altitude_m": 0.0,
    "speed_kmh": 0.0,
    "link": "Secure",
    "patrol_distance_m": 210,
    "last_update": time.time(),
}


def _update_simulation_state() -> None:
    """نحدّث القيم شوي شوي عشان تحسيها Live"""
    now = time.time()
    dt = now - _sim_state["last_update"]
    _sim_state["last_update"] = now

    if _sim_state["mode"] == "En Route":
        _sim_state["altitude_m"] = min(_sim_state["altitude_m"] + 0.5 * dt, 45)
        _sim_state["speed_kmh"] = 38.0
    elif _sim_state["mode"] == "Returning":
        _sim_state["altitude_m"] = max(_sim_state["altitude_m"] - 0.5 * dt, 0)
        _sim_state["speed_kmh"] = 25.0
        if _sim_state["altitude_m"] <= 0.1:
            _sim_state["mode"] = "Idle"
            _sim_state["speed_kmh"] = 0.0
    else:
        _sim_state["speed_kmh"] = 0.0


def _get_sim_telemetry() -> Dict:
    _update_simulation_state()
    return _sim_state.copy()


def _sim_launch() -> None:
    _sim_state["mode"] = "En Route"


def _sim_return() -> None:
    _sim_state["mode"] = "Returning"


# --------- وضع Tello الحقيقي (نفعّله لاحقاً) ---------
try:
    from tello_connection import connect_tello
    _tello = None
except ImportError:
    _tello = None


def _ensure_tello():
    """نتأكد إن فيه اتصال واحد فقط بالدرون"""
    global _tello
    if _tello is None:
        _tello = connect_tello()
    return _tello


def _get_tello_telemetry() -> Dict:
    """قراءة بيانات حقيقية من Tello (لما USE_SIMULATION=False)"""
    tello = _ensure_tello()
    battery = tello.get_battery()
    height_cm = tello.get_height()

    return {
        "mode": "En Route",
        "battery": battery,
        "altitude_m": height_cm / 100.0,
        "speed_kmh": 0.0,  # نحدّثها لاحقاً لو احتجنا سرعة حقيقية
        "link": "Secure",
        "patrol_distance_m": 210,
        "last_update": time.time(),
    }


def _tello_launch() -> None:
    tello = _ensure_tello()
    tello.takeoff()


def _tello_return() -> None:
    tello = _ensure_tello()
    tello.land()


# --------- الواجهة الموحدة اللي يستخدمها api.py ---------
def get_telemetry() -> Dict:
    if USE_SIMULATION:
        return _get_sim_telemetry()
    return _get_tello_telemetry()


def launch() -> None:
    if USE_SIMULATION:
        _sim_launch()
    else:
        _tello_launch()


def return_to_base() -> None:
    if USE_SIMULATION:
        _sim_return()
    else:
        _tello_return()
