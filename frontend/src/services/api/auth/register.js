import apiClient from "../client";
import { ENDPOINTS } from "@/utils/constants";

/**
 * Register new user
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @param {string} phone
 * @returns {Promise<{token: string, user: object}>}
 */
export const register = async (name, email, password, phone) => {
	return apiClient.post(ENDPOINTS.AUTH.REGISTER, {
		name,
		email,
		password,
		phone,
	});
};

export default register;
