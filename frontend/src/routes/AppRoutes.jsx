import { Route, Routes } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import PublicOnlyRoute from "../components/PublicOnlyRoute.jsx";
import AdminDashboard from "../pages/AdminDashboard.jsx";
import AddComplaint from "../pages/AddComplaint.jsx";
import About from "../pages/About.jsx";
import ComplaintDetails from "../pages/ComplaintDetails.jsx";
import Contact from "../pages/Contact.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import ManageComplaints from "../pages/ManageComplaints.jsx";
import ManageUsers from "../pages/ManageUsers.jsx";
import MyComplaints from "../pages/MyComplaints.jsx";
import NotFound from "../pages/NotFound.jsx";
import OfficerComplaintDetails from "../pages/OfficerComplaintDetails.jsx";
import OfficerComplaints from "../pages/OfficerComplaints.jsx";
import OfficerDashboard from "../pages/OfficerDashboard.jsx";
import Profile from "../pages/Profile.jsx";
import Register from "../pages/Register.jsx";
import Services from "../pages/Services.jsx";
import TrackComplaint from "../pages/TrackComplaint.jsx";

const AppRoutes = () => {
  return (
    <div className="app-shell">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/track" element={<TrackComplaint />} />
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["user", "admin", "officer"]} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/complaints/new" element={<AddComplaint />} />
            <Route path="/complaints/my" element={<MyComplaints />} />
            <Route path="/complaints/:id" element={<ComplaintDetails />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/complaints" element={<ManageComplaints />} />
            <Route path="/admin/users" element={<ManageUsers />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["officer"]} />}>
            <Route path="/officer" element={<OfficerDashboard />} />
            <Route path="/officer/complaints" element={<OfficerComplaints />} />
            <Route path="/officer/complaints/:id" element={<OfficerComplaintDetails />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default AppRoutes;
