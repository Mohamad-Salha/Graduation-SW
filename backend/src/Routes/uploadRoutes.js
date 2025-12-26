const express = require("express");
const router = express.Router();
const upload = require("../Middleware/uploadMiddleware");
const uploadController = require("../Controllers/uploadController");

/**
 * All routes require authentication
 * Apply auth middleware in server.js or here
 */

// POST /api/upload/profile-picture - Upload profile picture
router.post("/profile-picture", upload.single("file"), (req, res) =>
	uploadController.uploadProfilePicture(req, res)
);

// POST /api/upload/vehicle-image - Upload vehicle image (admin/trainer only)
router.post("/vehicle-image", upload.single("file"), (req, res) =>
	uploadController.uploadVehicleImage(req, res)
);

module.exports = router;
