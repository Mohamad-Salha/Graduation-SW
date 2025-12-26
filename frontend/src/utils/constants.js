// API Configuration
export const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

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
		LOGIN: "/auth/login",
		REGISTER: "/auth/register",
		LOGOUT: "/auth/logout",
	},
	STUDENT: {
		PROFILE: "/student/profile",
		LICENSES: "/student/licenses",
		ENROLL: "/student/enroll",
		TEACHERS: "/student/teachers",
		CHOOSE_TEACHER: "/student/choose-teacher",
		TRAINERS: "/student/trainers",
		CHOOSE_TRAINER: "/student/choose-trainer",
	},
	TEACHER: {
		PROFILE: "/teacher/profile",
		STUDENTS: "/teacher/students",
		MARK_READY: "/teacher/students/:id/ready",
	},
	TRAINER: {
		PROFILE: "/trainer/profile",
		STUDENTS: "/trainer/students",
	},
	ADMIN: {
		STUDENTS: "/admin/students",
		PENDING_STUDENTS: "/admin/students/pending",
		APPROVE_STUDENT: "/admin/students/:id/approve",
		REJECT_STUDENT: "/admin/students/:id/reject",
		READY_THEO: "/admin/students/ready-theo",
		THEO_PASS: "/admin/students/:id/theo-pass",
		TEACHERS: "/admin/teachers",
		TRAINERS: "/admin/trainers",
		VEHICLES: "/admin/vehicles",
	},
	UPLOAD: {
		PROFILE_PICTURE: "/upload/profile-picture",
		VEHICLE_IMAGE: "/upload/vehicle-image",
	},
};
