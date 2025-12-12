# video_stream.py
import cv2
from ultralytics import YOLO
from tello_connection import connect_tello

# نستخدم مولّد (generator) يرجّع فريمات JPG متتالية
def generate_tello_yolo_stream():
    # الاتصال بالتلو + تشغيل البث
    tello = connect_tello()
    frame_reader = tello.get_frame_read()

    model = YOLO("yolov8n.pt")

    try:
        while True:
            frame = frame_reader.frame
            if frame is None:
                continue

            # تشغيل YOLO + تتبّع
            results = model.track(
                source=frame,
                persist=True,
                tracker="bytetrack.yaml",
                verbose=False
            )

            annotated = results[0].plot()

            # تحويل الفريم إلى JPG bytes
            ret, buffer = cv2.imencode(".jpg", annotated)
            if not ret:
                continue

            frame_bytes = buffer.tobytes()

            # صيغة MJPEG (multipart/x-mixed-replace)
            yield (
                b"--frame\r\n"
                b"Content-Type: image/jpeg\r\n\r\n" + frame_bytes + b"\r\n"
            )
    finally:
        # إيقاف البث عن إنهاء الستريم
        tello.streamoff()
        tello.end()
