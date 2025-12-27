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

/**
 * Get student details
 * @param {string} studentId
 * @returns {Promise<object>}
 */
export const getStudentDetails = async (studentId) => {
	return apiClient.get(`/admin/students/${studentId}`);
};

/**
 * Assign teacher to student
 * @param {string} studentId
 * @param {string} teacherId
 * @returns {Promise<object>}
 */
export const assignTeacherToStudent = async (studentId, teacherId) => {
	return apiClient.put(`/admin/students/${studentId}/assign-teacher`, {
		teacherId
	});
};

/**
 * Assign trainer to student
 * @param {string} studentId
 * @param {string} trainerId
 * @returns {Promise<object>}
 */
export const assignTrainerToStudent = async (studentId, trainerId) => {
	return apiClient.put(`/admin/students/${studentId}/assign-trainer`, {
		trainerId
	});
};

/**
 * Update student
 * @param {string} studentId
 * @param {object} updateData
 * @returns {Promise<object>}
 */
export const updateStudent = async (studentId, updateData) => {
	return apiClient.put(`/admin/students/${studentId}`, updateData);
};

/**
 * Delete student
 * @param {string} studentId
 * @returns {Promise<object>}
 */
export const deleteStudent = async (studentId) => {
	return apiClient.delete(`/admin/students/${studentId}`);
};

/**
 * Get students ready for practical exam
 * @returns {Promise<Array>}
 */
export const getStudentsReadyForPracticalExam = async () => {
	return apiClient.get('/admin/students/ready-practical');
};
