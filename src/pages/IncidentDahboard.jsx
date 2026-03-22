import React, { useState, useEffect } from "react";
import Sidebar from "../Components/Dash/Sidebar";
import axios from "axios";

const IncidentDashboard = () => {
  const [incidentReport, setIncidentReport] = useState([]);

  const getAllIncidents = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const { data } = await axios.get(
        "https://womansafetybackend.onrender.com/api/v1/incidents",
        {
          headers: { Authorization: "Bearer " + token },
        }
      );

      setIncidentReport(data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) window.location.href = "/login";
    }
  };

  useEffect(() => {
    getAllIncidents();
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
              <th>Name</th>
              <th>Report</th>
              <th>Address</th>
              <th>Pincode</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {incidentReport.map((incident, i) => (
              <tr key={i}>
                <td>{incident.user?.uname || "Unknown"}</td>
                <td>{incident.report}</td>
                <td>{incident.address}</td>
                <td>{incident.pincodeOfIncident}</td>
                <td>
                  <span
                    className={
                      incident.status === "Pending"
                        ? "badge bg-warning"
                        : "badge bg-success"
                    }
                  >
                    {incident.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncidentDashboard;