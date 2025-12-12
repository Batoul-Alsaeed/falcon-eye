import React, { useState, useEffect, useRef } from "react";
import "./index.css";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
const API_BASE = "http://127.0.0.1:8000";


// Drone marker icon
const droneIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854894.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -35],
});

// Patrol car icon
const patrolIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2969/2969487.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -35],
});

// ===== MAP PANEL =====
function MapPanel({ launchDrone, returnDrone }) {
  const patrolPosition = [24.7136, 46.6753]; // موقع الدورية (ثابت)
  const [dronePos, setDronePos] = useState([24.7139, 46.676]); // موقع الدرون
  const [flightPath, setFlightPath] = useState([]); // مسار الدرون
  const targetPosition = [24.7145, 46.68]; // هدف افتراضي

  useEffect(() => {
    let interval;

    if (launchDrone) {
      // نبدأ مسار جديد من الدورية
      setDronePos([24.7139, 46.676]);
      setFlightPath([patrolPosition]);

      interval = setInterval(() => {
        setDronePos((prev) => {
          const [lat, lng] = prev;
          const newLat = lat + (targetPosition[0] - lat) * 0.02;
          const newLng = lng + (targetPosition[1] - lng) * 0.02;
          const newPos = [newLat, newLng];

          // نضيف النقطة الجديدة لمسار الطيران
          setFlightPath((old) => [...old, newPos]);

          // لو قربنا من الهدف نوقف
          if (Math.abs(newLat - targetPosition[0]) < 0.00005) {
            clearInterval(interval);
          }
          return newPos;
        });
      }, 200);
    } else if (returnDrone) {
      // رجوع للباترول بدون تحديث المسار
      interval = setInterval(() => {
        setDronePos((prev) => {
          const [lat, lng] = prev;
          const newLat = lat + (patrolPosition[0] - lat) * 0.03;
          const newLng = lng + (patrolPosition[1] - lng) * 0.03;
          const newPos = [newLat, newLng];

          if (Math.abs(newLat - patrolPosition[0]) < 0.00005) {
            clearInterval(interval);
          }
          return newPos;
        });
      }, 200);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [launchDrone, returnDrone]);

  return (
    <section className="panel map-panel">
      <h2 className="panel-title">Operational Map</h2>
      <div className="panel-body">
        <MapContainer
          center={patrolPosition}
          zoom={15}
          style={{ height: "100%", width: "100%", borderRadius: "12px" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {/* Patrol marker */}
          <Marker position={patrolPosition} icon={patrolIcon}>
            <Popup>Patrol Unit P-21</Popup>
          </Marker>

          {/* Drone marker (يتحرك) */}
          <Marker position={dronePos} icon={droneIcon}>
            <Popup>Drone Alpha</Popup>
          </Marker>

          {/* Target marker */}
          <Marker position={targetPosition}>
            <Popup>Target</Popup>
          </Marker>

          {/* Flight path */}
          {flightPath.length > 1 && (
            <Polyline positions={flightPath} color="lime" weight={4} />
          )}
        </MapContainer>
      </div>
    </section>
  );
}

// ===== VIDEO PANEL =====
function VideoPanel() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");

    const draw = () => {
      if (video.readyState >= 2) {
        // نضبط حجم الكانفاس على حجم الفيديو
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // نرسم فريم الفيديو
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // نحسب زمن الفيديو (نستخدمه لتحريك المربع)
        const t = video.currentTime;

        // مسار بسيط لمربع التتبع (من اليسار لليمين ثم يرجع)
        const boxWidth = canvas.width * 0.2;
        const boxHeight = canvas.height * 0.25;
        const centerY = canvas.height * 0.6;
        const speed = 0.3; // كل ما كبر الرقم زادت السرعة

        const phase = (t * speed) % 2; // من 0 إلى 2
        let centerX;
        if (phase < 1) {
          centerX = (canvas.width * 0.2) + phase * (canvas.width * 0.6);
        } else {
          const back = phase - 1;
          centerX = canvas.width * 0.8 - back * (canvas.width * 0.6);
        }

        const x = centerX - boxWidth / 2;
        const y = centerY - boxHeight / 2;

        // نرسم مربع التتبع
        ctx.strokeStyle = "#22c55e";
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, boxWidth, boxHeight);

        // نكتب لابل بسيط
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(x, y - 22, 80, 18);
        ctx.fillStyle = "#e5e7eb";
        ctx.font = "12px system-ui";
        ctx.fillText("Tracked target", x + 6, y - 9);
      }

      requestAnimationFrame(draw);
    };

    const handlePlay = () => {
      requestAnimationFrame(draw);
    };

    video.addEventListener("play", handlePlay);
    return () => video.removeEventListener("play", handlePlay);
  }, []);

  return (
    <section className="panel video-panel">
      <h2 className="panel-title">Drone Live Feed</h2>
      <div className="panel-body video-body">
        <div className="video-wrapper">
          <video
            ref={videoRef}
            className="drone-video"
            controls
            loop
          >
            {/* غيّري المسار هنا لاحقاً إلى فيديو حقيقي عندكم */}
            <source src="/sample-drone.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <canvas ref={canvasRef} className="drone-overlay" />
        </div>
        <p className="placeholder" style={{ marginTop: "6px" }}>
          Simulated AI tracking overlay on top of the drone video feed.
        </p>
      </div>
    </section>
  );
}

