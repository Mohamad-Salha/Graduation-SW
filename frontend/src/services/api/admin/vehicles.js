import apiClient from "../client";
import { ENDPOINTS } from "@/utils/constants";

/**
 * Get all vehicles
 * @returns {Promise<Array>}
 */
export const getAllVehicles = async () => {
	return apiClient.get(ENDPOINTS.ADMIN.VEHICLES);
};

/**
 * Add new vehicle
 * @param {object} vehicleData
 * @returns {Promise<object>}
 */
export const addVehicle = async (vehicleData) => {
	return apiClient.post(ENDPOINTS.ADMIN.VEHICLES, vehicleData);
};

/**
 * Update vehicle
 * @param {string} vehicleId
 * @param {object} vehicleData
 * @returns {Promise<object>}
 */
export const updateVehicle = async (vehicleId, vehicleData) => {
	return apiClient.put(
		`${ENDPOINTS.ADMIN.VEHICLES}/${vehicleId}`,
		vehicleData
	);
};

/**
 * Delete vehicle
 * @param {string} vehicleId
 * @returns {Promise<object>}
 */
export const deleteVehicle = async (vehicleId) => {
	return apiClient.delete(`${ENDPOINTS.ADMIN.VEHICLES}/${vehicleId}`);
};

/**
 * Assign vehicle to trainer
 * @param {string} vehicleId
 * @param {string} trainerId
 * @returns {Promise<object>}
 */
export const assignVehicleToTrainer = async (vehicleId, trainerId) => {
	return apiClient.put(`${ENDPOINTS.ADMIN.VEHICLES}/${vehicleId}/assign`, {
		trainerId
	});
};

/**
 * Add maintenance record
 * @param {string} vehicleId
 * @param {object} maintenanceData
 * @returns {Promise<object>}
 */
export const addMaintenanceRecord = async (vehicleId, maintenanceData) => {
	return apiClient.post(`${ENDPOINTS.ADMIN.VEHICLES}/${vehicleId}/maintenance`, maintenanceData);
};
