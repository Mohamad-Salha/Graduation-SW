import apiClient from "../client";
import { ENDPOINTS } from "@/utils/constants";

/**
 * Get all teachers
 * @returns {Promise<Array>}
 */
export const getAllTeachers = async () => {
	return apiClient.get(ENDPOINTS.ADMIN.TEACHERS);
};

/**
 * Add new teacher
 * @param {object} teacherData
 * @returns {Promise<object>}
 */
export const addTeacher = async (teacherData) => {
	return apiClient.post(ENDPOINTS.ADMIN.TEACHERS, teacherData);
};

/**
 * Update teacher
 * @param {string} teacherId
 * @param {object} teacherData
 * @returns {Promise<object>}
 */
export const updateTeacher = async (teacherId, teacherData) => {
	return apiClient.put(
		`${ENDPOINTS.ADMIN.TEACHERS}/${teacherId}`,
		teacherData
	);
};

/**
 * Delete teacher
 * @param {string} teacherId
 * @returns {Promise<object>}
 */
export const deleteTeacher = async (teacherId) => {
	return apiClient.delete(`${ENDPOINTS.ADMIN.TEACHERS}/${teacherId}`);
};
