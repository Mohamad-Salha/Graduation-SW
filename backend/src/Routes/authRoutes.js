const express = require("express");
const router = express.Router();
const authController = require("../Controllers/authController");

// POST /api/auth/signup - Student signup
router.post("/signup", (req, res) => authController.signup(req, res));

// POST /api/auth/login - Login for all roles
router.post("/login", (req, res) => authController.login(req, res));

module.exports = router;
