import apiClient from "../client";

/**
 * Get student's exam results
 * @returns {Promise<Array>}
 */
export const getExamResults = async () => {
	return apiClient.get("/student/exams");
};

/**
 * Get theory exam result
 * @returns {Promise<object>}
 */
export const getTheoryExamResult = async () => {
	return apiClient.get("/student/exams/theory");
};

/**
 * Get practical exam result
 * @returns {Promise<object>}
 */
export const getPracticalExamResult = async () => {
	return apiClient.get("/student/exams/practical");
};

/**
 * Book theory exam
 * @param {object} examData
 * @returns {Promise<object>}
 */
export const bookTheoryExam = async (examData) => {
	return apiClient.post("/student/exams/theory/book", examData);
};

/**
 * Book practical exam
 * @param {object} examData
 * @returns {Promise<object>}
 */
export const bookPracticalExam = async (examData) => {
	return apiClient.post("/student/exams/practical/book", examData);
};
