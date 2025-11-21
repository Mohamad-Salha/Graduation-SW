const Student = require("../../Database/models/Student");
const License = require("../../Database/models/License");
const Teacher = require("../../Database/models/Teacher");
const User = require("../../Database/models/User");

class StudentRepository {
	// Get all available licenses
	async getAllLicenses() {
		return await License.find();
	}

	// Get license by ID
	async getLicenseById(licenseId) {
		return await License.findById(licenseId);
	}

	// Get student by user ID
	async getStudentByUserId(userId) {
		return await Student.findOne({ userId })
			.populate(
				"chosenLicense",
				"name description price minPracticalSessions"
			)
			.populate("theoTeacherId")
			.populate("trainerId");
	}

	// Get student by ID
	async getStudentById(studentId) {
		return await Student.findById(studentId)
			.populate(
				"chosenLicense",
				"name description price minPracticalSessions"
			)
			.populate("theoTeacherId")
			.populate("trainerId");
	}

	// Enroll student in a license
	async enrollInLicense(studentId, licenseId) {
		return await Student.findByIdAndUpdate(
			studentId,
			{
				chosenLicense: licenseId,
				status: "active",
				$push: {
					courses: {
						licenseId: licenseId,
						status: "active",
					},
				},
			},
			{ new: true }
		).populate(
			"chosenLicense",
			"name description price minPracticalSessions"
		);
	}

	// Choose theoretical teacher
	async chooseTeacher(studentId, teacherId) {
		return await Student.findByIdAndUpdate(
			studentId,
			{ theoTeacherId: teacherId },
			{ new: true }
		).populate("theoTeacherId");
	}

	// Get all teachers
	async getAllTeachers() {
		return await Teacher.find().populate("userId", "name email phone");
	}

	// Get teacher by ID
	async getTeacherById(teacherId) {
		return await Teacher.findById(teacherId).populate(
			"userId",
			"name email phone"
		);
	}

	// Add student to teacher's assigned students
	async addStudentToTeacher(teacherId, studentId) {
		return await Teacher.findByIdAndUpdate(
			teacherId,
			{ $addToSet: { assignedStudents: studentId } },
			{ new: true }
		);
	}
}

module.exports = new StudentRepository();
