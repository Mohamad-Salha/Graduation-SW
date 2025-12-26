const authRoutes = require("./Routes/authRoutes");
const adminRoutes = require("./Routes/adminRoutes");
const studentRoutes = require("./Routes/studentRoutes");
const teacherRoutes = require("./Routes/teacherRoutes");
const trainerRoutes = require("./Routes/trainerRoutes");
const paymentRoutes = require("./Routes/paymentRoutes");
const uploadRoutes = require("./Routes/uploadRoutes");
const { verifyToken } = require("./Middleware/authMiddleware");

function initRoutes(app) {
	// Authentication routes
	app.use("/api/auth", authRoutes);

	// Admin routes
	app.use("/api/admin", adminRoutes);

	// Student routes
	app.use("/api/student", studentRoutes);

	// Teacher routes
	app.use("/api/teacher", teacherRoutes);

	// Trainer routes
	app.use("/api/trainer", trainerRoutes);

	// Payment routes
	app.use("/api/student/payment", paymentRoutes);

	// Upload routes (requires authentication)
	app.use("/api/upload", verifyToken, uploadRoutes);

	// Health check
	app.get("/", (req, res) => {
		res.send("Driving School Management System API");
	});
}

module.exports = initRoutes;
