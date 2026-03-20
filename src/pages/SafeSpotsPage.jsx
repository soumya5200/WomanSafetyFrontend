import React, { useEffect, useState } from "react";
import MapSafeSpots from "./MapSafeSpots";

const SafeSpotsPage = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          console.log("PAGE LOCATION:",pos.coords.latitude, pos.coords.longitude);
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => console.error(err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  return (
    <div style={{ padding: "20px", minHeight: "100vh", background: "#f8fafc", color: "#1e293b" ,}}>
      <h2>📍 Nearby Safe Spots</h2>
      <MapSafeSpots location={location} />
    </div>
  );
};

export default SafeSpotsPage;