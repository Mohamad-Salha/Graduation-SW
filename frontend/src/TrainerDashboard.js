// src/TrainerDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TrainerDashboard.css";
import { getUserData, getAuthToken, logout } from "./utils/auth";
import api from "./services/api";

const AUTOMATIC_PRICE = 90;
const MANUAL_PRICE = 90;
const MOTORCYCLE_PRICE = 90;
const OTHER_VEHICLE_PRICE = 110;

// تحويل اسم الكورس إلى نوع المركبة لتتطابق مع السيارات
const mapCourseToVehicleType = (course) => {
	if (!course) return null;

	if (course.includes("Automatic")) return "Automatic";
	if (course.includes("Manual")) return "Manual";
	if (course.includes("Motorcycle")) return "Motorcycle";
	if (course.includes("Light Truck")) return "Light Truck";
	if (course.includes("Heavy Truck")) return "Heavy Truck";
	if (course.includes("Bus")) return "Bus";
	if (course.includes("Trailer")) return "Trailer";

	return null;
};

const getLessonPrice = (course) => {
	const type = mapCourseToVehicleType(course);
	if (!type) return AUTOMATIC_PRICE;

	if (type === "Automatic" || type === "Manual" || type === "Motorcycle") {
		return AUTOMATIC_PRICE;
	}
	return OTHER_VEHICLE_PRICE;
};

