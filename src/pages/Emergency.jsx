import React, { useState, useEffect } from "react";
import "../styles/Emergency.css";
import { PiSirenBold } from "react-icons/pi";
import Parallelx from "../Components/Parallelx";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import { useAuth } from "../context/auth";
import toast from "react-hot-toast";

const Emergency = () => {
  const [long, setLong] = useState("");
  const [lat, setLat] = useState("");
  const [auth] = useAuth();

  // 📍 Get location once
  useEffect(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
      },
      () => toast.error("Location access denied")
    );
  }, []);

  const handleSubmit = async () => {
    console.log("AUTH =>", auth);
    console.log("USER =>", auth?.user);
    console.log("USER ID =>", auth?.user?._id);


    if (!lat || !long) {
      toast.error("Location not detected yet");
      return;
    }

    if (!auth?.token || !auth?.user._id) {
      toast.error("User not logged in properly");
      return;
    }

    const payload = {
    //  userId: auth?.user._id,
      lat,
      long,
    };

    try {
      const res = await fetch(
        "http://localhost:5000/api/v1/emergency/emergencypressed",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("🚨 SOS SENT SUCCESSFULLY");
      } else {
        toast.error(data.message || "SOS FAILED");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <Navbar />

      <div className="heightRes">
        <section className="banner_wrapper">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-12 my-5 text-center">

                <p className="banner-subtitle">
                  Your Safety our Priority
                </p>

                <h1 className="banner-title mb-5">
                  Help us bring <span>Women Safety</span> to Reality with us
                </h1>

                <center>
                  <button
                    className="button-30"
                    onClick={handleSubmit}
                  >
                    <PiSirenBold size={200} className="text-white" />
                  </button>
                </center>

              </div>
            </div>
          </div>
        </section>
      </div>

      <Parallelx />
      <Footer />
    </>
  );
};

export default Emergency;