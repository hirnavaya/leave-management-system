import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function AddEmployee() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    employee_code: "",
    full_name: "",
    email: "",
    department: "",
    joining_date: "",
    leave_balance: 20,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/employees", form);
      alert("Employee added successfully");
      navigate("/employees");
    } catch (err) {
      console.error(err);
      alert("Error adding employee");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Add Employee</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="employee_code"
          placeholder="Employee Code"
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="full_name"
          placeholder="Full Name"
          onChange={handleChange}
        />
        <br /><br />

        <input name="email" placeholder="Email" onChange={handleChange} />
        <br /><br />

        <input
          name="department"
          placeholder="Department"
          onChange={handleChange}
        />
        <br /><br />

        <input
          type="date"
          name="joining_date"
          onChange={handleChange}
        />
        <br /><br />

        <button type="submit">Add Employee</button>
      </form>
    </div>
  );
}

export default AddEmployee;