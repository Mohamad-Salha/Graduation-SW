import { logout as clearAuth } from "@/utils/auth";

/**
 * Logout user (clear local storage)
 * @returns {Promise<void>}
 */
export const logout = async () => {
	clearAuth();
	// Optional: Call backend logout endpoint if needed
	// await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
};

export default logout;
