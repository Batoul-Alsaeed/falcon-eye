 
# Falcon Eye  
**Centralized In-Box Drone Surveillance & Response System**

> **Built by the Saudi Falcons behind the project:**  
> **Ajawharah · Batoul · Raghad · Hessah · Miaad**

Falcon Eye is a **mission-critical centralized drone intelligence platform** designed to operate **in-box drones mounted on vehicles**, fully controlled from a **central command center**.  
The system delivers **real-time video streaming, AI-powered detection & tracking, and remote drone control** through a modern, scalable web dashboard.

---

## Project Vision

Falcon Eye was designed to support **smart security operations** by enabling rapid, mobile aerial awareness without deploying human operators on-site.

It enables authorities and organizations to:
- Deploy drones directly from vehicles
- Monitor live aerial feeds in real time
- Detect and track humans, vehicles, and anomalies using AI
- Centralize decision-making in one command center
- Respond faster with higher situational awareness

---

## Core Capabilities

- Centralized command & control
- Vehicle-mounted **in-box drone deployment**
- Real-time UDP video streaming
- AI-based object detection & tracking
- Live monitoring dashboard
- Scalable, modular architecture

---

## System Architecture (High-Level)

```
┌───────────────────────────────┐
│        Central Command         │
│      React + Vite Dashboard    │
│  • Live Video Viewer           │
│  • Map & Telemetry             │
│  • Alerts & Events             │
│  • Drone Controls              │
└──────────────▲────────────────┘
│ REST / WebSocket
┌──────────────┴────────────────┐
│        FastAPI Backend          │
│  • Streaming APIs               │
│  • Drone Control Endpoints      │
│  • Detection & Events API       │
│  • System Orchestration         │
└──────────────▲────────────────┘
│
┌──────────────┴────────────────┐
│     AI Processing Layer         │
│  • YOLOv8 (Object Detection)   │
│  • ByteTrack (Object Tracking) │
│  • OpenCV (Frame Processing)   │
└──────────────▲────────────────┘
│ UDP Video (11111)
┌──────────────┴────────────────┐
│         Vehicle Unit            │
│  • In-Box Drone (DJI Tello)     │
│  • DJITelloPy Control           │
│  • Video Stream Sender          │
└────────────────────────────────┘
```

---

## Technology Stack

### Backend
- **Python 3.11**
- **FastAPI** – REST & real-time APIs
- **Uvicorn** – ASGI server
- **YOLOv8** – AI object detection
- **ByteTrack** – Multi-object tracking
- **OpenCV** – Frame processing
- **DJITelloPy** – Drone communication
- **UDP Video Streaming** – Port `11111`

### Frontend
- **React**
- **Vite**
- **Figma Make** – UI/UX design
- Real-time video & telemetry dashboard

### Development Environment
- **venv** – Python virtual environment
- **Homebrew** – System dependency management

---

## System Components

### 1.Drone Control Module
Handles all low-level drone operations:
- Takeoff / Land
- Movement (X, Y, Z)
- Rotation
- Emergency stop
- Battery & health monitoring

Powered by **DJITelloPy**.

---

### 2.Video Streaming Module
- Drone streams live video via **UDP**
- Backend ingests frames using OpenCV
- Frames are forwarded to:
  - AI detection pipeline
  - Live frontend viewer

---

### 3.AI Detection & Tracking
- **YOLOv8** detects:
  - Humans
  - Vehicles
  - Objects of interest
- **ByteTrack** assigns persistent IDs across frames
- Output includes:
  - Object class
  - Confidence score
  - Bounding box
  - Tracking ID

---

### 4.Backend API (FastAPI)

Example endpoints:
```http
GET  /video/stream
POST /drone/launch
POST /drone/return
POST /drone/move
GET  /drone/status
GET  /detections/live
```

Supports:

* Real-time data streaming
* Command execution
* Event logging

---

### 5.Frontend Dashboard

Key features:

* Live drone video feed
* AI bounding boxes & labels
* Drone & vehicle telemetry
* Control panel (launch, return, route)
* Alert & event notifications

Built with **React + Vite** for high performance.

---

## Data Flow

1. Drone launches from vehicle
2. Live video streamed via UDP
3. Backend processes frames
4. AI detects & tracks objects
5. Results sent to dashboard
6. Operator issues commands
7. Commands executed by drone

---

## Getting Started

### Backend Setup

```bash
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Project Structure

```
falcon-eye/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── drone/
│   │   ├── ai/
│   │   └── main.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── vite.config.ts
├── docs/
└── README.md
```

---

## Security Considerations

* Controlled access to drone commands
* Separation of control & view layers
* Secure communication in production
* Action & event audit logging

---

## Scalability & Future Enhancements

* Multi-drone orchestration
* Autonomous patrol routes
* Persistent storage (PostgreSQL)
* Vehicle GPS integration
* Edge AI processing
* Alert prioritization & severity levels
* Role-based access control (RBAC)

---

## Use Cases

* Smart city surveillance
* Emergency & disaster response
* Perimeter & border monitoring
* Traffic & incident analysis
* Event security operations

---

## Team

**Saudi Falcons behind the project**

* Ajawharah
* Batoul
* Raghad
* Hessah
* Miaad

Falcon Eye reflects a **senior-level engineering approach**, combining real-time systems, AI, and modern web technologies to deliver a scalable, production-ready platform.

---

## License

Private / Proprietary  
All rights reserved.

---

*If you want next:*
- **Sequence diagrams**
- **AI pipeline deep-dive**
- **Docker & deployment README**
- **Hackathon / pitch-ready technical summary**

*Just say the word, Saudi Falcon *
