import { apiConfig } from "./config";
import { getAuthToken } from "@/utils/auth";

/**
 * API Client - Centralized fetch wrapper with authentication
 */
class APIClient {
	constructor(config) {
		this.baseURL = config.baseURL;
		this.headers = config.headers;
		this.timeout = config.timeout;
	}

	/**
	 * Build full URL
	 */
	buildURL(endpoint) {
		return `${this.baseURL}${endpoint}`;
	}

	/**
	 * Get headers with authentication token
	 */
	getHeaders(customHeaders = {}) {
		const token = getAuthToken();
		const headers = { ...this.headers, ...customHeaders };

		if (token) {
			headers.Authorization = `Bearer ${token}`;
		}

		return headers;
	}

	/**
	 * Handle API response
	 */
	async handleResponse(response) {
		const data = await response.json();

		if (!response.ok) {
			throw new Error(
				data.error || data.message || "Something went wrong"
			);
		}

		return data;
	}

	/**
	 * GET request
	 */
	async get(endpoint, options = {}) {
		const response = await fetch(this.buildURL(endpoint), {
			method: "GET",
			headers: this.getHeaders(options.headers),
			...options,
		});

		return this.handleResponse(response);
	}

	/**
	 * POST request
	 */
	async post(endpoint, body, options = {}) {
		const response = await fetch(this.buildURL(endpoint), {
			method: "POST",
			headers: this.getHeaders(options.headers),
			body: JSON.stringify(body),
			...options,
		});

		return this.handleResponse(response);
	}

	/**
	 * PUT request
	 */
	async put(endpoint, body, options = {}) {
		const response = await fetch(this.buildURL(endpoint), {
			method: "PUT",
			headers: this.getHeaders(options.headers),
			body: JSON.stringify(body),
			...options,
		});

		return this.handleResponse(response);
	}

	/**
	 * DELETE request
	 */
	async delete(endpoint, options = {}) {
		const response = await fetch(this.buildURL(endpoint), {
			method: "DELETE",
			headers: this.getHeaders(options.headers),
			...options,
		});

		return this.handleResponse(response);
	}

	/**
	 * Upload file (multipart/form-data)
	 */
	async upload(endpoint, formData, options = {}) {
		const token = getAuthToken();
		const headers = { ...options.headers };

		if (token) {
			headers.Authorization = `Bearer ${token}`;
		}

		// Don't set Content-Type for FormData (browser will set it with boundary)
		const response = await fetch(this.buildURL(endpoint), {
			method: "POST",
			headers,
			body: formData,
			...options,
		});

		return this.handleResponse(response);
	}
}

// Create and export singleton instance
const apiClient = new APIClient(apiConfig);
export default apiClient;
