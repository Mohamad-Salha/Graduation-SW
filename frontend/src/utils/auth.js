// Authentication utility functions

// Store authentication token
export const setAuthToken = (token) => {
	if (typeof window !== "undefined") {
		localStorage.setItem("authToken", token);
	}
};

// Get authentication token
export const getAuthToken = () => {
	if (typeof window !== "undefined") {
		return localStorage.getItem("authToken");
	}
	return null;
};

// Remove authentication token
export const removeAuthToken = () => {
	if (typeof window !== "undefined") {
		localStorage.removeItem("authToken");
	}
};

// Store user data
export const setUserData = (user) => {
	if (typeof window !== "undefined") {
		localStorage.setItem("userData", JSON.stringify(user));
	}
};

// Get user data
export const getUserData = () => {
	if (typeof window !== "undefined") {
		const data = localStorage.getItem("userData");
		return data ? JSON.parse(data) : null;
	}
	return null;
};

// Remove user data
export const removeUserData = () => {
	if (typeof window !== "undefined") {
		localStorage.removeItem("userData");
	}
};

// Check if user is authenticated
export const isAuthenticated = () => {
	return !!getAuthToken();
};

// Logout user
export const logout = () => {
	removeAuthToken();
	removeUserData();
};

// Get authorization header
export const getAuthHeader = () => {
	const token = getAuthToken();
	return token ? { Authorization: `Bearer ${token}` } : {};
};
