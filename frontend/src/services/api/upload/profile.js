import apiClient from "../client";
import { ENDPOINTS } from "@/utils/constants";

/**
 * Upload profile picture to Cloudinary
 * @param {File} file - Image file
 * @returns {Promise<{url: string}>}
 */
export const uploadProfilePicture = async (file) => {
	const formData = new FormData();
	formData.append("file", file);

	return apiClient.upload(ENDPOINTS.UPLOAD.PROFILE_PICTURE, formData);
};

export default uploadProfilePicture;
