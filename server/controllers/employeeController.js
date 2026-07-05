const supabase = require("../config/supabase");

// Add Employee
const addEmployee = async (req, res) => {
  const {
    employee_code,
    full_name,
    email,
    department,
    joining_date,
    leave_balance,
  } = req.body;

  // Basic Validation
  if (
    !employee_code ||
    !full_name ||
    !email ||
    !department ||
    !joining_date
  ) {
    return res.status(400).json({
      message: "All required fields must be filled.",
    });
  }

  // Check duplicate email
  const { data: existingEmployee } = await supabase
    .from("employees")
    .select("*")
    .eq("email", email)
    .single();

  if (existingEmployee) {
    return res.status(400).json({
      message: "Employee email already exists.",
    });
  }

  const { data, error } = await supabase
    .from("employees")
    .insert([
      {
        employee_code,
        full_name,
        email,
        department,
        joining_date,
        leave_balance,
      },
    ])
    .select();

  if (error) {
    return res.status(500).json({
      message: error.message,
    });
  }

  res.status(201).json(data);
};

// Get Employees
const getEmployees = async (req, res) => {
  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .order("full_name");

  if (error) {
    return res.status(500).json({
      message: error.message,
    });
  }

  res.json(data);
};

module.exports = {
  addEmployee,
  getEmployees,
};