// Check if user has required role
const requireRole = (...allowedRoles) => {
	return (req, res, next) => {
		if (!req.user) {
			return res.status(401).json({
				success: false,
				error: "Authentication required",
				message: "You must be logged in to access this resource.",
			});
		}

		if (!allowedRoles.includes(req.user.role)) {
			return res.status(403).json({
				success: false,
				error: "Access denied",
				message: `This resource requires ${allowedRoles.join(
					" or "
				)} role. You are logged in as ${req.user.role}.`,
				requiredRole: allowedRoles,
				yourRole: req.user.role,
			});
		}

		next();
	};
};

module.exports = { requireRole };
