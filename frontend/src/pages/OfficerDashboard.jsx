import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosInstance.js";

const OfficerDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const { data } = await api.get("/officer/complaints");
        setComplaints(data.complaints);
      } catch (error) {
        setAlert({
          type: "danger",
          message: error.response?.data?.message || "Unable to load assigned complaints."
        });
      } finally {
        setLoading(false);
      }
    };

    loadComplaints();
  }, []);

  const stats = useMemo(
    () => ({
      total: complaints.length,
      assigned: complaints.filter((complaint) => complaint.status === "Assigned").length,
      inProgress: complaints.filter((complaint) => complaint.status === "In Progress").length,
      resolved: complaints.filter((complaint) => complaint.status === "Resolved").length,
      rejected: complaints.filter((complaint) => complaint.status === "Rejected").length
    }),
    [complaints]
  );

  return (
    <section className="py-5">
      <div className="container">
        <div className="admin-heading mb-4">
          <div>
            <h1 className="h3 fw-semibold mb-1">Officer Dashboard</h1>
            <p className="text-muted mb-0">Track work assigned to your department account.</p>
          </div>
          <Link className="btn btn-primary" to="/officer/complaints">
            View Assigned Complaints
          </Link>
        </div>

        {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

        {loading ? (
          <div className="text-center text-muted py-5">Loading officer dashboard...</div>
        ) : (
          <div className="row g-4">
            <div className="col-sm-6 col-lg">
              <div className="admin-stat-card bg-white p-4">
                <span className="stat-accent text-bg-dark">Total Assigned</span>
                <strong>{stats.total}</strong>
              </div>
            </div>
            <div className="col-sm-6 col-lg">
              <div className="admin-stat-card bg-white p-4">
                <span className="stat-accent text-bg-info">Assigned</span>
                <strong>{stats.assigned}</strong>
              </div>
            </div>
            <div className="col-sm-6 col-lg">
              <div className="admin-stat-card bg-white p-4">
                <span className="stat-accent text-bg-primary">In Progress</span>
                <strong>{stats.inProgress}</strong>
              </div>
            </div>
            <div className="col-sm-6 col-lg">
              <div className="admin-stat-card bg-white p-4">
                <span className="stat-accent text-bg-success">Resolved</span>
                <strong>{stats.resolved}</strong>
              </div>
            </div>
            <div className="col-sm-6 col-lg">
              <div className="admin-stat-card bg-white p-4">
                <span className="stat-accent text-bg-danger">Rejected</span>
                <strong>{stats.rejected}</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default OfficerDashboard;
