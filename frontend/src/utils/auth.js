// Authentication utility functions

// Store authentication token
export const setAuthToken = (token) => {
	localStorage.setItem("authToken", token);
};

// Get authentication token
export const getAuthToken = () => {
	return localStorage.getItem("authToken");
};

// Remove authentication token
export const removeAuthToken = () => {
	localStorage.removeItem("authToken");
};

// Store user data
export const setUserData = (user) => {
	localStorage.setItem("userData", JSON.stringify(user));
};

// Get user data
export const getUserData = () => {
	const data = localStorage.getItem("userData");
	return data ? JSON.parse(data) : null;
};

// Remove user data
export const removeUserData = () => {
	localStorage.removeItem("userData");
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