// ===== DRONE STATUS PANEL =====
function DroneStatusPanel({
  telemetry,
  loading,
  error,
  actionLoading,
  onLaunch,
  onReturn,
}) {
  const mode = telemetry?.mode ?? "Idle";
  const battery = telemetry?.battery ?? "--";
  const altitude = telemetry?.altitude_m ?? "--";
  const speed = telemetry?.speed_kmh ?? "--";
  const link = telemetry?.link ?? "–";
  const patrolDistance = telemetry?.patrol_distance_m ?? "--";

  return (
    <section className="panel status-panel">
      <h2 className="panel-title">Drone Status</h2>

      {loading && <p className="placeholder">Connecting to drone service…</p>}
      {error && !loading && (
        <p className="placeholder" style={{ color: "#f97373" }}>
          {error}
        </p>
      )}

      {!loading && (
        <>
          <div className="panel-body status-grid">
            <div className="status-item">
              <span className="label">Mode</span>
              <span
                className={
                  "value " +
                  (mode === "En Route" || mode === "Tracking"
                    ? "value-green"
                    : "")
                }
              >
                {mode}
              </span>
            </div>
            <div className="status-item">
              <span className="label">Battery</span>
              <span className="value">{battery}%</span>
            </div>
            <div className="status-item">
              <span className="label">Altitude</span>
              <span className="value">{altitude} m</span>
            </div>
            <div className="status-item">
              <span className="label">Speed</span>
              <span className="value">
                {typeof speed === "number" ? speed.toFixed(1) : speed} km/h
              </span>
            </div>
            <div className="status-item">
              <span className="label">Link</span>
              <span className="value value-green">{link}</span>
            </div>
            <div className="status-item">
              <span className="label">Patrol Distance</span>
              <span className="value">{patrolDistance} m</span>
            </div>
          </div>
          <div className="actions-row">
            <button
              className="btn btn-primary"
              onClick={onLaunch}
              disabled={actionLoading}
            >
              {actionLoading ? "Working..." : "Launch Drone"}
            </button>
            <button
              className="btn btn-secondary"
              onClick={onReturn}
              disabled={actionLoading}
            >
              Return to Patrol
            </button>
          </div>
        </>
      )}
    </section>
  );
}

// ===== ALERTS PANEL =====
function AlertsPanel() {
  return (
    <section className="panel alerts-panel">
      <h2 className="panel-title">Alerts & Events</h2>
      <div className="panel-body alerts-list">
        <div className="alert-item alert-critical">
          <span className="alert-tag">Target Lock</span>
          <p className="alert-text">
            Suspicious vehicle locked • Sector A-12 • Priority HIGH
          </p>
          <span className="alert-time">00:13 ago</span>
        </div>
        <div className="alert-item alert-warning">
          <span className="alert-tag">Route Suggestion</span>
          <p className="alert-text">
            Nearest patrol: Unit P-21 • ETA 90 seconds via Route 34.
          </p>
          <span className="alert-time">00:25 ago</span>
        </div>
        <div className="alert-item">
          <span className="alert-tag">System</span>
          <p className="alert-text">Drone Alpha launched from Patrol P-21.</p>
          <span className="alert-time">01:02 ago</span>
        </div>
      </div>
    </section>
  );
}

