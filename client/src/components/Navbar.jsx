import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      style={{
        padding: "15px",
        background: "#1976d2",
        display: "flex",
        gap: "20px",
      }}
    >
      <Link style={{ color: "white", textDecoration: "none" }} to="/">
        Dashboard
      </Link>

      <Link style={{ color: "white", textDecoration: "none" }} to="/employees">
        Employees
      </Link>

      <Link
        style={{ color: "white", textDecoration: "none" }}
        to="/add-employee"
      >
        Add Employee
      </Link>

      <Link style={{ color: "white", textDecoration: "none" }} to="/leave">
        Leave Requests
      </Link>

      <Link
        style={{ color: "white", textDecoration: "none" }}
        to="/submit-leave"
      >
        Submit Leave
      </Link>
    </nav>
  );
}

export default Navbar;