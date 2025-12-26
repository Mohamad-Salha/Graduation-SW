import apiClient from "../client";
import { ENDPOINTS } from "@/utils/constants";

/**
 * Get teacher's assigned students
 * @returns {Promise<Array>}
 */
export const getAssignedStudents = async () => {
	return apiClient.get(ENDPOINTS.TEACHER.STUDENTS);
};

/**
 * Mark student ready for theoretical exam
 * @param {string} studentId
 * @returns {Promise<object>}
 */
export const markStudentReady = async (studentId) => {
	const endpoint = ENDPOINTS.TEACHER.MARK_READY.replace(":id", studentId);
	return apiClient.put(endpoint);
};

/**
 * Get student details
 * @param {string} studentId
 * @returns {Promise<object>}
 */
export const getStudentDetails = async (studentId) => {
	return apiClient.get(`/teacher/students/${studentId}`);
};
