const DashboardCard = ({ label, value, tone = "primary", icon: Icon }) => {
  return (
    <div className="dashboard-card bg-white p-4">
      <div className="d-flex align-items-center justify-content-between gap-3">
        <span className={`dashboard-icon text-bg-${tone}`}>{Icon ? <Icon size={22} /> : null}</span>
        <span className={`stat-accent text-bg-${tone}`}>{label}</span>
      </div>
      <strong>{value ?? 0}</strong>
    </div>
  );
};

export default DashboardCard;
