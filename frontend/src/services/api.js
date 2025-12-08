// API configuration and base URL
const API_BASE_URL = "http://localhost:3000/api";

// Helper function to handle API responses
const handleResponse = async (response) => {
	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.error || "Something went wrong");
	}

	return data;
};

// API service object
const api = {
	// Authentication endpoints
	auth: {
		login: async (email, password) => {
			const response = await fetch(`${API_BASE_URL}/auth/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			return handleResponse(response);
		},

		signup: async (name, email, password, phone) => {
			const response = await fetch(`${API_BASE_URL}/auth/signup`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name, email, password, phone }),
			});

			return handleResponse(response);
		},
	},

	// Admin endpoints
	admin: {
		// Get pending students
		getPendingStudents: async (token) => {
			const response = await fetch(
				`${API_BASE_URL}/admin/students/pending`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			return handleResponse(response);
		},

		// Get all students
		getAllStudents: async (token) => {
			const response = await fetch(`${API_BASE_URL}/admin/students`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			return handleResponse(response);
		},

		// Approve student
		approveStudent: async (token, studentId) => {
			const response = await fetch(
				`${API_BASE_URL}/admin/students/${studentId}/approve`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			return handleResponse(response);
		},

		// Reject student
		rejectStudent: async (token, studentId) => {
			const response = await fetch(
				`${API_BASE_URL}/admin/students/${studentId}/reject`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			return handleResponse(response);
		},

		// Get students ready for theoretical exam
		getStudentsReadyForTheoExam: async (token) => {
			const response = await fetch(
				`${API_BASE_URL}/admin/students/ready-theo`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			return handleResponse(response);
		},

		// Mark student as passed theoretical exam
		markStudentTheoPassed: async (token, studentId) => {
			const response = await fetch(
				`${API_BASE_URL}/admin/students/${studentId}/theo-pass`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			return handleResponse(response);
		},

		// Get all vehicles
		getAllVehicles: async (token) => {
			const response = await fetch(`${API_BASE_URL}/admin/vehicles`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			return handleResponse(response);
		},

		// Get all trainers
		getAllTrainers: async (token) => {
			const response = await fetch(`${API_BASE_URL}/admin/trainers`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			return handleResponse(response);
		},
	},

	// Student endpoints
	student: {
		// Get student profile
		getProfile: async (token) => {
			const response = await fetch(`${API_BASE_URL}/student/profile`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			return handleResponse(response);
		},

		// Get available licenses/courses
		getLicenses: async (token) => {
			const response = await fetch(`${API_BASE_URL}/student/licenses`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			return handleResponse(response);
		},

		// Enroll in a course
		enrollInCourse: async (token, licenseId) => {
			const response = await fetch(`${API_BASE_URL}/student/enroll`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ licenseId }),
			});

			return handleResponse(response);
		},

		// Get available teachers
		getTeachers: async (token) => {
			const response = await fetch(`${API_BASE_URL}/student/teachers`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			return handleResponse(response);
		},

		// Choose teacher
		chooseTeacher: async (token, teacherId) => {
			const response = await fetch(
				`${API_BASE_URL}/student/choose-teacher`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ teacherId }),
				}
			);

			return handleResponse(response);
		},

		// Get available trainers
		getTrainers: async (token) => {
			const response = await fetch(`${API_BASE_URL}/student/trainers`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			return handleResponse(response);
		},

		// Choose trainer
		chooseTrainer: async (token, trainerId) => {
			const response = await fetch(
				`${API_BASE_URL}/student/choose-trainer`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ trainerId }),
				}
			);

			return handleResponse(response);
		},
	},

	// Teacher endpoints
	teacher: {
		// Get teacher profile
		getProfile: async (token) => {
			const response = await fetch(`${API_BASE_URL}/teacher/profile`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			return handleResponse(response);
		},

		// Get assigned students
		getAssignedStudents: async (token) => {
			const response = await fetch(`${API_BASE_URL}/teacher/students`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			return handleResponse(response);
		},

		// Mark student ready for theoretical exam
		markStudentReady: async (token, studentId) => {
			const response = await fetch(
				`${API_BASE_URL}/teacher/students/${studentId}/ready`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			return handleResponse(response);
		},
	},

	// Add more endpoints as needed (students, teachers, trainers, etc.)
};

export default api;
