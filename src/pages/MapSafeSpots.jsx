import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import AsyncSelect from "react-select/async";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import L from "leaflet";

/* ================================================================
   LEAFLET DEFAULT ICON FIX
================================================================ */
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

/* ================================================================
   CUSTOM MARKER ICONS
================================================================ */
const policeIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2991/2991123.png",
  iconSize: [30, 30],
});

const hospitalIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2967/2967350.png",
  iconSize: [30, 30],
});

const publicIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [30, 30],
});

/* ================================================================
   FILTER CONFIG
================================================================ */
const FILTERS = [
  { key: "All", icon: "https://cdn-icons-png.flaticon.com/512/1828/1828817.png" },
  { key: "Police", icon: "https://cdn-icons-png.flaticon.com/512/2991/2991123.png" },
  { key: "Hospital", icon: "https://cdn-icons-png.flaticon.com/512/2967/2967350.png" },
  { key: "Public", icon: "https://cdn-icons-png.flaticon.com/512/854/854878.png" },
];

/* ================================================================
   MAP CLICK HANDLER
================================================================ */
const MapClickHandler = ({ onSelect }) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });
  return null;
};

/* ================================================================
   MAP CENTER CHANGE
================================================================ */
const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 13, { duration: 1.2 });
  }, [center, map]);
  return null;
};

/* ================================================================
   HEATMAP LAYER
================================================================ */
const SafetyHeatmapLayer = ({ points, enabled }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !enabled || points.length === 0) return;

    const heatData = points.map((p) => [
      p.location.lat,
      p.location.lng,
      0.7,
    ]);

    const heatLayer = L.heatLayer(heatData, {
      radius: 28,
      blur: 20,
      maxZoom: 16,
      gradient: {
        0.2: "#22c55e",
        0.5: "#eab308",
        0.8: "#ef4444",
      },
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, enabled, points]);

  return null;
};

/* ================================================================
   SAFETY SCORE LOGIC
================================================================ */
const calculateSafetyScore = (spots) => {
  if (!spots || spots.length === 0) return 20;

  let score = 0;

  spots.forEach((spot) => {
    let weight = 0;

    if (spot.type === "Police") weight = 10;
    else if (spot.type === "Hospital") weight = 7;
    else weight = 4;

    const dist = Number(spot.distance);

    if (dist <= 1) score += weight;
    else if (dist <= 3) score += weight * 0.7;
    else score += weight * 0.4;
  });

  if (score > 100) score = 100;

  return Math.round(score);
};

/* ================================================================
   CITY SEARCH
================================================================ */
const loadCityOptions = async (inputValue) => {
  if (!inputValue) return [];

  const res = await axios.get("https://nominatim.openstreetmap.org/search", {
    params: { q: inputValue, format: "json", limit: 5 },
  });

  return res.data.map((c) => ({
    label: c.display_name,
    value: {
      lat: parseFloat(c.lat),
      lng: parseFloat(c.lon),
      name: c.display_name,
    },
  }));
};

