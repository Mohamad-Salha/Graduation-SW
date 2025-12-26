import apiClient from "../client";

/**
 * Mark student attendance
 * @param {string} sessionId
 * @param {boolean} present
 * @returns {Promise<object>}
 */
export const markAttendance = async (sessionId, present) => {
	return apiClient.post("/trainer/attendance", { sessionId, present });
};

/**
 * Get attendance records
 * @returns {Promise<Array>}
 */
export const getAttendanceRecords = async () => {
	return apiClient.get("/trainer/attendance");
};

/**
 * Get today's attendance
 * @returns {Promise<Array>}
 */
export const getTodayAttendance = async () => {
	return apiClient.get("/trainer/attendance/today");
};
