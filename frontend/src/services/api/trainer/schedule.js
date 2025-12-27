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

/**
 * Create weekly schedule with time slots
 * @param {Object} scheduleData - { slots: [{day, startTime, endTime}], repeatWeeks, vehicleId }
 * @returns {Promise<Object>}
 */
export const createWeeklySchedule = async (scheduleData) => {
	return apiClient.post("/trainer/schedule/create-weekly", scheduleData);
};

/**
 * Get trainer's assigned vehicles
 * @returns {Promise<Object>}
 */
export const getTrainerVehicles = async () => {
	return apiClient.get("/trainer/vehicles");
};
