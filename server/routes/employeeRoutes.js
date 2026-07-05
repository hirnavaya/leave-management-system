const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");

router.post("/", employeeController.addEmployee);
router.get("/", employeeController.getEmployees);

module.exports = router;