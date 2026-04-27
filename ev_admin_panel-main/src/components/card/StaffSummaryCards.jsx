import React from "react";

const StaffSummaryCards = ({ stats = {} }) => {
  const cards = [
    {
      title: "Administrators",
      value: stats.admins || "0",
      color: "#22c55e",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      )
    },
    {
      title: "Dealers",
      value: stats.dealers || "0",
      color: "#3b82f6",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      )
    },
  ];

  return (
    <>
      <style>
        {`
          .cards-container {
            width: 100%;
            display: flex;
            gap: 24px;
            margin-bottom: 24px;
          }

          .card-box {
            flex: 1;
            background-color: white;
            border-radius: 20px;
            padding: 32px;
            border: 1px solid #eee;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 120px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          }

          .card-info {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .card-title {
            font-size: 14px;
            color: #666;
            font-weight: 500;
          }

          .card-value {
            font-size: 36px;
            font-weight: 700;
            color: #111;
          }

          .card-icon-container {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}
      </style>

      <div className="cards-container">
        {cards.map((card, index) => (
          <div className="card-box" key={index}>
            <div className="card-info">
              <span className="card-title">{card.title}</span>
              <span className="card-value">{card.value}</span>
            </div>
            <div className="card-icon-container" style={{ background: `${card.color}15` }}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default StaffSummaryCards;

