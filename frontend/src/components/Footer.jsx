import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row g-4 align-items-center">
          <div className="col-md-6">
            <h2 className="h5 fw-semibold mb-2">Smart City Portal</h2>
            <p className="mb-0 text-white-50">Complaint Management and Smart City Portal for civic services.</p>
          </div>
          <div className="col-md-6">
            <div className="footer-links justify-content-md-end">
              <Link to="/about">About</Link>
              <Link to="/services">Services</Link>
              <Link to="/track">Track</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
