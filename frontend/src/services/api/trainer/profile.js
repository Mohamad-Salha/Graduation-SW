import apiClient from "../client";
import { ENDPOINTS } from "@/utils/constants";

/**
 * Get trainer profile
 * @returns {Promise<object>}
 */
export const getTrainerProfile = async () => {
	return apiClient.get(ENDPOINTS.TRAINER.PROFILE);
};

/**
 * Update trainer profile
 * @param {object} profileData - {name, phone, address, dateOfBirth}
 * @returns {Promise<object>}
 */
export const updateTrainerProfile = async (profileData) => {
	return apiClient.put(ENDPOINTS.TRAINER.PROFILE, profileData);
};
