import apiClient from "../client";
import { ENDPOINTS } from "@/utils/constants";

/**
 * Get available licenses/courses
 * @returns {Promise<Array>}
 */
export const getAvailableLicenses = async () => {
	return apiClient.get(ENDPOINTS.STUDENT.LICENSES);
};

/**
 * Enroll in a course
 * @param {string} licenseId
 * @returns {Promise<object>}
 */
export const enrollInCourse = async (licenseId) => {
	return apiClient.post(ENDPOINTS.STUDENT.ENROLL, { licenseId });
};

/**
 * Get available teachers
 * @returns {Promise<Array>}
 */
export const getAvailableTeachers = async () => {
	return apiClient.get(ENDPOINTS.STUDENT.TEACHERS);
};

/**
 * Choose a teacher
 * @param {string} teacherId
 * @returns {Promise<object>}
 */
export const chooseTeacher = async (teacherId) => {
	return apiClient.post(ENDPOINTS.STUDENT.CHOOSE_TEACHER, { teacherId });
};

/**
 * Get available trainers
 * @returns {Promise<Array>}
 */
export const getAvailableTrainers = async () => {
	return apiClient.get(ENDPOINTS.STUDENT.TRAINERS);
};

/**
 * Choose a trainer
 * @param {string} trainerId
 * @returns {Promise<object>}
 */
export const chooseTrainer = async (trainerId) => {
	return apiClient.post(ENDPOINTS.STUDENT.CHOOSE_TRAINER, { trainerId });
};
