import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, LockKeyhole, Eye, EyeOff, ShieldCheck, ArrowRight, MapPin, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [alert, setAlert] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
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
        message: error.response?.data?.message || "Login failed. Please check your email and password."
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="login-page">
      <div className="container">
        <div className="login-shell">
          <div className="login-showcase">
            <div className="login-showcase-content">
              <span className="login-kicker"><ShieldCheck size={15} /> Secure citizen access</span>
              <h1>One portal for a better city.</h1>
              <p>
                Sign in to report civic issues, follow complaint progress, and stay connected
                with the services that matter to your neighbourhood.
              </p>

              <div className="login-benefits">
                <div><CheckCircle2 size={18} /><span>Submit and manage complaints</span></div>
                <div><CheckCircle2 size={18} /><span>Track updates in one place</span></div>
                <div><CheckCircle2 size={18} /><span>Protected role-based access</span></div>
              </div>

              <div className="login-location">
                <MapPin size={17} />
                <span>Smart City Citizen Portal</span>
              </div>
            </div>
            <div className="login-orbit login-orbit-one" />
            <div className="login-orbit login-orbit-two" />
          </div>

          <div className="login-form-card">
            <div className="login-form-heading">
              <span className="login-form-label">Welcome back</span>
              <h2>Sign in to continue</h2>
              <p>Use your registered email and password to access your account.</p>
            </div>

            {alert && (
              <div className={`login-alert alert alert-${alert.type}`} role="alert">
                {alert.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-field">
                <label className="form-label" htmlFor="login-email">Email address</label>
                <div className="login-input-wrap">
                  <Mail size={18} aria-hidden="true" />
                  <input
                    className="form-control"
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="login-field">
                <label className="form-label" htmlFor="login-password">Password</label>
                <div className="login-input-wrap">
                  <LockKeyhole size={18} aria-hidden="true" />
                  <input
                    className="form-control"
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="login-password-toggle"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="login-form-meta">
                <span><ShieldCheck size={15} /> Secure sign-in</span>
                <span>Citizen account</span>
              </div>

              <button className="btn btn-primary login-submit" type="submit" disabled={submitting}>
                <span>{submitting ? "Signing you in..." : "Sign in"}</span>
                {!submitting && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="login-divider"><span>New to the portal?</span></div>

            <Link to="/register" className="login-register-link">
              Create a citizen account <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
