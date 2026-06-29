function StatsCards({ prs }) {
  return (
    <div className="stats">

      <div className="stat-card">
        <h3>Open PRs</h3>
        <p>{prs.length}</p>
      </div>

      <div className="stat-card">
        <h3>Reviewed</h3>
        <p>8</p>
      </div>

      <div className="stat-card">
        <h3>Threats Blocked</h3>
        <p>1</p>
      </div>

      <div className="stat-card">
        <h3>Status</h3>
        <p className="online">🟢 Online</p>
      </div>

    </div>
  );
}

export default StatsCards;