import apiClient from "../client";
import { ENDPOINTS } from "@/utils/constants";

/**
 * Get all trainers
 * @returns {Promise<Array>}
 */
export const getAllTrainers = async () => {
	return apiClient.get(ENDPOINTS.ADMIN.TRAINERS);
};

/**
 * Add new trainer
 * @param {object} trainerData
 * @returns {Promise<object>}
 */
export const addTrainer = async (trainerData) => {
	return apiClient.post(ENDPOINTS.ADMIN.TRAINERS, trainerData);
};

/**
 * Update trainer
 * @param {string} trainerId
 * @param {object} trainerData
 * @returns {Promise<object>}
 */
export const updateTrainer = async (trainerId, trainerData) => {
	return apiClient.put(
		`${ENDPOINTS.ADMIN.TRAINERS}/${trainerId}`,
		trainerData
	);
};

/**
 * Delete trainer
 * @param {string} trainerId
 * @returns {Promise<object>}
 */
export const deleteTrainer = async (trainerId) => {
	return apiClient.delete(`${ENDPOINTS.ADMIN.TRAINERS}/${trainerId}`);
};
