import apiClient from "../client";

/**
 * Get teacher's schedule
 * @returns {Promise<Array>}
 */
export const getTeacherSchedule = async () => {
	return apiClient.get("/teacher/schedule");
};

/**
 * Get today's schedule
 * @returns {Promise<Array>}
 */
export const getTodaySchedule = async () => {
	return apiClient.get("/teacher/schedule/today");
};

/**
 * Get weekly schedule
 * @returns {Promise<Array>}
 */
export const getWeeklySchedule = async () => {
	return apiClient.get("/teacher/schedule/weekly");
};
