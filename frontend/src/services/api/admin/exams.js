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

/**
 * Get exam attempts
 * @param {string} examId
 * @returns {Promise<Array>}
 */
export const getExamAttempts = async (examId) => {
	return apiClient.get(`/admin/exams/${examId}/attempts`);
};

/**
 * Record exam result
 * @param {string} attemptId
 * @param {string} status
 * @returns {Promise<object>}
 */
export const recordExamResult = async (attemptId, status) => {
	return apiClient.put(`/admin/exam-attempts/${attemptId}/result`, {
		status
	});
};

/**
 * Schedule theoretical exam
 * @param {object} examData
 * @returns {Promise<object>}
 */
export const scheduleTheoricalExam = async (examData) => {
	return apiClient.post('/admin/exams/theoretical', examData);
};

/**
 * Create a new exam
 * @param {object} examData
 * @returns {Promise<object>}
 */
export const createExam = async (examData) => {
	return apiClient.post("/admin/exams", examData);
};

/**
 * Update an exam
 * @param {string} examId
 * @param {object} examData
 * @returns {Promise<object>}
 */
export const updateExam = async (examId, examData) => {
	return apiClient.put(`/admin/exams/${examId}`, examData);
};

/**
 * Delete an exam
 * @param {string} examId
 * @returns {Promise<object>}
 */
export const deleteExam = async (examId) => {
	return apiClient.delete(`/admin/exams/${examId}`);
};

/**
 * Grade an exam attempt
 * @param {string} attemptId
 * @param {object} gradeData
 * @returns {Promise<object>}
 */
export const gradeExamAttempt = async (attemptId, gradeData) => {
	return apiClient.put(`/admin/exam-attempts/${attemptId}/grade`, gradeData);
};

/**
 * Get all exam attempts (without specific exam ID)
 * @returns {Promise<Array>}
 */
export const getAllExamAttempts = async () => {
	return apiClient.get("/admin/exam-attempts");
};
