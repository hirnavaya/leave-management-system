import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import AddEmployee from "./pages/AddEmployee";
import LeaveRequests from "./pages/LeaveRequests";
import SubmitLeave from "./pages/SubmitLeave";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/add-employee" element={<AddEmployee />} />
        <Route path="/leave" element={<LeaveRequests />} />
        <Route path="/submit-leave" element={<SubmitLeave />} />
      </Routes>
    </>
  );
}

export default App;