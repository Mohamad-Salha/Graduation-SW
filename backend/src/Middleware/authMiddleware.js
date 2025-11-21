const jwt = require("jsonwebtoken");

const JWT_SECRET =
	process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Verify JWT token
const verifyToken = (req, res, next) => {
	try {
		// Get token from header
		const authHeader = req.headers.authorization;

		if (!authHeader) {
			return res.status(401).json({
				success: false,
				error: "Authentication required",
				message: "No authorization token provided. Please login first.",
			});
		}

		// Expected format: "Bearer TOKEN"
		const token = authHeader.startsWith("Bearer ")
			? authHeader.substring(7)
			: authHeader;

		// Verify token
		const decoded = jwt.verify(token, JWT_SECRET);

		// Attach user info to request
		req.user = {
			id: decoded.id,
			email: decoded.email,
			role: decoded.role,
		};

		next();
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			return res.status(401).json({
				success: false,
				error: "Token expired",
				message: "Your session has expired. Please login again.",
			});
		}
		if (error.name === "JsonWebTokenError") {
			return res.status(401).json({
				success: false,
				error: "Invalid token",
				message: "Authentication token is invalid. Please login again.",
			});
		}
		return res.status(401).json({
			success: false,
			error: "Authentication failed",
			message: "Could not verify your credentials. Please login again.",
		});
	}
};

module.exports = { verifyToken };
