import { useEffect, useState } from "react";
import { AlertCircle, BarChart3, CheckCircle2, ClipboardList, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import api from "../api/axiosInstance.js";
import DashboardCard from "../components/DashboardCard.jsx";

const cards = [
  ["totalComplaints", "Total Complaints", "primary", ClipboardList],
  ["pending", "Pending", "warning", AlertCircle],
  ["assigned", "Assigned", "info", ClipboardList],
  ["inProgress", "In Progress", "primary", BarChart3],
  ["resolved", "Resolved", "success", CheckCircle2],
  ["rejected", "Rejected", "danger", AlertCircle],
  ["totalUsers", "Total Users", "secondary", UsersRound],
  ["totalOfficers", "Total Officers", "dark", UsersRound]
];

const chartColors = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#7c3aed", "#0891b2", "#ea580c"];

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [categoryData, setCategoryData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [statsResponse, categoryResponse, statusResponse, monthlyResponse] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/analytics/category"),
          api.get("/admin/analytics/status"),
          api.get("/admin/analytics/monthly")
        ]);
        setStats(statsResponse.data.stats);
        setCategoryData(categoryResponse.data.analytics);
        setStatusData(statusResponse.data.analytics);
        setMonthlyData(monthlyResponse.data.analytics);
      } catch (error) {
        setAlert({
          type: "danger",
          message: error.response?.data?.message || "Unable to load admin stats."
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <section className="py-5">
      <div className="container">
        <div className="admin-heading mb-4">
          <div>
            <h1 className="h3 fw-semibold mb-1">Admin Dashboard</h1>
            <p className="text-muted mb-0">Monitor complaints, officers, and citizen accounts.</p>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <Link className="btn btn-primary" to="/admin/complaints">
              Manage Complaints
            </Link>
            <Link className="btn btn-outline-primary" to="/admin/users">
              Manage Users
            </Link>
          </div>
        </div>

        {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

        {loading ? (
          <div className="text-center text-muted py-5">Loading dashboard...</div>
        ) : (
          <div className="row g-4">
            {cards.map(([key, label, color, Icon]) => (
              <div className="col-sm-6 col-lg-3" key={key}>
                <DashboardCard label={label} value={stats[key]} tone={color} icon={Icon} />
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <div className="row g-4 mt-1">
            <div className="col-lg-4">
              <div className="chart-panel bg-white p-4">
                <h2 className="h5 fw-semibold mb-3">Category Wise Complaints</h2>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="chart-panel bg-white p-4">
                <h2 className="h5 fw-semibold mb-3">Status Wise Complaints</h2>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={statusData} dataKey="count" nameKey="status" outerRadius={90} label>
                      {statusData.map((_entry, index) => (
                        <Cell fill={chartColors[index % chartColors.length]} key={index} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="chart-panel bg-white p-4">
                <h2 className="h5 fw-semibold mb-3">Monthly Complaints</h2>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#16a34a" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminDashboard;
