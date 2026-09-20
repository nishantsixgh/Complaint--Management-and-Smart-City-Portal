import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: ""
  });
  const [alert, setAlert] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setAlert(null);
    setSubmitting(true);

    try {
      await register(formData);
      setAlert({ type: "success", message: "Registration successful. Redirecting..." });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setAlert({
        type: "danger",
        message: error.response?.data?.message || "Registration failed. Please check your details."
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-section py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-sm-11 col-md-9 col-lg-7">
            <div className="auth-panel bg-white p-4 p-md-5">
              <h1 className="h3 fw-semibold mb-2">Create Account</h1>
              <p className="text-muted mb-4">Register to report and track city service complaints.</p>

              {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="name">
                      Full name
                    </label>
                    <input
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      minLength="2"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label" htmlFor="mobile">
                      Mobile
                    </label>
                    <input
                      className="form-control"
                      id="mobile"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      pattern="[6-9][0-9]{9}"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label" htmlFor="email">
                      Email address
                    </label>
                    <input
                      className="form-control"
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label" htmlFor="password">
                      Password
                    </label>
                    <input
                      className="form-control"
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      minLength="6"
                      required
                    />
                  </div>

                  <div className="col-12">
                    <div className="alert alert-info mb-0">
                      Public registration creates a citizen account. Officers and admins are created from the Admin Dashboard.
                    </div>
                  </div>
                </div>

                <button className="btn btn-primary w-100 mt-4" type="submit" disabled={submitting}>
                  {submitting ? "Creating account..." : "Register"}
                </button>
              </form>

              <p className="text-muted text-center mt-4 mb-0">
                Already registered? <Link to="/login">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
