import apiClient from "../client";

/**
 * Get trainer's vehicle information
 * @returns {Promise<object>}
 */
export const getVehicleInfo = async () => {
	return apiClient.get("/trainer/vehicle");
};

/**
 * Update vehicle information
 * @param {object} vehicleData
 * @returns {Promise<object>}
 */
export const updateVehicleInfo = async (vehicleData) => {
	return apiClient.put("/trainer/vehicle", vehicleData);
};
