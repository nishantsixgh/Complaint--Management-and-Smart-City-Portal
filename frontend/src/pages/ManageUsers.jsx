import { useEffect, useState } from "react";
import api from "../api/axiosInstance.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

const initialFormData = {
  name: "",
  email: "",
  mobile: "",
  password: "",
  role: "officer",
  department: ""
};

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const loadUsers = async () => {
    try {
      const { data } = await api.get("/admin/users");
      setUsers(data.users);
    } catch (error) {
      setAlert({
        type: "danger",
        message: error.response?.data?.message || "Unable to load users."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleBlock = async (userId) => {
    try {
      const { data } = await api.put(`/admin/users/${userId}/block`);
      setUsers((current) => current.map((user) => (user._id === userId ? data.user : user)));
      setAlert({ type: "success", message: data.message });
    } catch (error) {
      setAlert({
        type: "danger",
        message: error.response?.data?.message || "Unable to update user."
      });
    }
  };

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const createUser = async (event) => {
    event.preventDefault();
    setAlert(null);
    setCreating(true);

    try {
      const payload = {
        ...formData,
        department: formData.role === "officer" ? formData.department : ""
      };
      const { data } = await api.post("/admin/users", payload);
      setUsers((current) => [data.user, ...current]);
      setFormData(initialFormData);
      setAlert({ type: "success", message: data.message });
    } catch (error) {
      setAlert({
        type: "danger",
        message: error.response?.data?.message || "Unable to create user."
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <section className="py-5">
      <div className="container-fluid px-3 px-md-4">
        <div className="admin-heading mb-4">
          <div>
            <h1 className="h3 fw-semibold mb-1">Manage Users</h1>
            <p className="text-muted mb-0">Review citizens, officers, admins, and access status.</p>
          </div>
        </div>

        {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

        <form className="filter-panel bg-white p-3 p-md-4 mb-4" onSubmit={createUser}>
          <div className="d-flex flex-column flex-lg-row justify-content-between gap-2 mb-3">
            <div>
              <h2 className="h5 fw-semibold mb-1">Create Portal User</h2>
              <p className="text-muted mb-0">Add officers for assignments or create trusted admin accounts.</p>
            </div>
            <button className="btn btn-primary align-self-lg-start" type="submit" disabled={creating}>
              {creating ? "Creating..." : "Create User"}
            </button>
          </div>
          <div className="row g-3">
            <div className="col-md-6 col-xl-3">
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
            <div className="col-md-6 col-xl-3">
              <label className="form-label" htmlFor="email">
                Email
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
            <div className="col-md-6 col-xl-2">
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
            <div className="col-md-6 col-xl-2">
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
            <div className="col-md-6 col-xl-2">
              <label className="form-label" htmlFor="role">
                Role
              </label>
              <select className="form-select" id="role" name="role" value={formData.role} onChange={handleChange}>
                <option value="officer">Officer</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {formData.role === "officer" && (
              <div className="col-md-6 col-xl-3">
                <label className="form-label" htmlFor="department">
                  Department
                </label>
                <input
                  className="form-control"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Roads, Water, Sanitation"
                  required
                />
              </div>
            )}
          </div>
        </form>

        <div className="bg-white table-panel">
          {loading ? (
            <LoadingSpinner text="Loading users..." />
          ) : users.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-muted mb-0">No users found yet.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="fw-semibold">{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.mobile}</td>
                      <td className="text-capitalize">{user.role}</td>
                      <td>{user.department || "Not assigned"}</td>
                      <td>
                        <span className={`badge ${user.isBlocked ? "text-bg-danger" : "text-bg-success"}`}>
                          {user.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className={`btn btn-sm ${user.isBlocked ? "btn-outline-success" : "btn-outline-danger"}`}
                          type="button"
                          disabled={user.role === "admin"}
                          onClick={() => toggleBlock(user._id)}
                        >
                          {user.isBlocked ? "Unblock" : "Block"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ManageUsers;
