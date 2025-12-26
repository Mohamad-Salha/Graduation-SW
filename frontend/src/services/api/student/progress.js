import apiClient from "../client";

/**
 * Get student's progress
 * @returns {Promise<{theory: number, practical: number}>}
 */
export const getStudentProgress = async () => {
	return apiClient.get("/student/progress");
};

/**
 * Get theory progress
 * @returns {Promise<object>}
 */
export const getTheoryProgress = async () => {
	return apiClient.get("/student/progress/theory");
};

/**
 * Get practical progress
 * @returns {Promise<object>}
 */
export const getPracticalProgress = async () => {
	return apiClient.get("/student/progress/practical");
};
