import React from "react";

function StatsCard({ title, value, icon, iconColor }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ color: iconColor }}>
        {icon}
      </div>
      <div className="stat-info">
        <h3>{title}</h3>
        <p>{value}</p>
      </div>
    </div>
  );
}

export default StatsCard;
