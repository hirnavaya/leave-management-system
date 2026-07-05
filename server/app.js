require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.json());

// DEBUG
console.log("URL:", process.env.SUPABASE_URL);
console.log("KEY:", process.env.SUPABASE_ANON_KEY);

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

//
// ========================
// TEST ROUTE
// ========================
app.get("/", (req, res) => {
  res.send("API is working");
});

//
// ========================
// EMPLOYEES APIs
// ========================

// GET employees
app.get("/employees", async (req, res) => {
  const { data, error } = await supabase
    .from("employees")
    .select("*");

  if (error) {
    return res.status(500).json({
      message: error.message,
      fullError: error
    });
  }

  res.json(data);
});

// POST employees
app.post("/employees", async (req, res) => {
  const { data, error } = await supabase
    .from("employees")
    .insert([req.body])
    .select();

  if (error) {
    return res.status(500).json({
      message: error.message,
      fullError: error
    });
  }

  res.json(data);
});

//
// ========================
// LEAVE REQUEST API (NEW)
// ========================

app.post("/leave", async (req, res) => {
  try {
    const {
      employee_id,
      leave_type,
      start_date,
      end_date,
      reason
    } = req.body;

    // Validation
    if (!employee_id || !leave_type || !start_date || !end_date || !reason) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // Calculate leave days
    const start = new Date(start_date);
    const end = new Date(end_date);

    const diffTime = end - start;
    const leave_days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    if (leave_days <= 0) {
      return res.status(400).json({
        message: "End date must be after start date"
      });
    }

    // Insert leave request
    const { data, error } = await supabase
      .from("leave_requests")
      .insert([
        {
          employee_id,
          leave_type,
          start_date,
          end_date,
          leave_days,
          reason,
          status: "Pending"
        }
      ])
      .select();

    if (error) {
      return res.status(500).json({
        message: error.message,
        fullError: error
      });
    }

    res.status(201).json(data);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

//
// ========================
// GET ALL LEAVE REQUESTS
// ========================

app.get("/leave", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("leave_requests")
      .select(`
        id,
        leave_type,
        start_date,
        end_date,
        leave_days,
        reason,
        status,
        created_at,
        employee_id,
        employees (
          employee_code,
          full_name,
          email,
          department
        )
      `);

    if (error) {
      return res.status(500).json({
        message: error.message,
        fullError: error
      });
    }

    res.json(data);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

app.patch("/leave/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Only allow Approved or Rejected
    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be Approved or Rejected"
      });
    }

    // Get leave request
    const { data: leave, error: leaveError } = await supabase
      .from("leave_requests")
      .select("*")
      .eq("id", id)
      .single();

    if (leaveError || !leave) {
      return res.status(404).json({
        message: "Leave request not found"
      });
    }

    // Prevent approving/rejecting twice
    if (leave.status !== "Pending") {
      return res.status(400).json({
        message: "Leave request already processed"
      });
    }

    // If approved, deduct leave balance
    if (status === "Approved") {

      // Get employee
      const { data: employee, error: empError } = await supabase
        .from("employees")
        .select("*")
        .eq("id", leave.employee_id)
        .single();

      if (empError || !employee) {
        return res.status(404).json({
          message: "Employee not found"
        });
      }

      // Check balance
      if (employee.leave_balance < leave.leave_days) {
        return res.status(400).json({
          message: "Insufficient leave balance"
        });
      }

      // Update employee balance
      const { error: balanceError } = await supabase
        .from("employees")
        .update({
          leave_balance: employee.leave_balance - leave.leave_days
        })
        .eq("id", employee.id);

      if (balanceError) {
        return res.status(500).json({
          message: balanceError.message
        });
      }
    }

    // Update leave status
    const { data, error } = await supabase
      .from("leave_requests")
      .update({
        status
      })
      .eq("id", id)
      .select();

    if (error) {
      return res.status(500).json({
        message: error.message
      });
    }

    res.json(data);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

//
// ========================
// DASHBOARD API
// ========================

app.get("/dashboard", async (req, res) => {
  try {
    // Count employees
    const { count: totalEmployees, error: empError } = await supabase
      .from("employees")
      .select("*", { count: "exact", head: true });

    // Count pending requests
    const { count: pendingRequests, error: pendingError } = await supabase
      .from("leave_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "Pending");

    // Count approved requests
    const { count: approvedRequests, error: approvedError } = await supabase
      .from("leave_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "Approved");

    // Count rejected requests
    const { count: rejectedRequests, error: rejectedError } = await supabase
      .from("leave_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "Rejected");

    if (empError || pendingError || approvedError || rejectedError) {
      return res.status(500).json({
        message: "Failed to fetch dashboard data"
      });
    }

    res.json({
      totalEmployees,
      pendingRequests,
      approvedRequests,
      rejectedRequests
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

app.patch("/leave/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // 🚨 prevent re-updating final state
  const { data: existing } = await supabase
    .from("leave_requests")
    .select("status")
    .eq("id", id)
    .single();

  if (existing.status !== "Pending") {
    return res.status(400).json({
      message: "Request already processed",
    });
  }

  const { data, error } = await supabase
    .from("leave_requests")
    .update({ status })
    .eq("id", id)
    .select();

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  res.json(data);
});

module.exports = app;