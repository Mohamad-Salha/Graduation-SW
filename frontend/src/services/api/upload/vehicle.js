import apiClient from "../client";
import { ENDPOINTS } from "@/utils/constants";

/**
 * Upload vehicle image to Cloudinary
 * @param {File} file - Image file
 * @returns {Promise<{url: string}>}
 */
export const uploadVehicleImage = async (file) => {
	const formData = new FormData();
	formData.append("file", file);

	return apiClient.upload(ENDPOINTS.UPLOAD.VEHICLE_IMAGE, formData);
};

export default uploadVehicleImage;
