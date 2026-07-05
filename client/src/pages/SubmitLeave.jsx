import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function SubmitLeave() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({
    employee_id: "",
    leave_type: "",
    start_date: "",
    end_date: "",
    reason: "",
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const res = await api.get("/employees");
    setEmployees(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/leave", form);
      alert("Leave request submitted");
      navigate("/leave");
    } catch (err) {
      console.error(err);
      alert("Error submitting leave");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Submit Leave Request</h1>

      <form onSubmit={handleSubmit}>
        {/* Employee Dropdown */}
        <select name="employee_id" onChange={handleChange} required>
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.full_name}
            </option>
          ))}
        </select>

        <br /><br />

        <input
          name="leave_type"
          placeholder="Leave Type"
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          type="date"
          name="start_date"
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          type="date"
          name="end_date"
          onChange={handleChange}
          required
        />

        <br /><br />

        <textarea
          name="reason"
          placeholder="Reason"
          onChange={handleChange}
          required
        />

        <br /><br />

        <button type="submit">Submit Leave</button>
      </form>
    </div>
  );
}

export default SubmitLeave;