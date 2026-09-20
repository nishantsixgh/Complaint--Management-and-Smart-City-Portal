import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const Profile = () => {
  const { user, refreshProfile } = useAuth();
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        await refreshProfile();
      } catch (error) {
        setAlert({
          type: "danger",
          message: error.response?.data?.message || "Unable to refresh profile."
        });
      }
    };

    loadProfile();
  }, [refreshProfile]);

  return (
    <section className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="bg-white profile-panel p-4 p-md-5">
              <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
                <div>
                  <h1 className="h3 fw-semibold mb-1">My Profile</h1>
                  <p className="text-muted mb-0">Account details connected to your portal access.</p>
                </div>
                <span className="role-badge align-self-start">{user?.role}</span>
              </div>

              {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

              <div className="row g-3">
                <div className="col-md-6">
                  <div className="detail-box">
                    <span>Name</span>
                    <strong>{user?.name}</strong>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="detail-box">
                    <span>Email</span>
                    <strong>{user?.email}</strong>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="detail-box">
                    <span>Mobile</span>
                    <strong>{user?.mobile}</strong>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="detail-box">
                    <span>Department</span>
                    <strong>{user?.department || "Not assigned"}</strong>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="detail-box">
                    <span>Status</span>
                    <strong>{user?.isBlocked ? "Blocked" : "Active"}</strong>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="detail-box">
                    <span>Joined</span>
                    <strong>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "New account"}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
