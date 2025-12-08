// src/TeacherDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TeacherDashboard.css";
import { getUserData, getAuthToken, logout } from "./utils/auth";
import api from "./services/api";

const TeacherDashboard = () => {
	const navigate = useNavigate();
	const [currentTeacher, setCurrentTeacher] = useState("");
	const [students, setStudents] = useState([]);

	useEffect(() => {
		// Check if user is logged in with API
		const userData = getUserData();

		if (userData && userData.role === "teacher") {
			// User logged in via API
			setCurrentTeacher(userData.name);
			loadTeacherData();
			return;
		}

		// Fallback to localStorage for old login method
		const teacher = localStorage.getItem("currentTeacher");
		if (teacher) {
			setCurrentTeacher(teacher);
			loadStudents(teacher);
		} else {
			navigate("/login/Teachers");
		}
	}, [navigate]);

	const loadTeacherData = async () => {
		const token = getAuthToken();
		if (!token) return;

		try {
			// Load teacher's assigned students from API
			const data = await api.teacher.getAssignedStudents(token);
			console.log("Assigned students:", data);

			// Map backend student data to frontend format
			const mappedStudents = data.students.map((s) => ({
				id: s.studentId,
				name: s.name,
				email: s.email,
				phone: s.phone,
				course: s.license ? s.license.name : "Not Selected Yet",
				instructor: currentTeacher,
				approved: true,
				theoPassed: s.theoPassed,
				status: s.status,
				trafficSigns: false, // These would come from detailed progress tracking
				trafficLaws: false,
				carMechanics: false,
				quiz: false,
			}));

			setStudents(mappedStudents);
		} catch (error) {
			console.error("Error loading teacher data:", error);
			// Fallback to localStorage if API fails
			const teacher =
				getUserData()?.name || localStorage.getItem("currentTeacher");
			if (teacher) {
				loadStudents(teacher);
			}
		}
	};

	const loadStudents = (teacherName) => {
		const savedStudents = JSON.parse(
			localStorage.getItem("students") || "[]"
		);

		const teacherStudents = savedStudents.filter((student) => {
			const isApproved = student.approved === true;
			const hasSameInstructor = student.instructor === teacherName;
			const hasSelectedCourse =
				student.course && student.course !== "Not Selected Yet";
			return isApproved && hasSameInstructor && hasSelectedCourse;
		});

		setStudents(teacherStudents);
	};

	const handleLogout = () => {
		logout();
		navigate("/");
	};

	// تمرير النظري: الإشارات / القوانين / الميكانيك
	const handlePassClick = (studentId, classType) => {
		const updatedStudents = students.map((student) => {
			if (student.id === studentId) {
				return {
					...student,
					[classType]: !student[classType],
				};
			}
			return student;
		});

		setStudents(updatedStudents);

		const allStudents = JSON.parse(
			localStorage.getItem("students") || "[]"
		);
		const updatedAllStudents = allStudents.map((student) => {
			if (student.id === studentId) {
				return {
					...student,
					[classType]: !student[classType],
				};
			}
			return student;
		});

		localStorage.setItem("students", JSON.stringify(updatedAllStudents));
	};

	const handleQuizClick = (studentId) => {
		const updatedStudents = students.map((student) =>
			student.id === studentId
				? { ...student, quiz: !student.quiz }
				: student
		);

		setStudents(updatedStudents);

		const allStudents = JSON.parse(
			localStorage.getItem("students") || "[]"
		);
		const updatedAllStudents = allStudents.map((student) =>
			student.id === studentId
				? { ...student, quiz: !student.quiz }
				: student
		);

		localStorage.setItem("students", JSON.stringify(updatedAllStudents));
	};

	// READY → PASS (مطفي) → PASSED (بعد المدير)
	const handleReadyClick = async (studentId) => {
		const student = students.find((s) => s.id === studentId);

		// يجب أن يكون مجتاز 3 مواد رئيسية
		if (
			student &&
			student.trafficSigns &&
			student.trafficLaws &&
			student.carMechanics
		) {
			const token = getAuthToken();

			// If we have API token, use API
			if (token) {
				try {
					await api.teacher.markStudentReady(token, studentId);

					// Update local state
					const updatedStudents = students.map((s) =>
						s.id === studentId
							? {
									...s,
									readyForExam: true,
									readyMarkedBy: currentTeacher,
									readyMarkedDate: new Date().toISOString(),
							  }
							: s
					);
					setStudents(updatedStudents);

					alert(`✅ ${student.name} marked as ready for exam!`);
					return;
				} catch (error) {
					console.error("Error marking student ready:", error);
					alert(`❌ Failed to mark student ready: ${error.message}`);
					return;
				}
			}

			// Fallback to localStorage
			const updatedStudents = students.map((student) => {
				if (student.id === studentId) {
					const updatedStudent = {
						...student,
						readyForExam: true, // جاهز للامتحان النظري
						status: student.status || "theoretical",
						readyMarkedBy: currentTeacher,
						readyMarkedDate: new Date().toISOString(),
						examScheduled: student.examScheduled || false,
						examPassed: student.examPassed || false,
					};
					return updatedStudent;
				}
				return student;
			});

			setStudents(updatedStudents);

			const allStudents = JSON.parse(
				localStorage.getItem("students") || "[]"
			);
			const updatedAllStudents = allStudents.map((student) => {
				if (student.id === studentId) {
					const updatedStudent = {
						...student,
						readyForExam: true,
						status: student.status || "theoretical",
						readyMarkedBy: currentTeacher,
						readyMarkedDate: new Date().toISOString(),
						examScheduled: student.examScheduled || false,
						examPassed: student.examPassed || false,
					};
					return updatedStudent;
				}
				return student;
			});

			localStorage.setItem(
				"students",
				JSON.stringify(updatedAllStudents)
			);

			alert(`✅ ${student.name} marked as ready for exam!`);
		} else {
			alert(
				"❌ Student must pass all 3 main classes (Traffic Signs, Traffic Laws, Car Mechanics)."
			);
		}
	};

	const getPassButtonClass = (isPassed) => {
		return isPassed ? "pass-btn passed" : "pass-btn";
	};

	const getQuizButtonClass = (isQuizPassed) => {
		return isQuizPassed ? "quiz-btn passed" : "quiz-btn";
	};

	// عدد المواد المجتازة
	const getPassedClassesCount = (student) => {
		let count = 0;
		if (student.trafficSigns) count++;
		if (student.trafficLaws) count++;
		if (student.carMechanics) count++;
		return count;
	};

	// نسبة تقدم الطالب في النظري
	const calculateStudentProgress = (student) => {
		let passCount = 0;
		if (student.trafficSigns) passCount++;
		if (student.trafficLaws) passCount++;
		if (student.carMechanics) passCount++;
		if (student.quiz) passCount++;

		if (passCount === 1) return 25;
		if (passCount === 2) return 50;
		if (passCount === 3) return 75;
		if (passCount === 4) return 100;
		return 0;
	};

	// شكل زر READY / PASS / PASSED
	const getReadyButtonClass = (student) => {
		const hasThreePasses = getPassedClassesCount(student) === 3;

		if (student.examPassed) {
			// نجح في الامتحان النظري (بعد المدير)
			return "ready-btn ready-active";
		}

		if (student.readyForExam) {
			// المدرس ضغط Ready → الآن عنده PASS مطفي
			return "ready-btn ready-disabled";
		}

		if (hasThreePasses) {
			// مؤهل للReady
			return "ready-btn ready-enabled";
		}

		// غير مؤهل
		return "ready-btn ready-disabled";
	};

	// هل الزر قابل للضغط؟
	const isReadyButtonEnabled = (student) => {
		const hasThreePasses = getPassedClassesCount(student) === 3;
		return !student.readyForExam && !student.examPassed && hasThreePasses;
	};

	// النص الذي يظهر على زر المدرس
	const getReadyButtonText = (student) => {
		if (student.examPassed) return "PASSED"; // بعد ما المدير يعمل PASS في الامتحان
		if (student.readyForExam) return "PASS"; // بعد ما المدرس يضغط READY
		const hasThreePasses = getPassedClassesCount(student) === 3;
		return hasThreePasses ? "READY" : "READY";
	};

	const getReadyButtonTitle = (student) => {
		if (student.examPassed) {
			return "Student passed the theoretical exam.";
		}
		if (student.readyForExam) {
			return "Student is ready for exam. PASS is controlled by manager.";
		}

		const passedClassesCount = getPassedClassesCount(student);
		return `Need 3/3 main classes passed (Currently: ${passedClassesCount}/3)`;
	};

	const teachersSchedule = {
		Suliman: {
			schedule: "Sunday, Monday, Tuesday",
			time: "8:00 AM - 10:00 AM",
		},
		Majed: {
			schedule: "Sunday, Monday, Tuesday",
			time: "2:00 PM - 4:00 PM",
		},
	};

	const currentTeacherSchedule = teachersSchedule[currentTeacher];

	if (!currentTeacher) {
		return <div>Loading...</div>;
	}

	const totalReady = students.filter((s) => s.readyForExam).length;
	const totalPassedExam = students.filter((s) => s.examPassed).length;

	return (
		<div className="teacher-dashboard">
			{/* Header */}
			<header className="dashboard-header">
				<div className="header-content">
					<div className="school-info">
						<div className="school-logo">🏫</div>
						<h1 className="school-name">Alaraj Driving School</h1>
					</div>
					<div className="user-info">
						<span className="welcome-text">
							Welcome, {currentTeacher}
						</span>
						<button className="logout-btn" onClick={handleLogout}>
							Logout
						</button>
					</div>
				</div>
			</header>

			{/* Teacher Profile */}
			<section className="teacher-profile">
				<div className="profile-card">
					<div className="profile-header">
						<div className="teacher-avatar">👨‍🏫</div>
						<div className="profile-info">
							<h2 className="teacher-name">{currentTeacher}</h2>
							<p className="teacher-role">Driving Instructor</p>
						</div>
					</div>
					<div className="schedule-info">
						<div className="schedule-item">
							<span className="schedule-label">
								Teaching Schedule:
							</span>
							<span className="schedule-value">
								{currentTeacherSchedule?.time || "-"}
							</span>
						</div>
						<div className="schedule-item">
							<span className="schedule-label">Days:</span>
							<span className="schedule-value">
								{currentTeacherSchedule?.schedule || "-"}
							</span>
						</div>
						<div className="schedule-item">
							<span className="schedule-label">
								Total Students:
							</span>
							<span className="schedule-value">
								{students.length} students
							</span>
						</div>
					</div>
				</div>
			</section>

			{/* Students Section */}
			<section className="students-section">
				<h2 className="section-title">My Students</h2>

				{students.length > 0 ? (
					<>
						<div className="students-table-container">
							<table className="students-table">
								<thead>
									<tr>
										<th>Student Name</th>
										<th>Course</th>
										<th>Progress</th>
										<th>Traffic Signs</th>
										<th>Traffic Laws</th>
										<th>Car Mechanics</th>
										<th>Quiz</th>
										<th>Ready / Pass / Passed</th>
									</tr>
								</thead>
								<tbody>
									{students.map((student) => {
										const progress =
											calculateStudentProgress(student);
										const passedClassesCount =
											getPassedClassesCount(student);
										const isReadyEnabled =
											isReadyButtonEnabled(student);

										return (
											<tr
												key={student.id}
												className="student-row"
											>
												<td>{student.name}</td>
												<td>{student.course}</td>

												<td>
													<div className="progress-display">
														<div className="progress-bar-small">
															<div
																className="progress-fill-small"
																style={{
																	width: `${progress}%`,
																}}
															></div>
														</div>
														<span className="progress-text">
															{progress}%
														</span>
														<div className="passes-count">
															{passedClassesCount}
															/3 main classes
															passed
														</div>
													</div>
												</td>

												<td>
													<button
														className={getPassButtonClass(
															student.trafficSigns
														)}
														onClick={() =>
															handlePassClick(
																student.id,
																"trafficSigns"
															)
														}
													>
														{student.trafficSigns
															? "PASSED"
															: "PASS"}
													</button>
												</td>

												<td>
													<button
														className={getPassButtonClass(
															student.trafficLaws
														)}
														onClick={() =>
															handlePassClick(
																student.id,
																"trafficLaws"
															)
														}
													>
														{student.trafficLaws
															? "PASSED"
															: "PASS"}
													</button>
												</td>

												<td>
													<button
														className={getPassButtonClass(
															student.carMechanics
														)}
														onClick={() =>
															handlePassClick(
																student.id,
																"carMechanics"
															)
														}
													>
														{student.carMechanics
															? "PASSED"
															: "PASS"}
													</button>
												</td>

												<td>
													<button
														className={getQuizButtonClass(
															student.quiz
														)}
														onClick={() =>
															handleQuizClick(
																student.id
															)
														}
													>
														{student.quiz
															? "PASSED"
															: "QUIZ"}
													</button>
												</td>

												<td>
													<button
														className={getReadyButtonClass(
															student
														)}
														onClick={() =>
															isReadyEnabled &&
															handleReadyClick(
																student.id
															)
														}
														disabled={
															!isReadyEnabled
														}
														title={getReadyButtonTitle(
															student
														)}
													>
														{getReadyButtonText(
															student
														)}
													</button>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>

						<div className="summary-cards">
							<div className="summary-card">
								<span className="summary-number">
									{students.length}
								</span>
								<span className="summary-label">
									Total Students
								</span>
							</div>
							<div className="summary-card">
								<span className="summary-number">
									{totalReady}
								</span>
								<span className="summary-label">
									Ready for Exam
								</span>
							</div>
							<div className="summary-card">
								<span className="summary-number">
									{totalPassedExam}
								</span>
								<span className="summary-label">
									Exam Passed
								</span>
							</div>
						</div>
					</>
				) : (
					<div className="no-students">
						<div className="no-students-icon">👨‍🎓</div>
						<h3>No Students Yet</h3>
						<p>
							No approved students have selected you as their
							instructor yet.
						</p>
					</div>
				)}
			</section>

			{/* Footer */}
			<footer className="dashboard-footer">
				<p>© 2026 Alaraj Driving School. All rights reserved.</p>
			</footer>
		</div>
	);
};

export default TeacherDashboard;
