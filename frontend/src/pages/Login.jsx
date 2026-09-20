import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [alert, setAlert] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setAlert(null);
    setSubmitting(true);

    try {
      await login(formData);
      setAlert({
        type: "success",
        message: "Login successful. Redirecting...",
      });
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setAlert({
        type: "danger",
        message:
          error.response?.data?.message ||
          "Login failed. Please check your email and password.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-premium">
      <div className="login-new-shell">
        <section className="login-new-intro">
          <div className="login-intro-inner">
            <span className="login-new-eyebrow">
              <ShieldCheck size={15} /> SECURE CITIZEN ACCESS
            </span>

            <h1>
              Welcome to a
              <br />
              <em>smarter city.</em>
            </h1>

            <p>
              One secure place to report issues, follow progress and stay
              connected with the services around you.
            </p>

            <div className="login-new-points">
              <span>
                <CheckCircle2 /> Submit &amp; manage complaints
              </span>
              <span>
                <CheckCircle2 /> Track every update
              </span>
              <span>
                <CheckCircle2 /> Role-based secure access
              </span>
            </div>
          </div>

          <div className="login-new-badge">
            <span>SMART CITY</span>
            <strong>
              One account.
              <br />
              A connected civic experience.
            </strong>
          </div>
        </section>

        <section className="login-new-form">
          <div className="login-form-top">
            <span>WELCOME BACK</span>
            <h2>Sign in</h2>
            <p>Enter your registered details to continue.</p>
          </div>

          {alert && (
            <div
              className={`login-new-alert alert alert-${alert.type}`}
              role="alert"
            >
              {alert.message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label>
              Email address
              <div className="login-new-input">
                <Mail size={18} />
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </label>

            <label>
              Password
              <div className="login-new-input">
                <LockKeyhole size={18} />
                <input
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
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <div className="login-new-meta">
              <span>
                <ShieldCheck size={15} /> Secure sign-in
              </span>
              <span>Citizen account</span>
            </div>

            <button
              className="login-new-submit"
              disabled={submitting}
              type="submit"
            >
              {submitting ? "Signing you in..." : "Sign in"}
              {!submitting && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="login-new-divider">
            <span>New to the portal?</span>
          </div>

          <Link className="login-new-register" to="/register">
            Create a citizen account <ArrowRight size={17} />
          </Link>
        </section>
      </div>
    </main>
  );
}
