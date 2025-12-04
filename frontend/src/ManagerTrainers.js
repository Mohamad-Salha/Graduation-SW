import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ManagerTrainers.css";

// 🚀 نفس المدربين الموجودين في StudentDashboard.js
const practicalTrainers = [
  { name: "عبد الرحمن", specialties: ["Manual Transmission Car", "Automatic Transmission Car", "Light Truck"] },
  { name: "احمد", specialties: ["Manual Transmission Car", "Automatic Transmission Car"] },
  { name: "محمد", specialties: ["Manual Transmission Car", "Automatic Transmission Car"] },
  { name: "عبد الكريم", specialties: ["Manual Transmission Car", "Automatic Transmission Car"] },
  { name: "جهاد", specialties: ["Manual Transmission Car", "Automatic Transmission Car"] },
  { name: "لينا", specialties: ["Manual Transmission Car", "Automatic Transmission Car"] },
  { name: "امل", specialties: ["Manual Transmission Car", "Automatic Transmission Car"] },
  { name: "رينا", specialties: ["Manual Transmission Car", "Automatic Transmission Car"] },
  { name: "ايمن", specialties: ["Manual Transmission Car", "Automatic Transmission Car", "Light Truck"] },
  { name: "ايوب", specialties: ["Manual Transmission Car", "Automatic Transmission Car", "Light Truck"] },
  { name: "سمير", specialties: ["Heavy Truck", "Trailer", "Bus"] }
];

const ManagerTrainers = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [cars, setCars] = useState([]);
  const [carRequests, setCarRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    setStudents(JSON.parse(localStorage.getItem("students") || "[]"));
    setCars(JSON.parse(localStorage.getItem("cars") || "[]"));

    let reqs = localStorage.getItem("carRequests");
    try { reqs = reqs ? JSON.parse(reqs) : []; }
    catch { reqs = []; }
    setCarRequests(Array.isArray(reqs) ? reqs : []);
  }, []);

  const getStudentsCount = (trainerName) =>
    students.filter((s) => s.practicalTrainer === trainerName).length;

  const getTrainerPendingRequest = (trainerName) =>
    carRequests.find((req) => req.trainer === trainerName && req.status === "pending");

  const getAvailableCars = (vehicleType) =>
    cars.filter((car) => car.type === vehicleType && !car.busy);

  const assignCar = (carId) => {
    const req = selectedRequest;
    if (!req) return;

    const updatedCars = cars.map((c) =>
      c.id === carId
        ? {
            ...c,
            busy: true,
            currentTrainer: req.trainer,
            currentStudent: req.studentName,
            releaseTime: Date.now() + 50 * 60000
          }
        : c
    );

    localStorage.setItem("cars", JSON.stringify(updatedCars));
    setCars(updatedCars);

    const key = `trainerSchedule_${req.trainer}`;
    const schedule = JSON.parse(localStorage.getItem(key) || "[]");

    const updatedSchedule = schedule.map((slot) =>
      slot.id === req.slotId
        ? { ...slot, status: "in-progress", carId: carId }
        : slot
    );

    localStorage.setItem(key, JSON.stringify(updatedSchedule));

    const updatedReqs = carRequests.map((r) =>
      r.id === req.id ? { ...r, status: "approved" } : r
    );

    localStorage.setItem("carRequests", JSON.stringify(updatedReqs));
    setCarRequests(updatedReqs);

    setSelectedRequest(null);
    alert(`🚗 تمت الموافقة على سيارة رقم ${carId} للمدرب ${req.trainer}`);
  };

  return (
    <div className="trainers-page">
      <header className="trainers-header">
        <h1>👨‍🏫 Trainers Management</h1>
        <button className="back-btn" onClick={() => navigate("/manager/dashboard")}>
          ← Back
        </button>
      </header>

      <div className="trainers-grid">
        {practicalTrainers.map((trainer) => {
          const req = getTrainerPendingRequest(trainer.name);

          return (
            <div
              className="trainer-card"
              key={trainer.name}

              // ⭐⭐⭐ إضافة التنقل عند الضغط على المدرب ⭐⭐⭐
              onClick={() => navigate(`/trainer/profile/${trainer.name}`)}
            >
              <h2>{trainer.name}</h2>
              <p>Students: {getStudentsCount(trainer.name)}</p>
              <p>Licenses: {trainer.specialties.join(" - ")}</p>

              {req ? (
                <p className="req-alert">🚗 Car Requested!</p>
              ) : (
                <p className="req-none">No requests</p>
              )}

              {req && (
                <button
                  className="approve-btn"
                  onClick={(e) => {
                    e.stopPropagation(); // 🔥 حتى لا يفتح صفحة البروفايل عند الضغط على الزر
                    setSelectedRequest(req);
                  }}
                >
                  Approve Request
                </button>
              )}
            </div>
          );
        })}
      </div>

      {selectedRequest && (
        <div className="popup">
          <div className="popup-box">
            <h2>Select Car</h2>

            <p>Trainer: <strong>{selectedRequest.trainer}</strong></p>
            <p>Vehicle Type: <strong>{selectedRequest.vehicleType}</strong></p>

            <div className="cars-list">
              {getAvailableCars(selectedRequest.vehicleType).length === 0 ? (
                <p>No available cars</p>
              ) : (
                getAvailableCars(selectedRequest.vehicleType).map((car) => (
                  <button key={car.id} className="car-btn" onClick={() => assignCar(car.id)}>
                    Car #{car.id}
                  </button>
                ))
              )}
            </div>

            <button className="close-btn" onClick={() => setSelectedRequest(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerTrainers;
