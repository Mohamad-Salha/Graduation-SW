import apiClient from "../client";
import { ENDPOINTS } from "@/utils/constants";

/**
 * Get all students
 * @returns {Promise<Array>}
 */
export const getAllStudents = async () => {
	return apiClient.get(ENDPOINTS.ADMIN.STUDENTS);
};

/**
 * Get pending students
 * @returns {Promise<Array>}
 */
export const getPendingStudents = async () => {
	return apiClient.get(ENDPOINTS.ADMIN.PENDING_STUDENTS);
};

/**
 * Approve student
 * @param {string} studentId
 * @returns {Promise<object>}
 */
export const approveStudent = async (studentId) => {
	const endpoint = ENDPOINTS.ADMIN.APPROVE_STUDENT.replace(":id", studentId);
	return apiClient.put(endpoint);
};

/**
 * Reject student
 * @param {string} studentId
 * @returns {Promise<object>}
 */
export const rejectStudent = async (studentId) => {
	const endpoint = ENDPOINTS.ADMIN.REJECT_STUDENT.replace(":id", studentId);
	return apiClient.put(endpoint);
};

/**
 * Get students ready for theoretical exam
 * @returns {Promise<Array>}
 */
export const getStudentsReadyForTheoExam = async () => {
	return apiClient.get(ENDPOINTS.ADMIN.READY_THEO);
};

/**
 * Mark student as passed theoretical exam
 * @param {string} studentId
 * @returns {Promise<object>}
 */
export const markStudentTheoPassed = async (studentId) => {
	const endpoint = ENDPOINTS.ADMIN.THEO_PASS.replace(":id", studentId);
	return apiClient.put(endpoint);
};
