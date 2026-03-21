import React, { useState, useEffect } from "react";
import Sidebar from "../Components/Dash/Sidebar";
import axios from "axios";

const IncidentReport = () => {
  const [incidentreport, setIncidentReport] = useState([]);

  const getAllIncident = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const { data } = await axios.get(
        "https://womansafetybackend.onrender.com/api/v1/incidents",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      setIncidentReport(data);
    } catch (err) {
      console.error(err);
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
              <th>Name</th>
              <th>Report</th>
              <th>Address</th>
              <th>Pincode</th>
              <th>Evidence</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody className="text-center">
            {incidentreport.map((p) => (
              <tr key={p.id}>
                <td>{p.uname}</td>
                <td>{p.report}</td>
                <td>{p.address}</td>
                <td>{p.pincode}</td>

                {/* ✅ Evidence */}
                <td>
                  {Array.isArray(p.images) && p.images.length > 0 ? (
                    p.images.map((img, i) => (
                      <a
                        key={i}
                        href={`https://womansafetybackend.onrender.com${img}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-primary mb-1"
                        style={{ display: "block" }}
                      >
                        View File {i + 1}
                      </a>
                    ))
                  ) : (
                    <span className="text-muted">No File</span>
                  )}
                </td>

                {/* ✅ STATUS UPDATE (FIXED) */}
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={p.status || "Pending"}
                    onChange={async (e) => {
                      const newStatus = e.target.value;
                      const token = localStorage.getItem("token");

                      try {
                        await axios.patch(
                          `https://womansafetybackend.onrender.com/api/v1/incidents/${p.id}/status`,
                          { status: newStatus },
                          {
                            headers: {
                              Authorization: "Bearer " + token,
                            },
                          }
                        );

                        // UI update
                        setIncidentReport((prev) =>
                          prev.map((item) =>
                            item.id === p.id
                              ? { ...item, status: newStatus }
                              : item
                          )
                        );
                      } catch (err) {
                        alert("Status update failed");
                        console.error(err);
                      }
                    }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Review">In Review</option>
                    <option value="Action Taken">Action Taken</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncidentReport;