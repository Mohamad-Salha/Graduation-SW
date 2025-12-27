import apiClient from "../client";

/**
 * Create a new lecture
 * @param {object} lectureData - { scheduleId, date, topic, description }
 * @returns {Promise<object>}
 */
export const createLecture = async (lectureData) => {
	return apiClient.post("/teacher/lectures", lectureData);
};

/**
 * Get all lectures with optional filters
 * @param {object} filters - { startDate, endDate, courseId, status }
 * @returns {Promise<object>}
 */
export const getLectures = async (filters = {}) => {
	const params = new URLSearchParams();
	if (filters.startDate) params.append("startDate", filters.startDate);
	if (filters.endDate) params.append("endDate", filters.endDate);
	if (filters.courseId) params.append("courseId", filters.courseId);
	if (filters.status) params.append("status", filters.status);

	const queryString = params.toString();
	return apiClient.get(`/teacher/lectures${queryString ? `?${queryString}` : ""}`);
};

/**
 * Get today's lectures
 * @returns {Promise<object>}
 */
export const getTodayLectures = async () => {
	return apiClient.get("/teacher/lectures/today");
};

/**
 * Get upcoming lectures
 * @returns {Promise<object>}
 */
export const getUpcomingLectures = async () => {
	return apiClient.get("/teacher/lectures/upcoming");
};

/**
 * Get lecture details
 * @param {string} lectureId
 * @returns {Promise<object>}
 */
export const getLectureDetails = async (lectureId) => {
	return apiClient.get(`/teacher/lectures/${lectureId}`);
};

/**
 * Mark attendance for a lecture
 * @param {string} lectureId
 * @param {Array} attendanceData - [{ studentId, status, checkInTime, notes }]
 * @returns {Promise<object>}
 */
export const markLectureAttendance = async (lectureId, attendanceData) => {
	return apiClient.put(`/teacher/lectures/${lectureId}/attendance`, {
		attendanceData,
	});
};

/**
 * Update lecture details
 * @param {string} lectureId
 * @param {object} updates - { topic, description, lectureNotes }
 * @returns {Promise<object>}
 */
export const updateLecture = async (lectureId, updates) => {
	return apiClient.put(`/teacher/lectures/${lectureId}`, updates);
};

/**
 * Cancel a lecture
 * @param {string} lectureId
 * @param {string} reason
 * @returns {Promise<object>}
 */
export const cancelLecture = async (lectureId, reason) => {
	return apiClient.put(`/teacher/lectures/${lectureId}/cancel`, { reason });
};
