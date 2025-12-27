import apiClient from "../client";

/**
 * Get teacher's schedules (theoretical weekly schedules)
 * @returns {Promise<object>}
 */
export const getTeacherSchedules = async () => {
	return apiClient.get("/teacher/schedules");
};

/**
 * Create a new theoretical schedule
 * @param {object} scheduleData - { courseId, weeklySlots, location }
 * @returns {Promise<object>}
 */
export const createSchedule = async (scheduleData) => {
	return apiClient.post("/teacher/schedules", scheduleData);
};

/**
 * Get today's schedule (lectures)
 * @returns {Promise<Array>}
 */
export const getTodaySchedule = async () => {
	return apiClient.get("/teacher/lectures/today");
};

/**
 * Get weekly schedule (lectures for the week)
 * @returns {Promise<Array>}
 */
export const getWeeklySchedule = async () => {
	const today = new Date();
	const startDate = new Date(today);
	startDate.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
	const endDate = new Date(startDate);
	endDate.setDate(startDate.getDate() + 6); // End of week (Saturday)

	const filters = {
		startDate: startDate.toISOString().split('T')[0],
		endDate: endDate.toISOString().split('T')[0],
	};

	const params = new URLSearchParams(filters);
	return apiClient.get(`/teacher/lectures?${params.toString()}`);
};
