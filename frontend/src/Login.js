import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  
  const loginOptions = [
    { id: 1, label: 'Manager', icon: '👨‍💼' },
    { id: 2, label: 'Trainers', icon: '🚗' },
    { id: 3, label: 'Teachers', icon: '👨‍🏫' },
    { id: 4, label: 'Students', icon: '👨‍🎓' }
  ];

  const handleLogin = (option) => {
    navigate(`/login/${option.label}`);
  };

  return (
    <div className="login-container">
      <div className="login-overlay"></div>
      
      <div className="login-content">
        <div className="login-header">
          <div className="school-logo">🏫</div>
          <h1 className="login-title">Alaraj School</h1>
          <p className="login-subtitle">Choose account type to login</p>
        </div>

        <div className="login-options-horizontal">
          {loginOptions.map(option => (
            <div
              key={option.id}
              className="login-option-card"
              onClick={() => handleLogin(option)}
            >
              <div className="option-icon">{option.icon}</div>
              <div className="option-label">{option.label}</div>
            </div>
          ))}
        </div>

        <div className="login-divider"></div>

        <footer className="login-footer">
          <div className="footer-content">
            <div className="school-info">
              <strong>Alaraj School</strong>
              <span>|</span>
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

export default Login;