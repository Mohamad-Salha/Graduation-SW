/**
 * Validate file upload (type, size)
 */
class Validators {
	/**
	 * Check if file is an image
	 * @param {Object} file - Multer file object
	 * @returns {Boolean}
	 */
	isValidImage(file) {
		const allowedTypes = [
			"image/jpeg",
			"image/jpg",
			"image/png",
			"image/webp",
		];
		return allowedTypes.includes(file.mimetype);
	}

	/**
	 * Check if file size is within limit
	 * @param {Object} file - Multer file object
	 * @param {Number} maxSizeMB - Max size in MB
	 * @returns {Boolean}
	 */
	isValidSize(file, maxSizeMB = 5) {
		const maxSizeBytes = maxSizeMB * 1024 * 1024;
		return file.size <= maxSizeBytes;
	}

	/**
	 * Validate image file
	 * @param {Object} file - Multer file object
	 * @throws {Error} - If validation fails
	 */
	validateImageFile(file) {
		if (!file) {
			throw new Error("No file uploaded");
		}

		if (!this.isValidImage(file)) {
			throw new Error(
				"Invalid file type. Only JPG, PNG, and WEBP are allowed"
			);
		}

		if (!this.isValidSize(file, 5)) {
			throw new Error("File size exceeds 5MB limit");
		}

		return true;
	}

	/**
	 * Validate email format
	 * @param {String} email
	 * @returns {Boolean}
	 */
	isValidEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	/**
	 * Validate phone format (basic)
	 * @param {String} phone
	 * @returns {Boolean}
	 */
	isValidPhone(phone) {
		const phoneRegex = /^\+?[\d\s-()]+$/;
		return phone && phone.length >= 10 && phoneRegex.test(phone);
	}
}

module.exports = new Validators();
