import { useEffect, useState } from "react";
import api from "../services/api";

function LeaveRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/leave");
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching leave requests:", err);
    }
  };

  const updateStatus = async (id, status) => {
  try {
    await api.patch(`/leave/${id}`, { status });

    // 🔥 FORCE refresh from backend after update
    const res = await api.get("/leave");
    setRequests(res.data);

  } catch (err) {
    console.error("Error updating status:", err);
  }
};

  return (
    <div style={{ padding: "20px" }}>
      <h1>Leave Requests</h1>

      <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Employee ID</th>
            <th>Type</th>
            <th>Start</th>
            <th>End</th>
            <th>Days</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {requests.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.employee_id}</td>
              <td>{r.leave_type}</td>
              <td>{r.start_date}</td>
              <td>{r.end_date}</td>
              <td>{r.leave_days}</td>
              <td>{r.reason}</td>
              <td>{r.status}</td>

              <td>
  {r.status === "Pending" ? (
    <>
      <button onClick={() => updateStatus(r.id, "Approved")}>
        Approve
      </button>

      <button
        onClick={() => updateStatus(r.id, "Rejected")}
        style={{ marginLeft: "10px" }}
      >
        Reject
      </button>
    </>
  ) : (
    <strong>{r.status}</strong>
  )}
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeaveRequests;