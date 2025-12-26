const cloudinary = require("cloudinary").v2;

// Configure Cloudinary with credentials from .env
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

class CloudinaryService {
	/**
	 * Upload profile picture to Cloudinary
	 * @param {String} filePath - Local file path
	 * @param {String} userId - User ID for unique naming
	 * @returns {String} - Cloudinary secure URL
	 */
	async uploadProfilePicture(filePath, userId) {
		try {
			const result = await cloudinary.uploader.upload(filePath, {
				folder: "driving-school/profiles",
				public_id: `user_${userId}`,
				overwrite: true,
				transformation: [
					{ width: 400, height: 400, crop: "fill", gravity: "face" },
					{ quality: "auto" },
					{ fetch_format: "auto" },
				],
			});
			return result.secure_url;
		} catch (error) {
			throw new Error(`Cloudinary upload failed: ${error.message}`);
		}
	}

	/**
	 * Upload vehicle image to Cloudinary
	 * @param {String} filePath - Local file path
	 * @param {String} vehicleId - Vehicle ID for unique naming
	 * @returns {String} - Cloudinary secure URL
	 */
	async uploadVehicleImage(filePath, vehicleId) {
		try {
			const result = await cloudinary.uploader.upload(filePath, {
				folder: "driving-school/vehicles",
				public_id: `vehicle_${vehicleId}`,
				overwrite: true,
				transformation: [
					{ width: 800, height: 600, crop: "fill" },
					{ quality: "auto" },
					{ fetch_format: "auto" },
				],
			});
			return result.secure_url;
		} catch (error) {
			throw new Error(`Cloudinary upload failed: ${error.message}`);
		}
	}

	/**
	 * Delete image from Cloudinary
	 * @param {String} publicId - Cloudinary public ID
	 */
	async deleteImage(publicId) {
		try {
			await cloudinary.uploader.destroy(publicId);
		} catch (error) {
			throw new Error(`Cloudinary delete failed: ${error.message}`);
		}
	}
}

module.exports = new CloudinaryService();
