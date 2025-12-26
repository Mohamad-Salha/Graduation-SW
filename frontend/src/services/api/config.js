import { API_BASE_URL } from "@/utils/constants";

export const apiConfig = {
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 30000, // 30 seconds
};

export default apiConfig;