/* ================================================================
   MAIN COMPONENT
================================================================ */
const MapSafeSpots = ({ location }) => {
  const [safeSpots, setSafeSpots] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  const [activeLocation, setActiveLocation] = useState(location);
  const [cityLabel, setCityLabel] = useState("Select Location");

  const [radius, setRadius] = useState(5);
  const [showHeatmap, setShowHeatmap] = useState(false);

  const [safetyScore, setSafetyScore] = useState(0);

  useEffect(() => {
    if (location) {
      setActiveLocation(location);
      setCityLabel("Current Location");
    }
  }, [location]);

  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await axios.get("https://nominatim.openstreetmap.org/reverse", {
        params: { lat, lon: lng, format: "json" },
      });
      setCityLabel(res.data.display_name || "Selected Location");
    } catch {
      setCityLabel("Selected Location");
    }
  };

  const handleMapClick = ({ lat, lng }) => {
    setActiveLocation({ lat, lng });
    reverseGeocode(lat, lng);
  };

  useEffect(() => {
    if (!activeLocation) return;

    const fetchSpots = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "https://womansafstybackend.onrender.com/api/v1/safespots/nearby",
          {
            params: {
              lat: activeLocation.lat,
              lng: activeLocation.lng,
              type: filter,
              radius,
            },
          }
        );
        setSafeSpots(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpots();
  }, [activeLocation, filter, radius]);

  const spotsWithDistance = useMemo(() => {
    if (!activeLocation) return [];

    return safeSpots.map((s) => {
      const dx = activeLocation.lat - s.location.lat;
      const dy = activeLocation.lng - s.location.lng;
      const distanceKm = Math.sqrt(dx * dx + dy * dy) * 111;

      return { ...s, distance: distanceKm.toFixed(2) };
    });
  }, [safeSpots, activeLocation]);

  useEffect(() => {
    const score = calculateSafetyScore(spotsWithDistance);
    setSafetyScore(score);
  }, [spotsWithDistance]);

  if (!activeLocation) return <p style={{ color: "#1e293b", background: "#f8fafc", width: "100vw", fontWeight: "bold", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Detecting location...</p>;

  return (
    <div style={{ background: "#ffffff", padding: 24, marginTop: 35, width: "100%", minHeight: "calc(100vh - 80px)", boxSizing: "border-box", position: "relative" }}>
      {/* ===== CENTER MAIN HEADING ===== */}
      <div
        style={{
          position: "absolute",
          top: "-10px",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "20px",
          fontWeight: "800",
          color: "#0f172a",
          //letterSpacing: "0.5px",
          background: "#ffffff",
          padding: "6px 20px",
          borderRadius: "999px",
          zIndex: 5,
          border: "0px solid #e5e7eb",
        }}
      >
        Nearby Safe Spots
      </div>
      {/* Safety Score */}
      <div
        style={{
          padding: "8px 16px",          // 👈 height kam
          marginTop: 15,
          marginBottom: 16,
          borderRadius: 8,
          textAlign: "center",
          color: "#fff",
          fontWeight: 600,              // 👈 less heavy than bold
          fontSize: "14px",             // 👈 text size control
          letterSpacing: "0.3px",
          boxShadow: "0 3px 10px rgba(0,0,0,0.25)", // 👈 softer shadow
          background:
            safetyScore >= 80
              ? "#166534"
              : safetyScore >= 60
                ? "#92400e"
                : safetyScore >= 40
                  ? "#9a3412"
                  : "#991b1b",
        }}
      >
        📍 Safety Score: {safetyScore}/100 —{" "}
        {safetyScore >= 80
          ? "Very Safe"
          : safetyScore >= 60
            ? "Moderately Safe"
            : safetyScore >= 40
              ? "Caution Area"
              : "Risky Area"}
      </div>

      {/* City Search */}
      <AsyncSelect
        cacheOptions
        loadOptions={loadCityOptions}
        placeholder="Search city..."
        onChange={(selected) => {
          setActiveLocation({
            lat: selected.value.lat,
            lng: selected.value.lng,
          });
          setCityLabel(selected.value.name);
        }}
      />

      {/* Radius */}
      <div style={{ margin: "12px 0", color: "#fff" }}>
        <label>
          🔍 Radius: <b>{radius} km</b>
        </label>
        <input
          type="range"
          min="2"
          max="10"
          step="1"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "10px", margin: "14px 0", overflowX: "auto", whiteSpace: "nowrap", paddingBottom: "6px" }}>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "20px",
              background: filter === f.key ? "#ef4444" : "#1e293b",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <img src={f.icon} alt={f.key} width="16" />
            {f.key}
          </button>
        ))}
      </div>

      {/* Heatmap Toggle */}
      <button
        onClick={() => setShowHeatmap((prev) => !prev)}
        style={{
          padding: "8px 16px",
          borderRadius: "10px",
          background: showHeatmap ? "#22c55e" : "#334155",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          marginBottom: "10px",
        }}
      >
        🔥 Safety Heatmap {showHeatmap ? "ON" : "OFF"}
      </button>

      {/* Map */}
      <div style={{ height: "320px", borderRadius: "10px", overflow: "hidden" }}>
        <MapContainer
          center={[activeLocation.lat, activeLocation.lng]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <ChangeView center={[activeLocation.lat, activeLocation.lng]} />
          <MapClickHandler onSelect={handleMapClick} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <SafetyHeatmapLayer enabled={showHeatmap} points={spotsWithDistance} />

          <Marker position={[activeLocation.lat, activeLocation.lng]}>
            <Popup>{cityLabel}</Popup>
          </Marker>

          {spotsWithDistance.map((spot) => {
            const icon =
              spot.type === "Police"
                ? policeIcon
                : spot.type === "Hospital"
                  ? hospitalIcon
                  : publicIcon;

            return (
              <Marker key={spot._id} position={[spot.location.lat, spot.location.lng]} icon={icon}>
                <Popup>
                  <b>{spot.name}</b>
                  <br />
                  {spot.type}
                  <br />
                  📍 {spot.distance} km
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Status */}
      {loading && (
        <p style={{ color: "#94a3b8", marginTop: "10px" }}>
          🔄 Fetching nearby safe spots...
        </p>
      )}

      {!loading && spotsWithDistance.length === 0 && (
        <p style={{ color: "#f87171", marginTop: "10px" }}>
          ❌ No safe spots found
        </p>
      )}

      {/* List */}
      {!loading &&
        spotsWithDistance.map((s) => (
          <div key={s._id} style={{ color: "black", marginTop: "8px" }}>
            <b>{s.name}</b> — {s.type} — 📍 {s.distance} km
          </div>
        ))}
    </div>
  );
};

export default MapSafeSpots;