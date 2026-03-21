import React from "react";
import Sidebar from "../Components/Dash/Sidebar";
import { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [incidentreport, setincidentreport] = useState([]);

  const getAllIncident = async () => {
    try {
      const token = localStorage.getItem("token"); // ✅ FIX 1

      if (!token) {
        console.log("Token missing");
        return;
      }

      const { data } = await axios.get(
        "https://womansafetybackend.onrender.com/api/v1/incidents", // ✅ FIX 2 (http)
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ FIX 3
          },
        }
      );

      if (data) {
        setincidentreport(data);
      }

      console.log("INCIDENT DATA:", data);
    } catch (err) {
      console.log("DASHBOARD ERROR:", err.response?.data || err);
    }
  };

  useEffect(() => {
    getAllIncident();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="d-flex justify-content-start">
      <Sidebar />

      <div className="container table-responsive mx-3">
        <div className="features_wrapper" style={{ marginTop: "-50px" }}>
          <div className="row">
            <div className="col-12 text-center">
              <p className="features_subtitle">
                Latest Women Incident Reported !
              </p>
              <h2 className="features_title">Women Incident Data</h2>
            </div>
          </div>
        </div>

        <table
          className="table table-striped table-bordered table-hover"
          style={{ marginTop: "-50px" }}
        >
          <thead className="table-dark text-center">
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Report</th>
              <th scope="col">Address</th>
              <th scope="col">Pincode</th>
            </tr>
          </thead>

          <tbody className="text-center">
            {incidentreport.map((p, i) => (
              <tr key={i}>
                <th scope="row">{p.uname}</th>
                <td>{p.report}</td>
                <td>{p.address}</td>
                <td>{p.pincode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;