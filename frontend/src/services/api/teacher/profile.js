import apiClient from "../client";
import { ENDPOINTS } from "@/utils/constants";

/**
 * Get teacher profile
 * @returns {Promise<object>}
 */
export const getTeacherProfile = async () => {
	return apiClient.get(ENDPOINTS.TEACHER.PROFILE);
};

/**
 * Update teacher profile
 * @param {object} profileData - {name, phone, address, dateOfBirth}
 * @returns {Promise<object>}
 */
export const updateTeacherProfile = async (profileData) => {
	return apiClient.put(ENDPOINTS.TEACHER.PROFILE, profileData);
};
