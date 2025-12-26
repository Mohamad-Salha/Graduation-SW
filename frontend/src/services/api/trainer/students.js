import apiClient from "../client";
import { ENDPOINTS } from "@/utils/constants";

/**
 * Get trainer's assigned students
 * @returns {Promise<Array>}
 */
export const getAssignedStudents = async () => {
	return apiClient.get(ENDPOINTS.TRAINER.STUDENTS);
};

/**
 * Get student details
 * @param {string} studentId
 * @returns {Promise<object>}
 */
export const getStudentDetails = async (studentId) => {
	return apiClient.get(`/trainer/students/${studentId}`);
};

/**
 * Get recent students
 * @returns {Promise<Array>}
 */
export const getRecentStudents = async () => {
	return apiClient.get("/trainer/students/recent");
};
