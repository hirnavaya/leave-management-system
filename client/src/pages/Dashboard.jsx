import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/dashboard");

      console.log("Dashboard response:", res.data); // IMPORTANT DEBUG

      setData(res.data);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Failed to load dashboard");
    }
  };

  if (error) return <h2>{error}</h2>;
  if (!data) return <h2>Loading Dashboard...</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <Card title="Total Employees" value={data.totalEmployees} />
        <Card title="Pending Requests" value={data.pendingRequests} />
        <Card title="Approved Requests" value={data.approvedRequests} />
        <Card title="Rejected Requests" value={data.rejectedRequests} />
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        width: "160px",
        textAlign: "center",
      }}
    >
      <h3>{title}</h3>
      <h2>{value}</h2>
    </div>
  );
}

export default Dashboard;