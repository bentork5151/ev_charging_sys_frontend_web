import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Revenue", "2020": 20, "2021": 15, "2022": 18 },
  { name: "Users", "2020": 40, "2021": 55, "2022": 42 },
  { name: "Sessions", "2020": 80, "2021": 45, "2022": 50 },
  { name: "Units", "2020": 95, "2021": 55, "2022": 40 },
];

export default function OverviewChart() {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Overview</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="2020"
            stroke="#8b5cf6"
            strokeWidth={2.5}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="2021"
            stroke="#f87171"
            strokeWidth={2.5}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="2022"
            stroke="#06b6d4"
            strokeWidth={2.5}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
