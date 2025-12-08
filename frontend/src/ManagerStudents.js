// src/ManagerStudents.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ManagerStudents.css";
import api from "./services/api";
import { getAuthToken } from "./utils/auth";

const LESSON_PRICE = 90; // سعر الحصة العملية

const ManagerStudents = () => {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState("new");
	const [newStudents, setNewStudents] = useState([]);
	const [theoreticalStudents, setTheoreticalStudents] = useState([]);
	const [practicalStudents, setPracticalStudents] = useState([]);
	const [examStudents, setExamStudents] = useState([]);
	const [readyForExamStudents, setReadyForExamStudents] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		loadStudentsData();
	}, []);

	const loadStudentsData = async () => {
		const token = getAuthToken();
		if (!token) {
			alert("Please login first");
			navigate("/");
			return;
		}

		setLoading(true);
		try {
			// Fetch pending students from API
			const pendingData = await api.admin.getPendingStudents(token);
			console.log("Pending students data:", pendingData); // Debug log
			setNewStudents(pendingData.students || []);

			// Fetch all approved students from API
			const allStudentsData = await api.admin.getAllStudents(token);
			const allStudents = allStudentsData.students || [];

			// Filter students by status
			const theoretical = allStudents.filter(
				(student) =>
					student.status === "pending" || student.status === "active"
			);

			const practical = allStudents.filter(
				(student) => student.status === "practical"
			);

			const exam = allStudents.filter(
				(student) => student.status === "exam"
			);

			setTheoreticalStudents(theoretical);
			setPracticalStudents(practical);
			setExamStudents(exam);

			// Fetch students ready for theoretical exam
			const readyForExamData =
				await api.admin.getStudentsReadyForTheoExam(token);
			setReadyForExamStudents(readyForExamData.students || []);
		} catch (error) {
			console.error("Error loading students:", error);
			alert(`Failed to load students: ${error.message}`);
		} finally {
			setLoading(false);
		}
	};

	const handleApproveStudent = async (studentId) => {
		const token = getAuthToken();
		if (!token) {
			alert("Please login first");
			navigate("/");
			return;
		}

		console.log("Approving student with ID:", studentId); // Debug log

		if (!studentId) {
			alert("❌ Error: Student ID is missing");
			return;
		}

		try {
			const result = await api.admin.approveStudent(token, studentId);

			alert(
				`✅ ${result.message}\nStudent can now login and choose their course.`
			);

			// Reload students data
			loadStudentsData();
		} catch (error) {
			alert(`❌ Failed to approve student: ${error.message}`);
		}
	};

	const handleRejectStudent = async (studentId) => {
		const token = getAuthToken();
		if (!token) {
			alert("Please login first");
			navigate("/");
			return;
		}

		if (
			!window.confirm(
				"Are you sure you want to reject this student application?"
			)
		) {
			return;
		}

		try {
			const result = await api.admin.rejectStudent(token, studentId);

			alert(`✅ ${result.message}`);

			// Reload students data
			loadStudentsData();
		} catch (error) {
			alert(`❌ Failed to reject student: ${error.message}`);
		}
	};

	// Pass student in theoretical exam
	const handlePassTheoExam = async (studentId) => {
		const token = getAuthToken();
		if (!token) {
			alert("Please login first");
			navigate("/");
			return;
		}

		try {
			const result = await api.admin.markStudentTheoPassed(
				token,
				studentId
			);
			alert(`✅ ${result.message}`);

			// Reload students data
			loadStudentsData();
		} catch (error) {
			alert(`❌ Failed to pass student: ${error.message}`);
		}
	};

	// نقل الطالب من النظري للامتحان
	const handleGoToExam = (studentId) => {
		const allStudents = JSON.parse(
			localStorage.getItem("students") || "[]"
		);
		const student = allStudents.find((s) => s.id === studentId);

		if (student) {
			const updatedStudents = allStudents.map((s) =>
				s.id === studentId
					? {
							...s,
							status: "exam",
							examScheduled: true,
							examDate: new Date().toISOString(),
					  }
					: s
			);

			localStorage.setItem("students", JSON.stringify(updatedStudents));
			loadStudentsData();

			alert(
				`🎯 ${student.name} has been moved to Theoretical Exams section!`
			);
		}
	};

	// المدير يضغط PASS في الامتحان → يتحول إلى Practical + يشتغل PASSED عند المدرّس
	const handlePassExam = (studentId) => {
		const allStudents = JSON.parse(
			localStorage.getItem("students") || "[]"
		);
		const student = allStudents.find((s) => s.id === studentId);
		if (!student) return;

		const updatedStudents = allStudents.map((s) =>
			s.id === studentId
				? {
						...s,
						status: "practical",
						examScheduled: false,
						examPassed: true, // هذا ما يجعل المدرّس يرى PASSED
						practicalExam: true, // اجتاز النظري وبدأ العملي
						practicalTrainer: s.practicalTrainer || null,
						practicalLessons: s.practicalLessons || 0,
						practicalPaid: s.practicalPaid || 0,
				  }
				: s
		);

		localStorage.setItem("students", JSON.stringify(updatedStudents));
		loadStudentsData();

		alert(
			`✅ ${student.name} has PASSED the theoretical exam and moved to PRACTICAL section.`
		);
	};

	const handleBackToDashboard = () => {
		navigate("/manager/dashboard");
	};

	const getProgress = (student) => {
		let passCount = 0;
		if (student.trafficSigns) passCount++;
		if (student.trafficLaws) passCount++;
		if (student.carMechanics) passCount++;
		if (student.quiz) passCount++;

		return (passCount / 4) * 100;
	};

	const getPassStatus = (student) => {
		const passes = [
			{ name: "Traffic Signs", passed: student.trafficSigns },
			{ name: "Traffic Laws", passed: student.trafficLaws },
			{ name: "Car Mechanics", passed: student.carMechanics },
			{ name: "Final Quiz", passed: student.quiz },
		];

		const passedCount = passes.filter((p) => p.passed).length;
		return { passes, passedCount, total: passes.length };
	};

	return (
		<div className="manager-students">
			<div className="container">
				<header className="students-header">
					<div className="header-content">
						<button
							className="back-button"
							onClick={handleBackToDashboard}
						>
							← Back to Dashboard
						</button>
						<div className="header-text">
							<h1>🎓 Students Management</h1>
							<p>Manage all student applications and progress</p>
						</div>
					</div>
				</header>

				<div className="tabs-navigation">
					<button
						className={`tab-btn ${
							activeTab === "new" ? "active" : ""
						}`}
						onClick={() => setActiveTab("new")}
					>
						📋 New Students ({newStudents.length})
					</button>
					<button
						className={`tab-btn ${
							activeTab === "theoretical" ? "active" : ""
						}`}
						onClick={() => setActiveTab("theoretical")}
					>
						📚 Theoretical ({theoreticalStudents.length})
					</button>
					<button
						className={`tab-btn ${
							activeTab === "practical" ? "active" : ""
						}`}
						onClick={() => setActiveTab("practical")}
					>
						🚗 Practical ({practicalStudents.length})
					</button>
					<button
						className={`tab-btn ${
							activeTab === "ready-for-exam" ? "active" : ""
						}`}
						onClick={() => setActiveTab("ready-for-exam")}
					>
						✅ Ready for Exam ({readyForExamStudents.length})
					</button>
					<button
						className={`tab-btn ${
							activeTab === "exams" ? "active" : ""
						}`}
						onClick={() => setActiveTab("exams")}
					>
						🎯 Exams ({examStudents.length})
					</button>
				</div>

				<div className="students-content">
					{/* New Students Tab */}
					{activeTab === "new" && (
						<div className="tab-content">
							<h2>📋 New Student Applications</h2>
							{loading ? (
								<div className="loading">Loading...</div>
							) : newStudents.length > 0 ? (
								<div className="students-grid">
									{newStudents.map((student) => (
										<div
											key={
												student.studentId ||
												student._id ||
												student.id
											}
											className="student-card new-student"
										>
											<div className="student-header">
												<div className="student-avatar">
													👤
												</div>
												<div className="student-info">
													<h3>{student.name}</h3>
													<p className="student-email">
														📧 {student.email}
													</p>
													<p className="student-phone">
														📞 {student.phone}
													</p>
													<p className="apply-date">
														📅 Applied:{" "}
														{new Date(
															student.signupDate ||
																student.createdAt
														).toLocaleDateString()}
													</p>
													<div className="student-status">
														<span className="status-badge pending">
															⏳ Waiting Approval
														</span>
													</div>
												</div>
											</div>
											<div className="student-actions">
												<button
													className="approve-btn"
													onClick={() =>
														handleApproveStudent(
															student.studentId ||
																student._id ||
																student.id
														)
													}
												>
													✅ Approve
												</button>
												<button
													className="reject-btn"
													onClick={() =>
														handleRejectStudent(
															student.studentId ||
																student._id ||
																student.id
														)
													}
												>
													❌ Reject
												</button>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="no-students">
									<div className="no-students-icon">📝</div>
									<h3>No New Applications</h3>
									<p>
										There are no pending student
										applications at the moment.
									</p>
								</div>
							)}
						</div>
					)}

					{/* Theoretical Students Tab */}
					{activeTab === "theoretical" && (
						<div className="tab-content">
							<h2>📚 Theoretical Phase Students</h2>
							{theoreticalStudents.length > 0 ? (
								<div className="students-grid">
									{theoreticalStudents.map((student) => {
										const passStatus =
											getPassStatus(student);
										const progress = getProgress(student);

										return (
											<div
												key={student.id}
												className={`student-card ${
													student.readyForExam
														? "ready-student"
														: "theoretical-student"
												}`}
											>
												<div className="student-header">
													<div className="student-avatar">
														👨‍🎓
													</div>
													<div className="student-info">
														<h3>{student.name}</h3>
														<p className="student-course">
															📝 {student.course}
														</p>
														<p className="student-instructor">
															👨‍🏫 Instructor:{" "}
															{student.instructor}
														</p>
														<div className="progress-info">
															<span>
																📊 Progress:{" "}
																{Math.round(
																	progress
																)}
																%
															</span>
															<span>
																✅ Passes:{" "}
																{
																	passStatus.passedCount
																}
																/
																{
																	passStatus.total
																}
															</span>
														</div>
														<div className="student-status">
															{student.readyForExam ? (
																<span className="status-badge ready">
																	✅ Ready for
																	Exam
																</span>
															) : (
																<span className="status-badge theoretical">
																	📚 In
																	Progress
																</span>
															)}
														</div>
													</div>
												</div>
												<div className="student-details">
													<div className="detail-item">
														<span>
															🛑 Traffic Signs:
														</span>
														<span
															className={
																student.trafficSigns
																	? "passed"
																	: "pending"
															}
														>
															{student.trafficSigns
																? "✅ Passed"
																: "❌ Pending"}
														</span>
													</div>
													<div className="detail-item">
														<span>
															📜 Traffic Laws:
														</span>
														<span
															className={
																student.trafficLaws
																	? "passed"
																	: "pending"
															}
														>
															{student.trafficLaws
																? "✅ Passed"
																: "❌ Pending"}
														</span>
													</div>
													<div className="detail-item">
														<span>
															🔧 Car Mechanics:
														</span>
														<span
															className={
																student.carMechanics
																	? "passed"
																	: "pending"
															}
														>
															{student.carMechanics
																? "✅ Passed"
																: "❌ Pending"}
														</span>
													</div>
													<div className="detail-item">
														<span>
															📝 Final Quiz:
														</span>
														<span
															className={
																student.quiz
																	? "passed"
																	: "pending"
															}
														>
															{student.quiz
																? "✅ Passed"
																: "❌ Pending"}
														</span>
													</div>
												</div>
												{student.readyForExam && (
													<div className="student-actions">
														<button
															className="exam-btn"
															onClick={() =>
																handleGoToExam(
																	student.id
																)
															}
														>
															🎯 Go to Exam
														</button>
													</div>
												)}
											</div>
										);
									})}
								</div>
							) : (
								<div className="no-students">
									<div className="no-students-icon">📚</div>
									<h3>No Theoretical Students</h3>
									<p>
										There are no students in the theoretical
										phase at the moment.
									</p>
								</div>
							)}
						</div>
					)}

					{/* Practical Students Tab */}
					{activeTab === "practical" && (
						<div className="tab-content">
							<h2>🚗 Practical Training Students</h2>
							{practicalStudents.length > 0 ? (
								<div className="students-grid">
									{practicalStudents.map((student) => {
										const lessons =
											student.practicalLessons || 0;
										const paid = student.practicalPaid || 0;
										const total = lessons * LESSON_PRICE;
										const remaining = total - paid;

										return (
											<div
												key={student.id}
												className="student-card practical-student"
											>
												<div className="student-header">
													<div className="student-avatar">
														🚗
													</div>
													<div className="student-info">
														<h3>{student.name}</h3>
														<p className="student-course">
															📝 {student.course}
														</p>
														<p className="student-instructor">
															👨‍🏫 Trainer:{" "}
															{student.practicalTrainer ||
																"Not selected by student yet"}
														</p>
														<div className="progress-info">
															<span>
																📅 Practical
																Lessons:{" "}
																{lessons}
															</span>
														</div>
													</div>
												</div>
												<div className="student-details">
													<div className="detail-item">
														<span>
															💰 Total Amount (so
															far):
														</span>
														<span>{total} ₪</span>
													</div>
													<div className="detail-item">
														<span>✅ Paid:</span>
														<span>{paid} ₪</span>
													</div>
													<div className="detail-item">
														<span>
															⏳ Remaining:
														</span>
														<span>
															{remaining} ₪
														</span>
													</div>
												</div>
											</div>
										);
									})}
								</div>
							) : (
								<div className="no-students">
									<div className="no-students-icon">🚗</div>
									<h3>No Practical Students</h3>
									<p>
										Students will appear here after passing
										the theoretical exam.
									</p>
								</div>
							)}
						</div>
					)}

					{/* Ready for Exam Tab */}
					{activeTab === "ready-for-exam" && (
						<div className="tab-content">
							<h2>📋 Students Ready for Theoretical Exam</h2>

							{readyForExamStudents.length > 0 ? (
								<div className="students-grid">
									{readyForExamStudents.map((student) => (
										<div
											key={student.studentId}
											className="student-card"
										>
											<div className="student-header">
												<div className="student-avatar">
													🎓
												</div>
												<div className="student-info">
													<h3>{student.userName}</h3>
													<p className="student-email">
														📧 {student.userEmail}
													</p>
													<p className="student-course">
														📝 {student.licenseName}
													</p>
													<p className="student-instructor">
														👨‍🏫 Teacher:{" "}
														{student.teacherName}
													</p>
												</div>
											</div>
											<div className="student-actions">
												<button
													className="btn-pass-exam"
													onClick={() =>
														handlePassTheoExam(
															student.studentId
														)
													}
												>
													✅ Pass Theoretical Exam
												</button>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="empty-state">
									<div className="empty-icon">📋</div>
									<p>
										No students ready for the theoretical
										exam yet.
									</p>
								</div>
							)}
						</div>
					)}

					{/* Exams Tab */}
					{activeTab === "exams" && (
						<div className="tab-content">
							<h2>🎯 Theoretical Exams</h2>

							{examStudents.length > 0 ? (
								<div className="students-grid">
									{examStudents.map((student) => {
										const passStatus =
											getPassStatus(student);
										const progress = getProgress(student);

										return (
											<div
												key={student.id}
												className="student-card exam-student"
											>
												<div className="student-header">
													<div className="student-avatar">
														🎓
													</div>
													<div className="student-info">
														<h3>{student.name}</h3>
														<p className="student-course">
															📝 {student.course}
														</p>
														<p className="student-instructor">
															👨‍🏫 Instructor:{" "}
															{student.instructor}
														</p>
														<div className="progress-info">
															<span>
																📊 Progress:{" "}
																{Math.round(
																	progress
																)}
																%
															</span>
															<span>
																✅ Passes:{" "}
																{
																	passStatus.passedCount
																}
																/
																{
																	passStatus.total
																}
															</span>
														</div>
														<div className="student-status">
															{student.examPassed ? (
																<span className="status-badge ready">
																	✅ Exam
																	Passed
																</span>
															) : (
																<>
																	<span className="status-badge exam">
																		📅 Exam
																		Scheduled
																	</span>
																	{student.examDate && (
																		<div className="exam-date-info">
																			<span className="exam-date-text">
																				🗓️
																				Exam
																				Date:{" "}
																				{new Date(
																					student.examDate
																				).toLocaleDateString()}
																			</span>
																		</div>
																	)}
																</>
															)}
														</div>
													</div>
												</div>
												<div className="student-details">
													<div className="detail-item">
														<span>
															🛑 Traffic Signs:
														</span>
														<span
															className={
																student.trafficSigns
																	? "passed"
																	: "pending"
															}
														>
															{student.trafficSigns
																? "✅ Passed"
																: "❌ Pending"}
														</span>
													</div>
													<div className="detail-item">
														<span>
															📜 Traffic Laws:
														</span>
														<span
															className={
																student.trafficLaws
																	? "passed"
																	: "pending"
															}
														>
															{student.trafficLaws
																? "✅ Passed"
																: "❌ Pending"}
														</span>
													</div>
													<div className="detail-item">
														<span>
															🔧 Car Mechanics:
														</span>
														<span
															className={
																student.carMechanics
																	? "passed"
																	: "pending"
															}
														>
															{student.carMechanics
																? "✅ Passed"
																: "❌ Pending"}
														</span>
													</div>
													<div className="detail-item">
														<span>
															📝 Final Quiz:
														</span>
														<span
															className={
																student.quiz
																	? "passed"
																	: "pending"
															}
														>
															{student.quiz
																? "✅ Passed"
																: "❌ Pending"}
														</span>
													</div>
												</div>

												<div className="student-actions">
													<button
														className="approve-btn"
														onClick={() =>
															handlePassExam(
																student.id
															)
														}
														disabled={
															student.examPassed
														}
													>
														{student.examPassed
															? "PASSED & Moved to Practical"
															: "PASS & Move to Practical"}
													</button>
												</div>
											</div>
										);
									})}
								</div>
							) : (
								<div className="no-students">
									<div className="no-students-icon">🎯</div>
									<h3>No Exam Students</h3>
									<p>
										There are no students scheduled for
										exams at the moment.
									</p>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ManagerStudents;
