import apiClient from "../client";

/**
 * Get student's theory schedule
 * @returns {Promise<Array>}
 */
export const getTheorySchedule = async () => {
	return apiClient.get("/student/theory-schedule");
};

/**
 * Get student's practical schedule
 * @returns {Promise<Array>}
 */
export const getPracticalSchedule = async () => {
	return apiClient.get("/student/practical-schedule");
};

/**
 * Get all schedules (theory + practical)
 * @returns {Promise<{theory: Array, practical: Array}>}
 */
export const getAllSchedules = async () => {
	const [theory, practical] = await Promise.all([
		getTheorySchedule(),
		getPracticalSchedule(),
	]);

	return { theory, practical };
};
