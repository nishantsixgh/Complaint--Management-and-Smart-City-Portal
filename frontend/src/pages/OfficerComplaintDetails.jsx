import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axiosInstance.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { getPriorityBadgeClass, getStatusBadgeClass } from "../utils/complaintStatus.js";

const officerStatuses = ["In Progress", "Resolved", "Rejected"];

const OfficerComplaintDetails = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [status, setStatus] = useState("In Progress");
  const [remark, setRemark] = useState("");
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadComplaint = async () => {
      try {
        const { data } = await api.get(`/officer/complaints/${id}`);
        setComplaint(data.complaint);
        setStatus(officerStatuses.includes(data.complaint.status) ? data.complaint.status : "In Progress");
        setRemark(data.complaint.officerRemark || "");
      } catch (error) {
        setAlert({
          type: "danger",
          message: error.response?.data?.message || "Unable to load assigned complaint."
        });
      } finally {
        setLoading(false);
      }
    };

    loadComplaint();
  }, [id]);

  const updateStatus = async (event) => {
    event.preventDefault();
    setSaving(true);
    setAlert(null);

    try {
      const { data } = await api.put(`/officer/complaints/${id}/status`, { status });
      setComplaint(data.complaint);
      setAlert({ type: "success", message: data.message });
    } catch (error) {
      setAlert({
        type: "danger",
        message: error.response?.data?.message || "Unable to update status."
      });
    } finally {
      setSaving(false);
    }
  };

  const saveRemark = async (event) => {
    event.preventDefault();
    setSaving(true);
    setAlert(null);

    try {
      const { data } = await api.put(`/officer/complaints/${id}/remark`, { officerRemark: remark });
      setComplaint(data.complaint);
      setAlert({ type: "success", message: data.message });
    } catch (error) {
      setAlert({
        type: "danger",
        message: error.response?.data?.message || "Unable to save remark."
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading assigned complaint..." />;
  }

  return (
    <section className="py-5">
      <div className="container">
        <div className="mb-4">
          <Link className="btn btn-outline-secondary btn-sm" to="/officer/complaints">
            Back to Assigned Complaints
          </Link>
        </div>

        {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

        {complaint && (
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="bg-white profile-panel p-4 p-md-5">
                <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
                  <div>
                    <h1 className="h3 fw-semibold mb-2">{complaint.title}</h1>
                    <p className="text-muted mb-0">{complaint.trackingId}</p>
                  </div>
                  <div className="d-flex gap-2 align-self-start">
                    <span className={`badge ${getPriorityBadgeClass(complaint.priority)}`}>{complaint.priority}</span>
                    <span className={`badge ${getStatusBadgeClass(complaint.status)}`}>{complaint.status}</span>
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <div className="detail-box">
                      <span>Category</span>
                      <strong>{complaint.category}</strong>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="detail-box">
                      <span>City</span>
                      <strong>{complaint.city}</strong>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="detail-box">
                      <span>Location</span>
                      <strong>{complaint.location}</strong>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="detail-box">
                      <span>Address</span>
                      <strong>{complaint.address}</strong>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="detail-box">
                      <span>Citizen</span>
                      <strong>{complaint.createdBy?.name || "Citizen"}</strong>
                    </div>
                  </div>
                </div>

                <h2 className="h5 fw-semibold">Description</h2>
                <p className="text-muted mb-4">{complaint.description}</p>

                {complaint.imageUrl && (
                  <div className="mb-4">
                    <h2 className="h5 fw-semibold">Proof Image</h2>
                    <div className="complaint-image-wrap">
                      <img src={complaint.imageUrl} alt="Complaint proof" />
                    </div>
                  </div>
                )}

                <div className="remark-box">
                  <span>Admin Remark</span>
                  <p>{complaint.adminRemark || "No admin remark provided."}</p>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="bg-white profile-panel p-4 mb-4">
                <h2 className="h5 fw-semibold mb-3">Update Status</h2>
                <form onSubmit={updateStatus}>
                  <label className="form-label" htmlFor="status">
                    Status
                  </label>
                  <select
                    className="form-select mb-3"
                    id="status"
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                  >
                    {officerStatuses.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <button className="btn btn-primary w-100" type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Update Status"}
                  </button>
                </form>
              </div>

              <div className="bg-white profile-panel p-4">
                <h2 className="h5 fw-semibold mb-3">Work Remark</h2>
                <form onSubmit={saveRemark}>
                  <label className="form-label" htmlFor="remark">
                    Remark
                  </label>
                  <textarea
                    className="form-control mb-3"
                    id="remark"
                    rows="6"
                    value={remark}
                    onChange={(event) => setRemark(event.target.value)}
                    minLength="3"
                    required
                  />
                  <button className="btn btn-outline-primary w-100" type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Remark"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default OfficerComplaintDetails;
