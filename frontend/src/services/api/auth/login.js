import apiClient from "../client";
import { ENDPOINTS } from "@/utils/constants";

/**
 * Login user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{token: string, user: object}>}
 */
export const login = async (email, password) => {
	return apiClient.post(ENDPOINTS.AUTH.LOGIN, { email, password });
};

export default login;
