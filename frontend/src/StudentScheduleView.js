import React, { useEffect, useState } from "react";
import "./StudentScheduleView.css";
import { useNavigate } from "react-router-dom";

const StudentScheduleView = () => {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [trainerSchedule, setTrainerSchedule] = useState([]);
  const [trainerName, setTrainerName] = useState("");
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    loadStudent();
  }, []);

  const loadStudent = () => {
    const studentId = localStorage.getItem("currentStudent");
    if (!studentId) return navigate("/");

    const allStudents = JSON.parse(localStorage.getItem("students") || "[]");
    const st = allStudents.find((s) => s.id === studentId);

    if (!st) return navigate("/");

    setStudent(st);
    setTrainerName(st.practicalTrainer);

    loadTrainerSchedule(st.practicalTrainer);
  };

  const loadTrainerSchedule = (trainerName) => {
    const key = `trainerSchedule_${trainerName}`;
    const stored = JSON.parse(localStorage.getItem(key) || "[]");
    setTrainerSchedule(stored);
  };

  const getSlotsForDate = () => {
    return trainerSchedule
      .filter((s) => s.date === selectedDate)
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const getStatusBadge = (slot) => {
    switch (slot.status) {
      case "available":
        return <span className="badge available">Available</span>;
      case "booked":
        return <span className="badge booked">Booked</span>;
      case "waiting-car":
        return <span className="badge waiting">Waiting Car</span>;
      case "in-progress":
        return <span className="badge progress">In Progress</span>;
      case "completed":
        return <span className="badge completed">Completed</span>;
      default:
        return <span className="badge">-</span>;
    }
  };

  const goBack = () => navigate("/student/dashboard");

  if (!student) return <div className="loading">Loading...</div>;

  return (
    <div className="schedule-page">
      <header className="schedule-header">
        <h1>📅 My Trainer Schedule</h1>
        <button className="back-btn" onClick={goBack}>← Back</button>
      </header>

      <div className="student-info-box">
        <p><strong>Student:</strong> {student.name}</p>
        <p><strong>Course:</strong> {student.course}</p>
        <p><strong>Trainer:</strong> {trainerName}</p>
      </div>

      <div className="date-select">
        <label>Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <div className="schedule-wrapper">
        {getSlotsForDate().length === 0 ? (
          <p className="empty">No lessons for this day.</p>
        ) : (
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Status</th>
                <th>Car</th>
              </tr>
            </thead>
            <tbody>
              {getSlotsForDate().map((slot) => (
                <tr
                  key={slot.id}
                  className={
                    slot.studentId === student.id ? "highlight-row" : ""
                  }
                >
                  <td>{slot.time}</td>
                  <td>{getStatusBadge(slot)}</td>
                  <td>{slot.carId ? `#${slot.carId}` : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StudentScheduleView;
