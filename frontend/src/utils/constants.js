// API Configuration
export const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// User Roles
export const ROLES = {
	STUDENT: "student",
	TEACHER: "teacher",
	TRAINER: "trainer",
	ADMIN: "admin",
};

// Student Status
export const STUDENT_STATUS = {
	PENDING: "pending",
	APPROVED: "approved",
	REJECTED: "rejected",
};

// Payment Status
export const PAYMENT_STATUS = {
	PENDING: "pending",
	COMPLETED: "completed",
	FAILED: "failed",
};

// Session Status
export const SESSION_STATUS = {
	SCHEDULED: "scheduled",
	COMPLETED: "completed",
	CANCELLED: "cancelled",
	MISSED: "missed",
};

// Exam Types
export const EXAM_TYPES = {
	THEORY: "theory",
	PRACTICAL: "practical",
};

// API Endpoints
export const ENDPOINTS = {
	AUTH: {
		LOGIN: "/api/auth/login",
		REGISTER: "/api/auth/register",
		LOGOUT: "/api/auth/logout",
	},
	STUDENT: {
		PROFILE: "/api/student/profile",
		LICENSES: "/api/student/licenses",
		ENROLL: "/api/student/enroll",
		TEACHERS: "/api/student/teachers",
		CHOOSE_TEACHER: "/api/student/choose-teacher",
		TRAINERS: "/api/student/trainers",
		CHOOSE_TRAINER: "/api/student/choose-trainer",
	},
	TEACHER: {
		PROFILE: "/api/teacher/profile",
		STUDENTS: "/api/teacher/students",
		MARK_READY: "/api/teacher/students/:id/ready",
	},
	TRAINER: {
		PROFILE: "/api/trainer/profile",
		STUDENTS: "/api/trainer/students",
	},
	ADMIN: {
		STUDENTS: "/api/admin/students",
		PENDING_STUDENTS: "/api/admin/students/pending",
		APPROVE_STUDENT: "/api/admin/students/:id/approve",
		REJECT_STUDENT: "/api/admin/students/:id/reject",
		READY_THEO: "/api/admin/students/ready-theo",
		THEO_PASS: "/api/admin/students/:id/theo-pass",
		TEACHERS: "/api/admin/teachers",
		TRAINERS: "/api/admin/trainers",
		VEHICLES: "/api/admin/vehicles",
	},
	UPLOAD: {
		PROFILE_PICTURE: "/api/upload/profile-picture",
		VEHICLE_IMAGE: "/api/upload/vehicle-image",
	},
};
