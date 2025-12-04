import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentSignup.css';

const StudentSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // التحقق من تطابق كلمة المرور
    if (formData.password !== formData.confirmPassword) {
      alert('❌ Passwords do not match!');
      return;
    }

    // التحقق من طول كلمة المرور
    if (formData.password.length < 6) {
      alert('❌ Password must be at least 6 characters long!');
      return;
    }

    const newStudent = {
      id: `student_${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password, // حفظ كلمة المرور
      applyDate: new Date().toISOString(),
      approved: false,
      status: 'pending'
    };

    const pendingStudents = JSON.parse(localStorage.getItem('pendingStudents') || '[]');
    pendingStudents.push(newStudent);
    localStorage.setItem('pendingStudents', JSON.stringify(pendingStudents));
    
    alert('✅ Registration submitted successfully!\n⏳ Please wait for manager approval.\n📧 You will be notified once approved.');
    navigate('/');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="student-signup">
      <div className="signup-overlay"></div>
      
      <div className="signup-content">
        <button className="back-button" onClick={handleBack}>
          ← Back to Home
        </button>

        <div className="signup-box">
          <div className="signup-header">
            <div className="signup-icon">👨‍🎓</div>
            <h1 className="signup-main-title">Student Sign Up</h1>
            <p className="signup-sub-title">Alaraj Driving School</p>
          </div>

          <form className="signup-inputs" onSubmit={handleSubmit}>
            <div className="signup-field">
              <label className="signup-field-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="signup-field-input"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="signup-field">
              <label className="signup-field-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="signup-field-input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="signup-field">
              <label className="signup-field-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="signup-field-input"
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div className="signup-field">
              <label className="signup-field-label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="signup-field-input"
                placeholder="Enter your password (min 6 characters)"
                minLength="6"
                required
              />
            </div>

            <div className="signup-field">
              <label className="signup-field-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="signup-field-input"
                placeholder="Confirm your password"
                minLength="6"
                required
              />
            </div>

            <button type="submit" className="signup-submit-btn">
              SIGN UP
            </button>
          </form>

          <div className="signup-footer">
            <p className="signup-footer-text">
              Already have an account? <span onClick={() => navigate('/login/Students')} className="login-link">Login here</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSignup;