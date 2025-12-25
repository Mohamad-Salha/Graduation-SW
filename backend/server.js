require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("./Database/connection");
const initRoutes = require("./src/initRoutes");
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for frontend connection
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize all routes
initRoutes(app);

// Wait for database connection before starting server
mongoose.connection.once("open", () => {
	app.listen(port, () => {
		console.log(`Server is running at http://localhost:${port}`);
	});
});

// Handle connection errors
mongoose.connection.on("error", (err) => {
	console.error("MongoDB connection error:", err);
	process.exit(1);
});
