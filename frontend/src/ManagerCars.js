// src/ManagerCars.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ManagerCars.css';

// 🔥 السيارات الأساسية داخل الكود مباشرة
const defaultCars = [
  { id: 62, type: "Automatic", busy: false },
  { id: 72, type: "Automatic", busy: false },
  { id: 46, type: "Automatic", busy: false },
  { id: 26, type: "Automatic", busy: false },
  { id: 37, type: "Automatic", busy: false },
  { id: 92, type: "Automatic", busy: false },

  { id: 60, type: "Manual", busy: false },
  { id: 58, type: "Manual", busy: false },
  { id: 57, type: "Manual", busy: false },
  { id: 56, type: "Manual", busy: false },
  { id: 55, type: "Manual", busy: false },

  { id: 1, type: "Light Truck", busy: false },
  { id: 2, type: "Light Truck", busy: false },
  { id: 3, type: "Light Truck", busy: false },
  { id: 4, type: "Light Truck", busy: false },

  { id: 40, type: "Heavy Truck", busy: false },

  { id: 82, type: "Bus", busy: false },

  { id: 23, type: "Motorcycle", busy: false },
  { id: 43, type: "Motorcycle", busy: false },
  { id: 68, type: "Motorcycle", busy: false }
];

const ManagerCars = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);

  useEffect(() => {
    // 🔥 إذا لم يكن هناك بيانات سابقة → خزّن السيارات داخل localStorage
    const stored = localStorage.getItem('cars');

    if (!stored) {
      localStorage.setItem('cars', JSON.stringify(defaultCars));
      setCars(defaultCars);
    } else {
      setCars(JSON.parse(stored));
    }
  }, []);

  const getStatusBadge = (car) => {
    if (!car.busy)
      return <span className="badge available">🟢 Available</span>;

    return (
      <span className="badge busy">
        🔴 Busy — {car.currentTrainer} / {car.currentStudent}
      </span>
    );
  };

  const goBack = () => {
    navigate("/manager/dashboard");
  };

  return (
    <div className="cars-page">
      <header className="cars-header">
        <h1>🚗 Cars Management</h1>
        <button className="back-btn" onClick={goBack}>← Back</button>
      </header>

      <div className="cars-grid">
        {cars.map((car) => (
          <div key={car.id} className="car-card">

            <div className="car-icon">
              {car.type === "Automatic" && "🚗"}
              {car.type === "Manual" && "🚘"}
              {car.type === "Motorcycle" && "🏍️"}
              {car.type === "Light Truck" && "🚚"}
              {car.type === "Heavy Truck" && "🚛"}
              {car.type === "Bus" && "🚌"}
            </div>

            <h2 className="car-id">Car #{car.id}</h2>
            <p className="car-type">Type: {car.type}</p>

            {getStatusBadge(car)}

          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerCars;
