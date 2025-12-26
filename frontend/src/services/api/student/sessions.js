import apiClient from "../client";

/**
 * Get student's sessions
 * @returns {Promise<Array>}
 */
export const getStudentSessions = async () => {
	return apiClient.get("/student/sessions");
};

/**
 * Get upcoming sessions
 * @returns {Promise<Array>}
 */
export const getUpcomingSessions = async () => {
	return apiClient.get("/student/sessions/upcoming");
};

/**
 * Get completed sessions
 * @returns {Promise<Array>}
 */
export const getCompletedSessions = async () => {
	return apiClient.get("/student/sessions/completed");
};
