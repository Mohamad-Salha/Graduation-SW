const Teacher = require("../../Database/models/Teacher");
const Student = require("../../Database/models/Student");
const TheoSchedule = require("../../Database/models/TheoSchedule");
const User = require("../../Database/models/User");

class TeacherRepository {
	// Get teacher by user ID
	async getTeacherByUserId(userId) {
		return await Teacher.findOne({ userId })
			.populate("userId", "name email phone")
			.populate({
				path: "assignedStudents",
				populate: [
					{ path: "userId", select: "name email phone" },
					{
						path: "chosenLicense",
						select: "name price minPracticalSessions",
					},
				],
			});
	}

	// Get teacher by ID
	async getTeacherById(teacherId) {
		return await Teacher.findById(teacherId).populate(
			"userId",
			"name email phone"
		);
	}

	// Get assigned students for a teacher
	async getAssignedStudents(teacherId) {
		const teacher = await Teacher.findById(teacherId).populate({
			path: "assignedStudents",
			populate: [
				{ path: "userId", select: "name email phone" },
				{
					path: "chosenLicense",
					select: "name price minPracticalSessions",
				},
			],
		});
		return teacher ? teacher.assignedStudents : [];
	}

	// Create theoretical schedule
	async createTheoSchedule(scheduleData) {
		const schedule = new TheoSchedule(scheduleData);
		return await schedule.save();
	}

	// Get all theoretical schedules for a teacher
	async getTeacherSchedules(teacherId) {
		return await TheoSchedule.find({ teacherId }).sort({ date: 1 });
	}

	// Update student - mark as ready for theoretical exam
	async markStudentReadyForTheoExam(studentId) {
		return await Student.findByIdAndUpdate(
			studentId,
			{ theoPassed: false, readyForTheoExam: true },
			{ new: true }
		);
	}

	// Get student by ID
	async getStudentById(studentId) {
		return await Student.findById(studentId)
			.populate("userId", "name email phone")
			.populate("chosenLicense", "name price minPracticalSessions");
	}
}

module.exports = new TeacherRepository();
