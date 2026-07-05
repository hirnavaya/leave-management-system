import { useEffect, useState } from "react";
import api from "../services/api";

function Employees() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Employees</h1>

      <table
        border="1"
        cellPadding="10"
        style={{ marginTop: "20px", width: "100%" }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Employee Code</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Joining Date</th>
            <th>Leave Balance</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{emp.employee_code}</td>
              <td>{emp.full_name}</td>
              <td>{emp.email}</td>
              <td>{emp.department}</td>
              <td>{emp.joining_date}</td>
              <td>{emp.leave_balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Employees;