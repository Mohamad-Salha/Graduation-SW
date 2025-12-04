// src/ManagerDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ManagerDashboard.css';

const ManagerDashboard = () => {
  const navigate = useNavigate();

  const managerOptions = [
    { id: 1, label: 'Students Management', icon: '👨‍🎓', path: '/manager/students' },
    { id: 2, label: 'Teachers', icon: '👨‍🏫' }, 
    { id: 3, label: 'Trainers', icon: '🔄', path: '/manager/trainers' }, // ✔ الآن يعمل
    { id: 4, label: 'Cars', icon: '🚙', path: '/manager/cars' }
  ];

  const handleOptionClick = (option) => {
    if (option.path) {
      navigate(option.path);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentManager');
    navigate('/');
  };

  return (
    <div className="manager-dashboard">
      <div className="dashboard-overlay" />

      <div className="dashboard-content">
        <header className="dashboard-header">
          <div className="dashboard-logo">
            <span className="manager-icon">👨‍💼</span>
          </div>
          <h1 className="dashboard-title">Manager Dashboard</h1>
          <p className="dashboard-subtitle">Alaraj Driving School</p>
        </header>

        <main className="dashboard-main">
          <div className="manager-options-grid">
            {managerOptions.map((option) => (
              <button
                key={option.id}
                className="manager-option-card"
                type="button"
                onClick={() => handleOptionClick(option)}
              >
                <div className="manager-option-icon">{option.icon}</div>
                <div className="manager-option-label">{option.label}</div>
              </button>
            ))}
          </div>
        </main>

        <button className="logout-button" type="button" onClick={handleLogout}>
          Logout
        </button>

        {/* ✔ تمت إزالة الكرت الزيادة نهائيًا */}

        <footer className="dashboard-footer">
          <div className="footer-content">
            <div className="footer-contact">
              <span>📍 Alaraj Driving School</span>
              <span>0595316628</span>
              <span>|</span>
              <span>Tulkarem, Qaquon Street</span>
            </div>
            <div className="copyright">
              © 2026 Alaraj School. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ManagerDashboard;
