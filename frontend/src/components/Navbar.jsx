import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-semibold" to="/">
          Smart City Portal
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="mainNavbar">
          <div className="navbar-nav ms-auto align-items-lg-center">
            <NavLink className="nav-link" to="/">
              Home
            </NavLink>
            <NavLink className="nav-link" to="/about">
              About
            </NavLink>
            <NavLink className="nav-link" to="/services">
              Services
            </NavLink>
            <NavLink className="nav-link" to="/track">
              Track
            </NavLink>
            <NavLink className="nav-link" to="/contact">
              Contact
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink className="nav-link" to="/dashboard">
                  Dashboard
                </NavLink>
                {user?.role === "admin" && (
                  <NavLink className="nav-link" to="/admin">
                    Admin
                  </NavLink>
                )}
                {user?.role === "officer" && (
                  <NavLink className="nav-link" to="/officer">
                    Officer
                  </NavLink>
                )}
                {user?.role !== "officer" && (
                  <>
                    <NavLink className="nav-link" to="/complaints/new">
                      Add Complaint
                    </NavLink>
                    <NavLink className="nav-link" to="/complaints/my">
                      My Complaints
                    </NavLink>
                  </>
                )}
                <NavLink className="nav-link" to="/profile">
                  Profile
                </NavLink>
                <span className="navbar-text small ms-lg-2">{user?.name}</span>
                <button className="btn btn-outline-light btn-sm ms-lg-3 mt-2 mt-lg-0" type="button" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink className="nav-link" to="/login">
                  Login
                </NavLink>
                <NavLink className="btn btn-primary btn-sm ms-lg-2 mt-2 mt-lg-0" to="/register">
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
