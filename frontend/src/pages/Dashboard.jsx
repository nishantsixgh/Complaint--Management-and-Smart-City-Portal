import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Dashboard = () => {
  const { user } = useAuth();

  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (user?.role === "officer") {
    return <Navigate to="/officer" replace />;
  }

  return (
    <section className="py-5">
      <div className="container">
        <div className="dashboard-header bg-white p-4 p-md-5 mb-4">
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
              <span className="role-badge mb-3">{user?.role}</span>
              <h1 className="h2 fw-bold mb-2">Welcome, {user?.name}</h1>
              <p className="text-muted mb-0">
                Submit civic issues, track every update, and share feedback after resolution from one workspace.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <Link className="btn btn-primary me-2 mb-2 mb-sm-0" to="/complaints/new">
                Add Complaint
              </Link>
              <Link className="btn btn-outline-primary" to="/complaints/my">
                My Complaints
              </Link>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-md-4">
              <div className="feature-card bg-white p-4">
                <h2 className="h5 fw-semibold">Complaints</h2>
                <p className="text-muted mb-3">Create and monitor complaints with tracking IDs.</p>
                <Link className="btn btn-sm btn-outline-primary" to="/complaints/new">
                  Submit Complaint
                </Link>
              </div>
            </div>
          <div className="col-md-4">
              <div className="feature-card bg-white p-4">
                <h2 className="h5 fw-semibold">Assignments</h2>
                <p className="text-muted mb-0">Assigned officers update work progress, remarks, and resolution status.</p>
              </div>
            </div>
          <div className="col-md-4">
              <div className="feature-card bg-white p-4">
                <h2 className="h5 fw-semibold">Administration</h2>
                <p className="text-muted mb-0">Admins manage departments, users, assignments, analytics, and reports.</p>
              </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
