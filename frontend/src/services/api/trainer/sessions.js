import apiClient from "../client";

/**
 * Get trainer's sessions
 * @returns {Promise<Array>}
 */
export const getTrainerSessions = async () => {
	return apiClient.get("/trainer/sessions");
};

/**
 * Get today's sessions
 * @returns {Promise<Array>}
 */
export const getTodaySessions = async () => {
	return apiClient.get("/trainer/sessions/today");
};

/**
 * Get upcoming sessions
 * @returns {Promise<Array>}
 */
export const getUpcomingSessions = async () => {
	return apiClient.get("/trainer/sessions/upcoming");
};

/**
 * Get completed sessions
 * @returns {Promise<Array>}
 */
export const getCompletedSessions = async () => {
	return apiClient.get("/trainer/sessions/completed");
};
