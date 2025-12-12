# api.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse  # 👈 استيراد ستريم الريسبونس

from drone_service import get_telemetry, launch, return_to_base
from video_stream import generate_tello_yolo_stream  # 👈 استيراد مولّد الفيديو

app = FastAPI()

# السماح للداشبورد (Vite غالبًا على 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # لو بتجربين من أصل ثاني، قد نوسعها لاحقًا
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/stream/live")
def stream_live():
    return StreamingResponse(
        generate_tello_yolo_stream(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

@app.get("/telemetry")
def telemetry():
    """ترجع حالة الدرون (حقيقية أو Simulation حسب الإعداد)"""
    return get_telemetry()


@app.post("/launch")
def launch_drone():
    """تشغيل الدرون (أو بدء المسار في Simulation)"""
    launch()
    return {"status": "ok"}


@app.post("/return")
def return_drone():
    """إرجاع الدرون / هبوط"""
    return_to_base()
    return {"status": "ok"}
