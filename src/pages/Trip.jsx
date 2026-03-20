import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";

/* Leaflet icon fix */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

/* Map click handler */
function MapClickHandler({ setPosition, setDestination }) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);

      try {
        const res = await axios.get(
          "https://nominatim.openstreetmap.org/reverse",
          {
            params: {
              format: "json",
              lat,
              lon: lng,
            },
            headers: { "Accept-Language": "en" },
          }
        );

        const addr = res.data.address || {};
        const place =
          addr.suburb ||
          addr.neighbourhood ||
          addr.village ||
          addr.town ||
          addr.city ||
          addr.county ||
          "Unknown place";

        const state = addr.state || "";
        setDestination(state ? `${place}, ${state}` : place);
      } catch (err) {
        console.log("Location fetch error");
      }
    },
  });

  return null;
}

/* Toast Component for SOS */
const Toast = ({ message, show, onClose }) => {
  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "30px",
        right: "30px",
        background: "#ff4d4d",
        color: "white",
        padding: "15px 25px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
        zIndex: 1000,
        animation: "fadein 0.5s, fadeout 0.5s 2.5s",
      }}
    >
      {message}
      <button
        onClick={onClose}
        style={{
          marginLeft: "15px",
          background: "transparent",
          border: "none",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        ✖
      </button>
    </div>
  );
};

const Trip = () => {
  const [position, setPosition] = useState([26.8467, 80.9462]);
  const [destination, setDestination] = useState("Lucknow, Uttar Pradesh");

  const [tripStatus, setTripStatus] = useState("NOT_STARTED");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [history, setHistory] = useState([]);

  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  /* LOAD HISTORY */
  useEffect(() => {
    const savedHistory = localStorage.getItem("tripHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const startTrip = () => {
    setTripStatus("STARTED");
    setStartTime(new Date().toLocaleTimeString());
    setEndTime(null);
  };

  const endTrip = () => {
    const end = new Date().toLocaleTimeString();
    const newTrip = { destination, start: startTime, end };

    const updatedHistory = [newTrip, ...history];
    setHistory(updatedHistory);
    localStorage.setItem("tripHistory", JSON.stringify(updatedHistory));

    setEndTime(end);
    setTripStatus("NOT_STARTED");
  };

  /* 🔴 SOS LOGIC */
  const sendSOS = () => {
    const msg = `🚨 SOS SENT!\nLocation: ${destination}\nLat: ${position[0]}\nLng: ${position[1]}`;
    setToastMsg(msg);
    setShowToast(true);

    console.log("🚨 SOS SENT", {
      destination,
      lat: position[0],
      lng: position[1],
      time: new Date().toLocaleTimeString(),
    });

    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif",backgroundColor:"#f8fafc",minHeight:"100vh",color:"#1e293b" }}>
      <h2>🚗 Trip Dashboard</h2>
        
      {/* INFO PANEL */}
      <div
        style={{
          background: "white",
          color: "black",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
          marginTop: "40px",
         border: "1px solid #c8ced4",
        }}
      >
        <p><b>Destination:</b> {destination}</p>
        <p><b>Status:</b> {tripStatus}</p>
        <p><b>Started:</b> {startTime || "-"}</p>
        <p><b>Ended:</b> {endTime || "-"}</p>

        {/* Buttons */}
        {tripStatus !== "STARTED" && (
          <button
            onClick={startTrip}
            style={{
              padding: "10px 20px",
              background: "green",
              color: "white",
              border: "none",
              borderRadius: "5px",
              marginRight: "10px",
              cursor: "pointer",
            }}
          >
            Start Trip
          </button>
        )}

        {tripStatus === "STARTED" && (
          <button
            onClick={endTrip}
            style={{
              padding: "10px 20px",
              background: "#b025eb",
              color: "white",
              border: "none",
              borderRadius: "5px",
              marginRight: "10px",
              cursor: "pointer",
            }}
          >
            End Trip
          </button>
        )}

        {/* SOS button always visible */}
        <button
          onClick={sendSOS}
          style={{
            padding: "10px 20px",
            background: "#dc2626",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          🚨 SOS
        </button>
      </div>


      {/* MAP */}
      <MapContainer
        center={position}
        zoom={14}
        style={{ height: "220px", width: "100%",marginTop:"20px",borderRadius:"10px",overflow:"hidden",border:"1px solid #c8ced4" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position} />
        <MapClickHandler setPosition={setPosition} setDestination={setDestination} />
      </MapContainer>

      {/* HISTORY */}
      <div style={{ marginTop: "20px", color: "black" }}>
        <h3>📜 Trip History</h3>
        {history.length === 0 && <p>No trips yet</p>}
        {history.map((trip, index) => (
          <div
            key={index}
            style={{
              marginBottom: "10px",
              padding: "12px",
              border: "1px solid #c8ced4",
              color: "black",
              borderRadius: "10px",
              background: "white",
            }}
          >
            <b>{trip.destination}</b>
            <div>{trip.start} → {trip.end}</div>
          </div>
        ))}
      </div>

      {/* SOS TOAST */}
      <Toast message={toastMsg} show={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
};

export default Trip;