// ===== COMM PANEL =====
function CommPanel() {
  return (
    <section className="panel comm-panel">
      <h2 className="panel-title">Secure Communications</h2>
      <div className="panel-body comm-body">
        <div className="comm-messages">
          <div className="msg msg-in">
            <div className="msg-meta">
              <span className="msg-author">Patrol P-21</span>
              <span className="msg-time">22:14</span>
            </div>
            <p className="msg-text">
              Visual contact lost due to traffic. Requesting aerial support.
            </p>
          </div>
          <div className="msg msg-out">
            <div className="msg-meta">
              <span className="msg-author">Command Center</span>
              <span className="msg-time">22:15</span>
            </div>
            <p className="msg-text">
              Drone Alpha launched. Maintain safe distance and follow guidance.
            </p>
          </div>
          <div className="msg msg-system">
            <p className="msg-text">
              [System] Target locked by Drone Alpha. Updated route sent to P-21.
            </p>
          </div>
        </div>
        <form className="comm-input-row" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            className="comm-input"
            placeholder="Type secure command..."
          />
          <button className="btn btn-primary" type="submit">
            Send
          </button>
        </form>
      </div>
    </section>
  );
}

// ===== APP ROOT =====
function App() {
  const [launchDrone, setLaunchDrone] = useState(false);
  const [returnDrone, setReturnDrone] = useState(false);
  const [mode, setMode] = useState("Idle");

  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

    const handleLaunch = async () => {
    try {
      setActionLoading(true);
      setReturnDrone(false);
      setLaunchDrone(false); // reset animation
      await fetch(`${API_BASE}/launch`, { method: "POST" });
      setTimeout(() => {
        setLaunchDrone(true);   // تحريك الخريطة
        setMode("En Route");    // مبدئياً، إلى أن يجي telemetry
      }, 0);
      } catch (err) {
        console.error("Failed to launch drone", err);
        setError("Failed to launch drone");
      } finally {
        setActionLoading(false);
      }
    };

    const handleReturn = async () => {
      try {
        setActionLoading(true);
        setLaunchDrone(false);
        setReturnDrone(false); // reset animation
        await fetch(`${API_BASE}/return`, { method: "POST" });
        setTimeout(() => {
          setReturnDrone(true);   // تحريك رجوع الخريطة
          setMode("Returning");   // مبدئياً
        }, 0);
      } catch (err) {
        console.error("Failed to return drone", err);
        setError("Failed to return drone");
      } finally {
        setActionLoading(false);
      }
    };

  

    useEffect(() => {
    let isMounted = true;

    const fetchTelemetry = async () => {
      try {
        const res = await fetch(`${API_BASE}/telemetry`);
        const data = await res.json();
        if (!isMounted) return;
        setTelemetry(data);
        setMode(data.mode || "Idle");
        setLoading(false);
        setError(null);
      } catch (err) {
        if (!isMounted) return;
        console.error("Failed to fetch telemetry", err);
        setError("Lost connection to drone service");
        setLoading(false);
      }
    };

    fetchTelemetry();
    const intervalId = setInterval(fetchTelemetry, 2000); // كل ثانيتين

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);


  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-title-block">
          <h1>Falcon Eye – Drone Command & Control</h1>
          <p className="app-subtitle">
            Real-time aerial support for field patrols • Smart tracking • Secure
            communications
          </p>
        </div>
        <div className="app-status-block">
          <span className="badge badge-ok">All Systems Online</span>
          <span className="badge badge-drone">Active Drones: 1 / 6</span>
        </div>
      </header>

      <main className="dashboard-grid">
        <div className="grid-main">
          <MapPanel launchDrone={launchDrone} returnDrone={returnDrone} />
          <VideoPanel />
        </div>
        <div className="grid-side">
          <DroneStatusPanel
            telemetry={telemetry}
            loading={loading}
            error={error}
            actionLoading={actionLoading}
            onLaunch={handleLaunch}
            onReturn={handleReturn}
          />
          <AlertsPanel />
          <CommPanel />
        </div>

      </main>
    </div>
  );
}

export default App;
