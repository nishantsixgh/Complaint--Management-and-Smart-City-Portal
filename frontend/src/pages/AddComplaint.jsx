import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosInstance.js";

const initialForm = {
  title: "",
  category: "",
  location: "",
  city: "",
  address: "",
  description: "",
  priority: "Medium"
};

const AddComplaint = () => {
  const [formData, setFormData] = useState(initialForm);
  const [alert, setAlert] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setImageFile(null);
      setImagePreview("");
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setAlert({ type: "danger", message: "Only jpg, jpeg, png, and webp images are allowed." });
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAlert({ type: "danger", message: "Image size must be 5MB or less." });
      event.target.value = "";
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setAlert(null);
    setTrackingId("");
    setSubmitting(true);

    try {
      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value);
      });

      if (imageFile) {
        payload.append("image", imageFile);
      }

      const { data } = await api.post("/complaints", payload, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setTrackingId(data.complaint.trackingId);
      setFormData(initialForm);
      setImageFile(null);
      setImagePreview("");
      event.target.reset();
      setAlert({ type: "success", message: data.message });
    } catch (error) {
      setAlert({
        type: "danger",
        message: error.response?.data?.message || "Unable to submit complaint."
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div className="bg-white auth-panel p-4 p-md-5">
              <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
                <div>
                  <h1 className="h3 fw-semibold mb-1">Add Complaint</h1>
                  <p className="text-muted mb-0">Submit civic issues to the smart city response team.</p>
                </div>
                <Link className="btn btn-outline-primary align-self-start" to="/complaints/my">
                  My Complaints
                </Link>
              </div>

              {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

              {trackingId && (
                <div className="tracking-box mb-4">
                  <span>Tracking ID</span>
                  <strong>{trackingId}</strong>
                  <p className="mb-0 text-muted">Use this ID to track complaint status publicly.</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-8">
                    <label className="form-label" htmlFor="title">
                      Title
                    </label>
                    <input
                      className="form-control"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      minLength="5"
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label" htmlFor="priority">
                      Priority
                    </label>
                    <select
                      className="form-select"
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label" htmlFor="category">
                      Category
                    </label>
                    <select
                      className="form-select"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select category</option>
                      <option value="Roads">Roads</option>
                      <option value="Water Supply">Water Supply</option>
                      <option value="Electricity">Electricity</option>
                      <option value="Sanitation">Sanitation</option>
                      <option value="Drainage">Drainage</option>
                      <option value="Street Lights">Street Lights</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label" htmlFor="location">
                      Location
                    </label>
                    <input
                      className="form-control"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label" htmlFor="city">
                      City
                    </label>
                    <input
                      className="form-control"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label" htmlFor="address">
                      Address
                    </label>
                    <input
                      className="form-control"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label" htmlFor="description">
                      Description
                    </label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      rows="5"
                      value={formData.description}
                      onChange={handleChange}
                      minLength="10"
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label" htmlFor="image">
                      Proof Image
                    </label>
                    <input
                      className="form-control"
                      id="image"
                      name="image"
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                    />
                    <div className="form-text">Optional. Upload jpg, jpeg, png, or webp. Maximum size 5MB.</div>
                  </div>

                  {imagePreview && (
                    <div className="col-12">
                      <div className="image-preview-wrap">
                        <img src={imagePreview} alt="Complaint proof preview" />
                      </div>
                    </div>
                  )}
                </div>

                <button className="btn btn-primary mt-4" type="submit" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Complaint"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddComplaint;
