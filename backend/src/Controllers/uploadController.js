const cloudinaryService = require("../utils/cloudinary");
const validators = require("../utils/validators");
const authRepo = require("../Repositories/authRepos");
const fs = require("fs");

class UploadController {
	/**
	 * POST /api/upload/profile-picture
	 * Upload profile picture to Cloudinary and update user
	 */
	async uploadProfilePicture(req, res) {
		try {
			const userId = req.user.id; // From auth middleware
			const file = req.file;

			// Validate file
			validators.validateImageFile(file);

			// Upload to Cloudinary
			const imageUrl = await cloudinaryService.uploadProfilePicture(
				file.path,
				userId
			);

			// Update user profile picture in database
			await authRepo.updateUserProfilePicture(userId, imageUrl);

			// Delete local file after upload
			fs.unlinkSync(file.path);

			res.status(200).json({
				message: "Profile picture uploaded successfully",
				imageUrl: imageUrl,
			});
		} catch (error) {
			// Clean up file if exists
			if (req.file && fs.existsSync(req.file.path)) {
				fs.unlinkSync(req.file.path);
			}
			res.status(400).json({ error: error.message });
		}
	}

	/**
	 * POST /api/upload/vehicle-image
	 * Upload vehicle image to Cloudinary
	 */
	async uploadVehicleImage(req, res) {
		try {
			const { vehicleId } = req.body;
			const file = req.file;

			if (!vehicleId) {
				throw new Error("Vehicle ID is required");
			}

			// Validate file
			validators.validateImageFile(file);

			// Upload to Cloudinary
			const imageUrl = await cloudinaryService.uploadVehicleImage(
				file.path,
				vehicleId
			);

			// Delete local file after upload
			fs.unlinkSync(file.path);

			res.status(200).json({
				message: "Vehicle image uploaded successfully",
				imageUrl: imageUrl,
			});
		} catch (error) {
			// Clean up file if exists
			if (req.file && fs.existsSync(req.file.path)) {
				fs.unlinkSync(req.file.path);
			}
			res.status(400).json({ error: error.message });
		}
	}
}

module.exports = new UploadController();
