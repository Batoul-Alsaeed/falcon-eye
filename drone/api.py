# api.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from drone_service import get_telemetry, launch, return_to_base

app = FastAPI()

# خليه يسمح للداشبورد يتصل (Vite عادة 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
