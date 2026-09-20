import { useEffect, useState } from "react";
import { CheckCircle2, Clock3, MessageSquareText, Send, Star } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axiosInstance.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getPriorityBadgeClass, getStatusBadgeClass } from "../utils/complaintStatus.js";

const ComplaintDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [alert, setAlert] = useState(null);
  const [feedbackForm, setFeedbackForm] = useState({
    rating: "5",
    comment: ""
  });
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComplaint = async () => {
      try {
        const { data } = await api.get(`/complaints/${id}`);
        setComplaint(data.complaint);
        setFeedbackForm((current) => ({
          ...current,
          comment: data.complaint.feedback?.comment || "",
          rating: data.complaint.feedback?.rating ? String(data.complaint.feedback.rating) : "5"
        }));
      } catch (error) {
        setAlert({
          type: "danger",
          message: error.response?.data?.message || "Unable to load complaint details."
        });
      } finally {
        setLoading(false);
      }
    };

    loadComplaint();
  }, [id]);

  const ownerId = complaint?.createdBy?._id || complaint?.createdBy;
  const isOwner = ownerId && user?.id === ownerId.toString();
  const hasFeedback = Boolean(complaint?.feedback?.submittedAt);
  const canSubmitFeedback = complaint?.status === "Resolved" && isOwner && !hasFeedback;

  const handleFeedbackChange = (event) => {
    setFeedbackForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleFeedbackSubmit = async (event) => {
    event.preventDefault();
    setAlert(null);
    setSubmittingFeedback(true);

    try {
      const { data } = await api.post(`/complaints/${id}/feedback`, feedbackForm);
      setComplaint((current) => ({
        ...current,
        feedback: data.feedback
      }));
      setAlert({ type: "success", message: data.message });
    } catch (error) {
      setAlert({
        type: "danger",
        message: error.response?.data?.message || "Unable to submit feedback."
      });
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading complaint..." />;
  }

  return (
    <section className="py-5">
      <div className="container">
        <div className="mb-4">
          <Link className="btn btn-outline-secondary btn-sm" to="/complaints/my">
            Back to My Complaints
          </Link>
        </div>

        {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

        {complaint && (
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
                  <span>Location</span>
                  <strong>{complaint.location}</strong>
                </div>
              </div>
              <div className="col-md-4">
                <div className="detail-box">
                  <span>City</span>
                  <strong>{complaint.city}</strong>
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
                  <span>Submitted</span>
                  <strong>{new Date(complaint.createdAt).toLocaleString()}</strong>
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

            <div className="row g-3">
              <div className="col-md-6">
                <div className="remark-box">
                  <span>Admin Remark</span>
                  <p>{complaint.adminRemark || "No admin remark yet."}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="remark-box">
                  <span>Officer Remark</span>
                  <p>{complaint.officerRemark || "No officer remark yet."}</p>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <h2 className="h5 fw-semibold mb-3">Complaint Timeline</h2>
              <div className="timeline-list">
                {(complaint.timeline || []).map((item) => (
                  <div className="timeline-item" key={item._id || `${item.status}-${item.date}`}>
                    <div className="timeline-icon">
                      {item.status === "Resolved" ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}
                    </div>
                    <div className="timeline-content">
                      <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                        <span className={`badge ${getStatusBadgeClass(item.status)}`}>{item.status}</span>
                        <strong>{item.message}</strong>
                      </div>
                      <p className="text-muted small mb-0">
                        {new Date(item.date).toLocaleString()}
                        {item.updatedBy?.name ? ` by ${item.updatedBy.name}` : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {complaint.status === "Resolved" && (
              <div className="feedback-panel mt-5">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <MessageSquareText size={22} />
                  <h2 className="h5 fw-semibold mb-0">Feedback</h2>
                </div>

                {hasFeedback ? (
                  <div className="submitted-feedback">
                    <div className="d-flex flex-wrap gap-1 mb-2">
                      {Array.from({ length: complaint.feedback.rating }).map((_, index) => (
                        <Star className="feedback-star" fill="currentColor" key={index} size={20} />
                      ))}
                    </div>
                    <p className="mb-1">{complaint.feedback.comment || "No comment added."}</p>
                    <p className="text-muted small mb-0">
                      Submitted on {new Date(complaint.feedback.submittedAt).toLocaleString()}
                    </p>
                  </div>
                ) : canSubmitFeedback ? (
                  <form onSubmit={handleFeedbackSubmit}>
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label className="form-label" htmlFor="rating">
                          Rating
                        </label>
                        <select
                          className="form-select"
                          id="rating"
                          name="rating"
                          value={feedbackForm.rating}
                          onChange={handleFeedbackChange}
                        >
                          <option value="5">5 - Excellent</option>
                          <option value="4">4 - Good</option>
                          <option value="3">3 - Average</option>
                          <option value="2">2 - Poor</option>
                          <option value="1">1 - Very Poor</option>
                        </select>
                      </div>
                      <div className="col-md-8">
                        <label className="form-label" htmlFor="comment">
                          Comment
                        </label>
                        <textarea
                          className="form-control"
                          id="comment"
                          name="comment"
                          rows="3"
                          value={feedbackForm.comment}
                          onChange={handleFeedbackChange}
                          maxLength="700"
                        />
                      </div>
                    </div>
                    <button className="btn btn-primary mt-3" type="submit" disabled={submittingFeedback}>
                      <Send size={16} className="me-2" />
                      {submittingFeedback ? "Submitting..." : "Submit Feedback"}
                    </button>
                  </form>
                ) : (
                  <p className="text-muted mb-0">Feedback can be submitted by the complaint owner.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ComplaintDetails;
