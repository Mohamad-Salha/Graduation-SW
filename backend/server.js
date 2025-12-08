const express = require("express");
const cors = require("cors");
const initRoutes = require("./src/initRoutes");
const app = express();
const port = 3000;

// Middleware
app.use(cors()); // Enable CORS for frontend connection
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize all routes
initRoutes(app);

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
