import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [alert, setAlert] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/dashboard";

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
      await login(formData);
      setAlert({ type: "success", message: "Login successful. Redirecting..." });
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setAlert({
        type: "danger",
        message: error.response?.data?.message || "Login failed. Please try again."
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-section py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-sm-10 col-md-8 col-lg-5">
            <div className="auth-panel bg-white p-4 p-md-5">
              <h1 className="h3 fw-semibold mb-2">Login</h1>
              <p className="text-muted mb-4">Access your smart city complaint portal account.</p>

              {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
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

                <div className="mb-4">
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
                    required
                  />
                </div>

                <button className="btn btn-primary w-100" type="submit" disabled={submitting}>
                  {submitting ? "Logging in..." : "Login"}
                </button>
              </form>

              <p className="text-muted text-center mt-4 mb-0">
                New here? <Link to="/register">Create an account</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
