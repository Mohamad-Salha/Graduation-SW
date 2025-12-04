// src/TrainerProfile.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./TrainerProfile.css";

const TrainerProfile = () => {
  const { trainerName } = useParams();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    loadTrainerStudents();
    loadTrainerSchedule();
  }, [trainerName]);

  const loadTrainerStudents = () => {
    const all = JSON.parse(localStorage.getItem("students") || "[]");
    const filtered = all.filter(
      (s) => s.practicalTrainer === trainerName && s.status === "practical"
    );
    setStudents(filtered);
  };

  const loadTrainerSchedule = () => {
    const key = `trainerSchedule_${trainerName}`;
    const data = JSON.parse(localStorage.getItem(key) || "[]");
    setSchedule(data);
  };

  return (
    <div className="trainerProfilePage">
      <button className="backBtn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="headerBox">
        <h1>👨‍🏫 {trainerName}</h1>
        <p>Trainer Profile & Student Overview</p>
      </div>

      <div className="statsRow">
        <div className="statCard">
          <h3>👥 Students</h3>
          <p>{students.length}</p>
        </div>

        <div className="statCard">
          <h3>📘 Total Lessons</h3>
          <p>{schedule.length}</p>
        </div>
      </div>

      {/* STUDENTS LIST */}
      <h2 className="sectionTitle">Students</h2>
      {students.length === 0 ? (
        <p className="emptyText">No students assigned to this trainer.</p>
      ) : (
        <div className="studentsList">
          {students.map((s) => (
            <div className="studentCard" key={s.id}>
              <h3>{s.name}</h3>
              <p>Course: {s.course}</p>
              <p>Lessons Taken: {s.practicalLessons || 0}</p>
              <p>Paid: {s.practicalPaid || 0} ₪</p>
            </div>
          ))}
        </div>
      )}

      {/* SCHEDULE */}
      <h2 className="sectionTitle">Lessons Schedule</h2>
      {schedule.length === 0 ? (
        <p className="emptyText">No scheduled lessons.</p>
      ) : (
        <table className="scheduleTable">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Student</th>
              <th>Vehicle</th>
              <th>Status</th>
              <th>Car</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((slot) => (
              <tr key={slot.id}>
                <td>{slot.date}</td>
                <td>{slot.time}</td>
                <td>{slot.studentName || "-"}</td>
                <td>{slot.vehicleType || "-"}</td>
                <td>{slot.status}</td>
                <td>{slot.carId ? `#${slot.carId}` : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TrainerProfile;
