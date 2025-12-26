import apiClient from "../client";

/**
 * Get all exam schedules
 * @returns {Promise<Array>}
 */
export const getAllExams = async () => {
	return apiClient.get("/admin/exams");
};

/**
 * Schedule theory exam
 * @param {object} examData
 * @returns {Promise<object>}
 */
export const scheduleTheoryExam = async (examData) => {
	return apiClient.post("/admin/exams/theory", examData);
};

/**
 * Schedule practical exam
 * @param {object} examData
 * @returns {Promise<object>}
 */
export const schedulePracticalExam = async (examData) => {
	return apiClient.post("/admin/exams/practical", examData);
};

/**
 * Update exam result
 * @param {string} examId
 * @param {object} resultData
 * @returns {Promise<object>}
 */
export const updateExamResult = async (examId, resultData) => {
	return apiClient.put(`/admin/exams/${examId}/result`, resultData);
};
