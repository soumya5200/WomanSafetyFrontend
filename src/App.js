import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";

/* ✅ COMMON COMPONENTS */
import Navbar from "./Components/Navbar/Navbar";

/* ✅ PAGES */
import Home from "./pages/Home";
import AboutUs2 from "./pages/AboutUs2";
import ContactUs from "./Components/ContactUs";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Emergency from "./pages/Emergency";
import Report from "./pages/Report";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Trip from "./pages/Trip";
import SafeSpotsPage from "./pages/SafeSpotsPage";
import Incident from "./pages/IncidentReport";
import CloseFile from "./pages/CloseFile";
import ChatScreen from "./pages/ChatScreen";
import HeroCaro from "./pages/HeroCaro";
import IncidentDashboard from "./pages/IncidentDahboard.jsx";
import NotFound from "./Components/Errors/404";

function App() {
  return (
    <Router>
      {/* ✅ NAVBAR — AB HAR PAGE PE DIKHEGA */}
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/caro" element={<HeroCaro />} />
        <Route path="/about" element={<AboutUs2 />} />
        <Route path="/contact" element={<ContactUs />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/emergency" element={<Emergency />} />
        <Route path="/report" element={<Report />} />

        {/* ✅ YE DONO AB NAVBAR KE SAATH DIKHENGE */}
        <Route path="/trip" element={<Trip />} />
        <Route path="/safe-spots" element={<SafeSpotsPage />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/profile" element={<Profile />} />
        <Route path="/incident" element={<Incident />} />
        <Route path="/closedreport" element={<CloseFile />} />
        <Route path="/chat" element={<ChatScreen />} />
        <Route path="/incident-dashboard" element={<IncidentDashboard />} />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Toaster />
    </Router>
  );
}

export default App;