const TrainerDashboard = () => {
	const navigate = useNavigate();
	const [currentTrainer, setCurrentTrainer] = useState("");
	const [activeTab, setActiveTab] = useState("students");

	const [students, setStudents] = useState([]);
	const [selectedStudent, setSelectedStudent] = useState(null);

	const [selectedDate, setSelectedDate] = useState(
		() => new Date().toISOString().split("T")[0]
	);
	const [scheduleSlots, setScheduleSlots] = useState([]);
	const [newSlotTime, setNewSlotTime] = useState("");
	const [newSlotStudentId, setNewSlotStudentId] = useState("");

	const [carRequests, setCarRequests] = useState([]);

	// تحميل المدرب والبيانات
	useEffect(() => {
		// Check if user is logged in with API
		const userData = getUserData();

		if (userData && userData.role === "trainer") {
			// User logged in via API
			setCurrentTrainer(userData.name);
			loadTrainerData();
			return;
		}

		// Fallback to localStorage for old login method
		const trainerName = localStorage.getItem("currentTrainer");
		if (!trainerName) {
			navigate("/login/Trainers");
			return;
		}

		setCurrentTrainer(trainerName);
		loadStudents(trainerName);
		loadSchedule(trainerName);
		loadCarRequests();
	}, [navigate]);

	const loadTrainerData = async () => {
		const token = getAuthToken();
		if (!token) return;

		try {
			// TODO: Load trainer's assigned students from API
			console.log("Loading trainer data from API...");
			// For now, keep using localStorage until we implement the trainer endpoints
			const trainer = getUserData().name;
			loadStudents(trainer);
			loadSchedule(trainer);
			loadCarRequests();
		} catch (error) {
			console.error("Error loading trainer data:", error);
		}
	};

	// تحميل الطلاب الذين يتدربون عند هذا المدرب عملياً
	const loadStudents = (trainerName) => {
		const allStudents = JSON.parse(
			localStorage.getItem("students") || "[]"
		);

		const trainerStudents = allStudents.filter((s) => {
			const isPractical = s.status === "practical";
			const hasTrainer = s.practicalTrainer === trainerName;
			return isPractical && hasTrainer;
		});

		setStudents(trainerStudents);
	};

	// مفتاح جدول المدرب في localStorage
	const getScheduleKey = (trainerName) => `trainerSchedule_${trainerName}`;

	const loadSchedule = (trainerName) => {
		const key = getScheduleKey(trainerName);
		const stored = JSON.parse(localStorage.getItem(key) || "[]");
		setScheduleSlots(stored);
	};

	const saveSchedule = (slots) => {
		if (!currentTrainer) return;
		const key = getScheduleKey(currentTrainer);
		localStorage.setItem(key, JSON.stringify(slots));
		setScheduleSlots(slots);
	};

	const loadCarRequests = () => {
		const reqs = JSON.parse(localStorage.getItem("carRequests") || "[]");
		setCarRequests(reqs);
	};

	const saveCarRequests = (reqs) => {
		localStorage.setItem("carRequests", JSON.stringify(reqs));
		setCarRequests(reqs);
	};

	const handleLogout = () => {
		logout();
		navigate("/");
	};

	// إضافة موعد جديد في جدول اليوم
	const handleAddSlot = (e) => {
		e.preventDefault();

		if (!newSlotTime) {
			alert("Please select a time.");
			return;
		}

		const student = students.find((s) => s.id === newSlotStudentId);

		const newSlot = {
			id: `slot_${Date.now()}`,
			trainer: currentTrainer,
			date: selectedDate,
			time: newSlotTime,
			studentId: student ? student.id : null,
			studentName: student ? student.name : null,
			course: student ? student.course : null,
			vehicleType: student
				? mapCourseToVehicleType(student.course)
				: null,
			status: student ? "booked" : "available", // available / booked / waiting-car / in-progress / completed
			carId: null,
		};

		const updated = [...scheduleSlots, newSlot];
		saveSchedule(updated);

		setNewSlotTime("");
		setNewSlotStudentId("");
	};

	const getSlotsForSelectedDate = () => {
		return scheduleSlots
			.filter((slot) => slot.date === selectedDate)
			.sort((a, b) => a.time.localeCompare(b.time));
	};

	const handleRequestCar = (slotId) => {
		const slot = scheduleSlots.find((s) => s.id === slotId);
		if (!slot) return;

		if (!slot.studentId || !slot.vehicleType) {
			alert(
				"You must assign a student and course to this slot before requesting a car."
			);
			return;
		}

		const existing = carRequests.find(
			(r) => r.slotId === slotId && r.status === "pending"
		);
		if (existing) {
			alert(
				"You already requested a car for this lesson. Please wait for manager approval."
			);
			return;
		}

		const newRequest = {
			id: `req_${Date.now()}`,
			trainer: currentTrainer,
			slotId: slot.id,
			date: slot.date,
			time: slot.time,
			studentId: slot.studentId,
			studentName: slot.studentName,
			vehicleType: slot.vehicleType,
			course: slot.course,
			status: "pending", // pending / approved / rejected
			createdAt: new Date().toISOString(),
		};

		const updatedReqs = [...carRequests, newRequest];
		saveCarRequests(updatedReqs);

		// تحديث حالة السلوط إلى waiting-car
		const updatedSlots = scheduleSlots.map((s) =>
			s.id === slotId ? { ...s, status: "waiting-car" } : s
		);
		saveSchedule(updatedSlots);

		alert("✅ Car request sent to manager.");
	};

	// يستخدمها المدير لاحقاً (لكن هنا نضيف زر إنهاء الدرس)
	const handleCompleteLesson = (slotId) => {
		const slot = scheduleSlots.find((s) => s.id === slotId);
		if (!slot) return;

		if (
			slot.status !== "in-progress" &&
			slot.status !== "booked" &&
			slot.status !== "waiting-car"
		) {
			alert("This lesson is not active.");
			return;
		}

		if (!slot.studentId) {
			alert("No student assigned to this slot.");
			return;
		}

		// تحديث الطالب: زيادة عدد الدروس العملية وزيادة المبلغ المدفوع
		const allStudents = JSON.parse(
			localStorage.getItem("students") || "[]"
		);
		const lessonPrice = getLessonPrice(slot.course);

		const updatedAllStudents = allStudents.map((st) => {
			if (st.id === slot.studentId) {
				const newLessons = (st.practicalLessons || 0) + 1;
				const newPaid = (st.practicalPaid || 0) + lessonPrice;

				return {
					...st,
					practicalLessons: newLessons,
					practicalPaid: newPaid,
				};
			}
			return st;
		});

		localStorage.setItem("students", JSON.stringify(updatedAllStudents));
		loadStudents(currentTrainer);

		// تحرير السيارة (لو مربوطة)
		if (slot.carId) {
			const cars = JSON.parse(localStorage.getItem("cars") || "[]");
			const updatedCars = cars.map((c) =>
				c.id === slot.carId
					? {
							...c,
							busy: false,
							currentTrainer: null,
							currentStudent: null,
					  }
					: c
			);
			localStorage.setItem("cars", JSON.stringify(updatedCars));
		}

		// تحديث حالة السلوط إلى completed
		const updatedSlots = scheduleSlots.map((s) =>
			s.id === slotId ? { ...s, status: "completed" } : s
		);
		saveSchedule(updatedSlots);

		alert(
			`✅ Lesson completed. Student balance updated (+${lessonPrice}₪).`
		);
	};

	const handleSelectStudentInfo = (student) => {
		setSelectedStudent(student);
	};

	const getStatusBadge = (slot) => {
		switch (slot.status) {
			case "available":
				return (
					<span className="status-badge available">Available</span>
				);
			case "booked":
				return <span className="status-badge booked">Booked</span>;
			case "waiting-car":
				return (
					<span className="status-badge waiting">Waiting Car</span>
				);
			case "in-progress":
				return (
					<span className="status-badge in-progress">
						In Progress
					</span>
				);
			case "completed":
				return (
					<span className="status-badge completed">Completed</span>
				);
			default:
				return null;
		}
	};

	if (!currentTrainer) {
		return (
			<div className="loading-screen">Loading trainer dashboard...</div>
		);
	}

	// 🔥 مانع يمنع المدرب من طلب سيارة إذا لديه درس نشط
	const hasActiveLesson = scheduleSlots.some(
		(slot) =>
			slot.date === selectedDate &&
			(slot.status === "waiting-car" || slot.status === "in-progress")
	);

	return (
		<div className="trainer-dashboard">
			{/* Header */}
			<header className="trainer-header">
				<div className="header-content">
					<div className="trainer-info">
						<div className="trainer-avatar">🚗</div>
						<div>
							<h1 className="trainer-name">{currentTrainer}</h1>
							<p className="trainer-role">
								Practical Driving Trainer
							</p>
						</div>
					</div>
					<button className="logout-btn" onClick={handleLogout}>
						Logout
					</button>
				</div>
			</header>

			{/* Tabs */}
			<nav className="trainer-nav">
				<button
					className={`nav-btn ${
						activeTab === "students" ? "active" : ""
					}`}
					onClick={() => setActiveTab("students")}
				>
					My Students
				</button>
				<button
					className={`nav-btn ${
						activeTab === "schedule" ? "active" : ""
					}`}
					onClick={() => setActiveTab("schedule")}
				>
					Daily Schedule
				</button>
			</nav>

			<main className="trainer-main">
				{/* TAB 1: STUDENTS */}
				{activeTab === "students" && (
					<section className="students-section">
						<h2 className="section-title">My Practical Students</h2>

						{students.length === 0 ? (
							<div className="empty-state">
								<div className="empty-icon">👨‍🎓</div>
								<h3>No students yet</h3>
								<p>
									Students who select you as a practical
									trainer will appear here.
								</p>
							</div>
						) : (
							<div className="students-grid">
								{students.map((student) => (
									<div
										key={student.id}
										className={`student-card ${
											student.practicalLessons > 0
												? "student-card-active"
												: ""
										}`}
										onClick={() =>
											handleSelectStudentInfo(student)
										}
									>
										<div className="student-header">
											<div className="student-avatar">
												👨‍🎓
											</div>
											<div className="student-main-info">
												<h3 className="student-name">
													{student.name}
												</h3>
												<p className="student-course">
													{student.course}
												</p>
												<p className="student-lessons">
													Lessons:{" "}
													{student.practicalLessons ||
														0}
												</p>
												<p className="student-paid">
													Paid:{" "}
													{student.practicalPaid || 0}{" "}
													₪
												</p>
											</div>
										</div>
										<div className="student-footer">
											<span className="student-status">
												Status:{" "}
												{student.status || "practical"}
											</span>
										</div>
									</div>
								))}
							</div>
						)}

						{selectedStudent && (
							<div className="student-details-panel">
								<h3>Student Details</h3>
								<p>
									<strong>Name:</strong>{" "}
									{selectedStudent.name}
								</p>
								<p>
									<strong>Course:</strong>{" "}
									{selectedStudent.course}
								</p>
								<p>
									<strong>Lessons:</strong>{" "}
									{selectedStudent.practicalLessons || 0}
								</p>
								<p>
									<strong>Paid:</strong>{" "}
									{selectedStudent.practicalPaid || 0} ₪
								</p>
							</div>
						)}
					</section>
				)}

				{/* TAB 2: SCHEDULE */}
				{activeTab === "schedule" && (
					<section className="schedule-section">
						<div className="schedule-header">
							<h2 className="section-title">Daily Schedule</h2>
							<div className="date-picker">
								<label>Select Date:</label>
								<input
									type="date"
									value={selectedDate}
									onChange={(e) =>
										setSelectedDate(e.target.value)
									}
								/>
							</div>
						</div>

						{/* Form إضافة موعد */}
						<form
							className="add-slot-form"
							onSubmit={handleAddSlot}
						>
							<div className="form-row">
								<div className="form-field">
									<label>Time</label>
									<input
										type="time"
										value={newSlotTime}
										onChange={(e) =>
											setNewSlotTime(e.target.value)
										}
										required
									/>
								</div>

								<div className="form-field">
									<label>Student (optional)</label>
									<select
										value={newSlotStudentId}
										onChange={(e) =>
											setNewSlotStudentId(e.target.value)
										}
									>
										<option value="">No student</option>
										{students.map((st) => (
											<option key={st.id} value={st.id}>
												{st.name} — {st.course}
											</option>
										))}
									</select>
								</div>

								<div className="form-field button-field">
									<button
										type="submit"
										className="add-slot-btn"
									>
										+ Add Lesson
									</button>
								</div>
							</div>
						</form>

						{/* جدول اليوم */}
						<div className="schedule-table-wrapper">
							{getSlotsForSelectedDate().length === 0 ? (
								<div className="empty-state">
									<div className="empty-icon">📅</div>
									<h3>No lessons for this day</h3>
									<p>Add new lessons using the form above.</p>
								</div>
							) : (
								<table className="schedule-table">
									<thead>
										<tr>
											<th>Time</th>
											<th>Student</th>
											<th>Course</th>
											<th>Status</th>
											<th>Car</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>
										{getSlotsForSelectedDate().map(
											(slot) => (
												<tr key={slot.id}>
													<td>{slot.time}</td>
													<td>
														{slot.studentName ||
															"-"}
													</td>
													<td>
														{slot.course || "-"}
													</td>
													<td>
														{getStatusBadge(slot)}
													</td>
													<td>
														{slot.carId
															? `Car #${slot.carId}`
															: "-"}
													</td>
													<td className="actions-cell">
														{/* << زر Request Car هنا */}
														{(() => {
															if (!slot.studentId)
																return null;
															if (
																slot.status !==
																"booked"
															)
																return null;

															if (
																hasActiveLesson
															) {
																return (
																	<button
																		type="button"
																		className="action-btn request-btn disabled"
																		disabled
																	>
																		🚫
																		Request
																		Disabled
																	</button>
																);
															}

															return (
																<button
																	type="button"
																	className="action-btn request-btn"
																	onClick={() =>
																		handleRequestCar(
																			slot.id
																		)
																	}
																>
																	🚙 Request
																	Car
																</button>
															);
														})()}

														{/* زر Complete Lesson */}
														<button
															type="button"
															className="action-btn complete-btn"
															onClick={() =>
																handleCompleteLesson(
																	slot.id
																)
															}
															disabled={
																slot.status ===
																"completed"
															}
														>
															✅ Complete Lesson
														</button>
													</td>
												</tr>
											)
										)}
									</tbody>
								</table>
							)}
						</div>
					</section>
				)}
			</main>
		</div>
	);
};

export default TrainerDashboard;
