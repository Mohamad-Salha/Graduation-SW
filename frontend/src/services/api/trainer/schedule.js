import apiClient from "../client";

/**
 * Get trainer's schedule
 * @returns {Promise<Array>}
 */
export const getTrainerSchedule = async () => {
	return apiClient.get("/trainer/schedule");
};

/**
 * Get today's schedule
 * @returns {Promise<Array>}
 */
export const getTodaySchedule = async () => {
	return apiClient.get("/trainer/schedule/today");
};

/**
 * Get weekly schedule
 * @returns {Promise<Array>}
 */
export const getWeeklySchedule = async () => {
	return apiClient.get("/trainer/schedule/weekly");
};
