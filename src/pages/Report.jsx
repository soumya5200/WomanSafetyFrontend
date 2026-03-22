import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import reports from '../images/report.png';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';
import { useNavigate } from "react-router-dom";

function Report() {
  const [report, setReport] = useState('');
  const [pincodeOfIncident, setPincodeOfIncident] = useState('');
  const [address, setAddress] = useState('');
  const [files, setFiles] = useState([]); // ✅ CHANGED

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!report.trim()) return toast.error('Report is Required');
    if (!pincodeOfIncident.trim()) return toast.error('PinCode is Required');
    if (!address.trim()) return toast.error('Address is Required');

    const token = localStorage.getItem('token');
    if (!token) {
      return toast.error('Please login first');
    }

    try {
      const formData = new FormData();

      // ✅ MULTIPLE FILES
      for (let i = 0; i < files.length; i++) {
        formData.append("notes", files[i]);
      }

      formData.append('report', report);
      formData.append('pincodeOfIncident', pincodeOfIncident);
      formData.append('address', address);

      await axios.post(
        "https://womansafstybackend.onrender.com/api/v1/incidents",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          },
        }
      );

      toast.success('Incident Reported Successfully');

      setReport('');
      setPincodeOfIncident('');
      setAddress('');
      setFiles([]);

      // ✅ AUTO OPEN MY INCIDENTS
      navigate("/incident-dashboard");

    } catch (err) {
      console.log('REPORT ERROR:', err.response || err);
      toast.error(err.response?.data?.message || 'Error in Sending Report');
    }
  };

  return (
    <>
      <Navbar />

      <div className="marginStyle">
        <div className="container d-flex justify-content-center align-items-center">
          <div className="row border rounded-5 p-3 bg-white shadow box-area reverseCol">

            <div className="col-md-6 d-flex justify-content-center align-items-center">
              <img src={reports} className="img-fluid " alt="report"
              style={{animation: "float 3s ease-in-out infinite"}}
               />
            </div>

            <form onSubmit={handleSubmit} className="col-md-6">
              <h2 className="mb-3">Incident Report</h2>

              <input
                type="number"
                value={pincodeOfIncident}
                onChange={(e) => setPincodeOfIncident(e.target.value)}
                className="form-control mb-3"
                placeholder="Enter Pincode"
              />

              <textarea
                value={report}
                onChange={(e) => setReport(e.target.value)}
                className="form-control mb-3"
                placeholder="Write Incident Report"
              />

              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="form-control mb-3"
                placeholder="Enter Address"
              />

              {/* ✅ MULTIPLE FILE INPUT */}
              <input
                type="file"
                multiple
                onChange={(e) => setFiles(e.target.files)}
                className="form-control mb-3"
              />

              <button type="submit" className="btn btn-primary w-100">
                Submit Incident
              </button>
            </form>

          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Report;