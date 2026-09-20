import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosInstance.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import PriorityBadge from "../components/PriorityBadge.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const { data } = await api.get("/complaints/my");
        setComplaints(data.complaints);
      } catch (error) {
        setAlert({
          type: "danger",
          message: error.response?.data?.message || "Unable to load complaints."
        });
      } finally {
        setLoading(false);
      }
    };

    loadComplaints();
  }, []);

  return (
    <section className="py-5">
      <div className="container">
        <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
          <div>
            <h1 className="h3 fw-semibold mb-1">My Complaints</h1>
            <p className="text-muted mb-0">Review your submitted complaints and current status.</p>
          </div>
          <Link className="btn btn-primary align-self-start" to="/complaints/new">
            Add Complaint
          </Link>
        </div>

        {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

        <div className="bg-white table-panel">
          {loading ? (
            <LoadingSpinner text="Loading complaints..." />
          ) : complaints.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-muted mb-3">No complaints submitted yet.</p>
              <Link className="btn btn-outline-primary" to="/complaints/new">
                Submit your first complaint
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Tracking ID</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Created</th>
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
                        <PriorityBadge priority={complaint.priority} />
                      </td>
                      <td>
                        <StatusBadge status={complaint.status} />
                      </td>
                      <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Link className="btn btn-sm btn-outline-primary" to={`/complaints/${complaint._id}`}>
                          View
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

export default MyComplaints;
