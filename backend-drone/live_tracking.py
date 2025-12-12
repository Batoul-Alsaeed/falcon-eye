from ultralytics import YOLO
import cv2
from tello_connection import connect_tello

# 1) الاتصال بالتلو وتفعيل بث الفيديو
tello = connect_tello()

# 2) قارئ الإطارات من التلو (بدل VideoCapture على udp)
frame_reader = tello.get_frame_read()

# 3) تحميل مودل YOLO الجاهز
model = YOLO("yolov8n.pt")


while True:
    # نأخذ آخر فريم من الكاميرا
    frame = frame_reader.frame
    if frame is None:
        continue  # لو ما فيه فريم جاهز نكمل

    # detect + track
    results = model.track(
        source=frame,
        persist=True,
        tracker="bytetrack.yaml",
        verbose=False
    )

    # رسم المربعات
    annotated = results[0].plot()

    # عرض الفريم
    cv2.imshow("Falcon-Eye Live Model - Tello", annotated)

    # خروج عند الضغط على q
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

# إغلاق البث والنافذة
tello.streamoff()
tello.end()
cv2.destroyAllWindows()
