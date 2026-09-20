import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosInstance.js";
import PriorityBadge from "../components/PriorityBadge.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

const OfficerComplaints = () => {
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

  return (
    <section className="py-5">
      <div className="container-fluid px-3 px-md-4">
        <div className="admin-heading mb-4">
          <div>
            <h1 className="h3 fw-semibold mb-1">Assigned Complaints</h1>
            <p className="text-muted mb-0">Only complaints assigned to you are shown here.</p>
          </div>
        </div>

        {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

        <div className="bg-white table-panel">
          {loading ? (
            <div className="p-4 text-center text-muted">Loading assigned complaints...</div>
          ) : complaints.length === 0 ? (
            <div className="p-4 text-center text-muted">No complaints assigned yet.</div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Tracking ID</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>City</th>
                    <th>Assigned</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint) => (
                    <tr key={complaint._id}>
                      <td className="fw-semibold">{complaint.trackingId}</td>
                      <td>{complaint.title}</td>
                      <td>{complaint.category}</td>
                      <td>
                        <StatusBadge status={complaint.status} />
                      </td>
                      <td>
                        <PriorityBadge priority={complaint.priority} />
                      </td>
                      <td>{complaint.city}</td>
                      <td>{new Date(complaint.updatedAt || complaint.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Link className="btn btn-sm btn-outline-primary" to={`/officer/complaints/${complaint._id}`}>
                          Work
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default OfficerComplaints;
