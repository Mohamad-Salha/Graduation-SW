import apiClient from "../client";
import { ENDPOINTS } from "@/utils/constants";

/**
 * Get student profile
 * @returns {Promise<object>}
 */
export const getStudentProfile = async () => {
	return apiClient.get(ENDPOINTS.STUDENT.PROFILE);
};

/**
 * Update student profile
 * @param {object} profileData - {name, phone, address, dateOfBirth}
 * @returns {Promise<object>}
 */
export const updateStudentProfile = async (profileData) => {
	return apiClient.put(ENDPOINTS.STUDENT.PROFILE, profileData);
};
