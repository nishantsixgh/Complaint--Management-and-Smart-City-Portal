import { useEffect, useMemo, useState } from "react";
import api from "../api/axiosInstance.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import PriorityBadge from "../components/PriorityBadge.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

const initialFilters = {
  status: "",
  category: "",
  priority: "",
  city: "",
  date: ""
};

const statuses = ["Pending", "Assigned", "In Progress", "Resolved", "Rejected"];
const priorities = ["Low", "Medium", "High"];

const ManageComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  const officerOptions = useMemo(() => officers.filter((user) => user.role === "officer" && !user.isBlocked), [officers]);

  const loadComplaints = async (activeFilters = filters) => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/complaints", { params: activeFilters });
      setComplaints(data.complaints);
    } catch (error) {
      setAlert({
        type: "danger",
        message: error.response?.data?.message || "Unable to load complaints."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [complaintResponse, userResponse] = await Promise.all([
          api.get("/admin/complaints"),
          api.get("/admin/users")
        ]);
        setComplaints(complaintResponse.data.complaints);
        setOfficers(userResponse.data.users);
      } catch (error) {
        setAlert({
          type: "danger",
          message: error.response?.data?.message || "Unable to load admin complaint data."
        });
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleFilterChange = (event) => {
    setFilters((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    loadComplaints(filters);
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    loadComplaints(initialFilters);
  };

  const updateStatus = async (complaintId, status) => {
    try {
      const { data } = await api.put(`/admin/complaints/${complaintId}/status`, { status });
      setComplaints((current) =>
        current.map((complaint) => (complaint._id === complaintId ? { ...complaint, ...data.complaint } : complaint))
      );
      setAlert({ type: "success", message: data.message });
    } catch (error) {
      setAlert({
        type: "danger",
        message: error.response?.data?.message || "Unable to update status."
      });
    }
  };

  const assignOfficer = async (complaintId, officerId) => {
    if (!officerId) return;

    try {
      const { data } = await api.put(`/admin/complaints/${complaintId}/assign`, { officerId });
      setComplaints((current) =>
        current.map((complaint) => (complaint._id === complaintId ? data.complaint : complaint))
      );
      setAlert({ type: "success", message: data.message });
    } catch (error) {
      setAlert({
        type: "danger",
        message: error.response?.data?.message || "Unable to assign officer."
      });
    }
  };

  const deleteComplaint = async (complaintId) => {
    if (!window.confirm("Delete this complaint permanently?")) return;

    try {
      const { data } = await api.delete(`/admin/complaints/${complaintId}`);
      setComplaints((current) => current.filter((complaint) => complaint._id !== complaintId));
      setAlert({ type: "success", message: data.message });
    } catch (error) {
      setAlert({
        type: "danger",
        message: error.response?.data?.message || "Unable to delete complaint."
      });
    }
  };

  return (
    <section className="py-5">
      <div className="container-fluid px-3 px-md-4">
        <div className="admin-heading mb-4">
          <div>
            <h1 className="h3 fw-semibold mb-1">Manage Complaints</h1>
            <p className="text-muted mb-0">Filter, assign, update, and remove complaint records.</p>
          </div>
        </div>

        {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

        <form className="filter-panel bg-white p-3 p-md-4 mb-4" onSubmit={handleFilterSubmit}>
          <div className="row g-3">
            <div className="col-md-2">
              <label className="form-label">Status</label>
              <select className="form-select" name="status" value={filters.status} onChange={handleFilterChange}>
                <option value="">All</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Category</label>
              <input className="form-control" name="category" value={filters.category} onChange={handleFilterChange} />
            </div>
            <div className="col-md-2">
              <label className="form-label">Priority</label>
              <select className="form-select" name="priority" value={filters.priority} onChange={handleFilterChange}>
                <option value="">All</option>
                {priorities.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">City</label>
              <input className="form-control" name="city" value={filters.city} onChange={handleFilterChange} />
            </div>
            <div className="col-md-2">
              <label className="form-label">Date</label>
              <input className="form-control" name="date" type="date" value={filters.date} onChange={handleFilterChange} />
            </div>
            <div className="col-md-2 d-flex align-items-end gap-2">
              <button className="btn btn-primary w-100" type="submit">
                Filter
              </button>
              <button className="btn btn-outline-secondary" type="button" onClick={clearFilters}>
                Clear
              </button>
            </div>
          </div>
        </form>

        <div className="bg-white table-panel">
          {loading ? (
            <LoadingSpinner text="Loading complaints..." />
          ) : complaints.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-muted mb-0">No complaints match the selected filters.</p>
            </div>
          ) : (
            <div className="table-responsive admin-table-scroll">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Tracking ID</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>City</th>
                    <th>Officer</th>
                    <th>Update Status</th>
                    <th>Assign Officer</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint) => (
                    <tr key={complaint._id}>
                      <td className="fw-semibold">{complaint.trackingId}</td>
                      <td>{complaint.title}</td>
                      <td>{complaint.category}</td>
                      <td>
                        <StatusBadge status={complaint.status} />
                      </td>
                      <td>
                        <PriorityBadge priority={complaint.priority} />
                      </td>
                      <td>{complaint.city}</td>
                      <td>{complaint.assignedTo?.name || "Unassigned"}</td>
                      <td>
                        <select
                          className="form-select form-select-sm admin-select"
                          value={complaint.status}
                          onChange={(event) => updateStatus(complaint._id, event.target.value)}
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          className="form-select form-select-sm admin-select"
                          value={complaint.assignedTo?._id || ""}
                          onChange={(event) => assignOfficer(complaint._id, event.target.value)}
                        >
                          <option value="">Select officer</option>
                          {officerOptions.map((officer) => (
                            <option key={officer._id} value={officer._id}>
                              {officer.name} {officer.department ? `- ${officer.department}` : ""}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => deleteComplaint(complaint._id)}>
                          Delete
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

export default ManageComplaints;
