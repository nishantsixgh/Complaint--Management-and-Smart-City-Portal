import { useState } from "react";
import api from "../api/axiosInstance.js";
import { getPriorityBadgeClass, getStatusBadgeClass } from "../utils/complaintStatus.js";

const TrackComplaint = () => {
  const [trackingId, setTrackingId] = useState("");
  const [complaint, setComplaint] = useState(null);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setAlert(null);
    setComplaint(null);
    setLoading(true);

    try {
      const { data } = await api.get(`/complaints/track/${trackingId.trim()}`);
      setComplaint(data.complaint);
    } catch (error) {
      setAlert({
        type: "danger",
        message: error.response?.data?.message || "Unable to track complaint."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="bg-white auth-panel p-4 p-md-5">
              <h1 className="h3 fw-semibold mb-2">Track Complaint</h1>
              <p className="text-muted mb-4">Enter your tracking ID to check the latest complaint status.</p>

              {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

              <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-md-8">
                  <label className="form-label" htmlFor="trackingId">
                    Tracking ID
                  </label>
                  <input
                    className="form-control"
                    id="trackingId"
                    value={trackingId}
                    onChange={(event) => setTrackingId(event.target.value.toUpperCase())}
                    placeholder="CMP-2026-100001"
                    required
                  />
                </div>
                <div className="col-md-4 d-flex align-items-end">
                  <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                    {loading ? "Tracking..." : "Track"}
                  </button>
                </div>
              </form>

              {complaint && (
                <div className="tracking-result mt-4">
                  <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-3">
                    <div>
                      <h2 className="h5 fw-semibold mb-1">{complaint.title}</h2>
                      <p className="text-muted mb-0">{complaint.trackingId}</p>
                    </div>
                    <div className="d-flex gap-2 align-self-start">
                      <span className={`badge ${getPriorityBadgeClass(complaint.priority)}`}>{complaint.priority}</span>
                      <span className={`badge ${getStatusBadgeClass(complaint.status)}`}>{complaint.status}</span>
                    </div>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="detail-box">
                        <span>Category</span>
                        <strong>{complaint.category}</strong>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="detail-box">
                        <span>City</span>
                        <strong>{complaint.city}</strong>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="detail-box">
                        <span>Location</span>
                        <strong>{complaint.location}</strong>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="detail-box">
                        <span>Submitted</span>
                        <strong>{new Date(complaint.createdAt).toLocaleDateString()}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrackComplaint;
