const Teacher = require("../../Database/models/Teacher");
const Student = require("../../Database/models/Student");
const TheoSchedule = require("../../Database/models/TheoSchedule");
const LectureAttendance = require("../../Database/models/LectureAttendance");
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

	// Get schedule by course (to prevent duplicates)
	async getScheduleByCourse(teacherId, courseId) {
		return await TheoSchedule.findOne({
			teacherId,
			courseId,
			isActive: true,
		});
	}

	// Get all theoretical schedules for a teacher
	async getTeacherSchedules(teacherId) {
		return await TheoSchedule.find({ teacherId, isActive: true }).populate(
			"courseId",
			"name description"
		);
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

	// ============ LECTURE MANAGEMENT ============

	// Create a lecture attendance record
	async createLecture(lectureData) {
		const lecture = new LectureAttendance(lectureData);
		return await lecture.save();
	}

	// Get all lectures for a teacher
	async getTeacherLectures(teacherId, filters = {}) {
		const query = { teacherId };

		if (filters.startDate && filters.endDate) {
			query.date = {
				$gte: new Date(filters.startDate),
				$lte: new Date(filters.endDate),
			};
		}

		if (filters.courseId) {
			query.courseId = filters.courseId;
		}

		if (filters.status) {
			query.status = filters.status;
		}

		return await LectureAttendance.find(query)
			.populate("courseId", "name")
			.populate({
				path: "attendees.studentId",
				populate: { path: "userId", select: "name email" },
			})
			.sort({ date: -1 });
	}

	// Get lecture by ID
	async getLectureById(lectureId) {
		return await LectureAttendance.findById(lectureId)
			.populate("courseId", "name")
			.populate("scheduleId")
			.populate({
				path: "attendees.studentId",
				populate: { path: "userId", select: "name email phone" },
			});
	}

	// Get today's lectures for teacher
	async getTodayLectures(teacherId) {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);

		return await LectureAttendance.find({
			teacherId,
			date: { $gte: today, $lt: tomorrow },
		})
			.populate("courseId", "name")
			.populate({
				path: "attendees.studentId",
				populate: { path: "userId", select: "name email" },
			})
			.sort({ date: 1 });
	}

	// Get upcoming lectures (next 7 days)
	async getUpcomingLectures(teacherId, days = 7) {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const futureDate = new Date(today);
		futureDate.setDate(futureDate.getDate() + days);

		return await LectureAttendance.find({
			teacherId,
			date: { $gte: today, $lt: futureDate },
			status: "scheduled",
		})
			.populate("courseId", "name")
			.sort({ date: 1 });
	}

	// Mark attendance for a lecture
	async markLectureAttendance(lectureId, attendanceData) {
		const lecture = await LectureAttendance.findById(lectureId);
		if (!lecture) {
			throw new Error("Lecture not found");
		}

		// Update or add attendees
		attendanceData.forEach((att) => {
			const existingIndex = lecture.attendees.findIndex(
				(a) => a.studentId.toString() === att.studentId
			);

			if (existingIndex >= 0) {
				lecture.attendees[existingIndex] = {
					...lecture.attendees[existingIndex].toObject(),
					...att,
				};
			} else {
				lecture.attendees.push(att);
			}
		});

		// Calculate statistics
		lecture.totalEnrolled = lecture.attendees.length;
		lecture.presentCount = lecture.attendees.filter(
			(a) => a.status === "present"
		).length;
		lecture.absentCount = lecture.attendees.filter(
			(a) => a.status === "absent"
		).length;
		lecture.lateCount = lecture.attendees.filter(
			(a) => a.status === "late"
		).length;
		lecture.excusedCount = lecture.attendees.filter(
			(a) => a.status === "excused"
		).length;
		lecture.attendanceRate =
			lecture.totalEnrolled > 0
				? Math.round((lecture.presentCount / lecture.totalEnrolled) * 100)
				: 0;
		lecture.status = "completed";

		return await lecture.save();
	}

	// Update lecture details
	async updateLecture(lectureId, updates) {
		return await LectureAttendance.findByIdAndUpdate(lectureId, updates, {
			new: true,
		});
	}

	// Cancel a lecture
	async cancelLecture(lectureId, reason) {
		return await LectureAttendance.findByIdAndUpdate(
			lectureId,
			{
				status: "cancelled",
				cancelReason: reason,
			},
			{ new: true }
		);
	}

	// Get student's lecture attendance history
	async getStudentLectureHistory(studentId, teacherId) {
		return await LectureAttendance.find({
			teacherId,
			"attendees.studentId": studentId,
		})
			.populate("courseId", "name")
			.sort({ date: -1 });
	}

	// Get attendance statistics for a student
	async getStudentAttendanceStats(studentId, teacherId, courseId) {
		const lectures = await LectureAttendance.find({
			teacherId,
			courseId,
			"attendees.studentId": studentId,
		});

		let totalLectures = lectures.length;
		let attended = 0;
		let absent = 0;
		let late = 0;
		let excused = 0;

		lectures.forEach((lecture) => {
			const studentAttendance = lecture.attendees.find(
				(a) => a.studentId.toString() === studentId
			);
			if (studentAttendance) {
				switch (studentAttendance.status) {
					case "present":
						attended++;
						break;
					case "absent":
						absent++;
						break;
					case "late":
						late++;
						break;
					case "excused":
						excused++;
						break;
				}
			}
		});

		const attendanceRate =
			totalLectures > 0 ? Math.round((attended / totalLectures) * 100) : 0;

		return {
			totalLectures,
			attended,
			absent,
			late,
			excused,
			attendanceRate,
		};
	}

	// Update student's theoretical progress
	async updateStudentTheoProgress(studentId, attendanceStats) {
		return await Student.findByIdAndUpdate(
			studentId,
			{
				theoLecturesAttended: attendanceStats.attended,
				theoAttendanceRate: attendanceStats.attendanceRate,
			},
			{ new: true }
		);
	}

	// Get schedule by ID
	async getScheduleById(scheduleId) {
		return await TheoSchedule.findById(scheduleId)
			.populate("courseId", "name description")
			.populate({
				path: "assignedStudents",
				populate: { path: "userId", select: "name email" },
			});
	}

	// Update schedule lecture count
	async updateScheduleLectureCount(scheduleId, count) {
		return await TheoSchedule.findByIdAndUpdate(
			scheduleId,
			{ $inc: { lectureCount: count } },
			{ new: true }
		);
	}
}

module.exports = new TeacherRepository();
