import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './LoginForm.css';

const LoginForm = () => {
  const { userType } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const backgroundConfig = {
    Manager: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
    Trainers: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
    Teachers: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    Students: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
  };

  const icons = {
    Manager: '👨‍💼',
    Trainers: '🚗',
    Teachers: '👨‍🏫',
    Students: '👨‍🎓'
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.username && formData.password) {
      if (userType === 'Manager') {
        // المدير يمكنه الدخول بدون موافقة
        navigate('/manager/dashboard');
      } else if (userType === 'Teachers') {
        // المعلم يمكنه الدخول بدون موافقة
        localStorage.setItem('currentTeacher', formData.username);
        navigate('/teacher/dashboard');
      } else if (userType === 'Students') {
        // التحقق من أن الطالب معتمد وكلمة المرور صحيحة
        const allStudents = JSON.parse(localStorage.getItem('students') || '[]');
        const currentStudent = allStudents.find(student => 
          student.name === formData.username && 
          student.approved === true &&
          student.password === formData.password
        );
        
        if (currentStudent) {
          // حفظ بيانات الطالب الحالي
          const currentStudentData = {
            username: formData.username,
            loginTime: Date.now()
          };
          localStorage.setItem('currentStudent', JSON.stringify(currentStudentData));
          navigate('/student/dashboard');
        } else {
          // التحقق إذا كان الطالب في قائمة الانتظار
          const pendingStudents = JSON.parse(localStorage.getItem('pendingStudents') || '[]');
          const pendingStudent = pendingStudents.find(student => 
            student.name === formData.username && 
            student.password === formData.password
          );
          
          if (pendingStudent) {
            alert('⏳ Your application is still pending approval from the manager.');
          } else {
            alert('❌ Invalid credentials or your account is not approved yet.');
          }
        }
      } else if (userType === 'Trainers') {
        localStorage.setItem('currentTrainer', formData.username);
        navigate('/trainer/dashboard');
      }
    } else {
      alert('Please enter both username and password');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleSignup = () => {
    navigate('/student/signup');
  };

  return (
    <div 
      className="form-container"
      style={{ 
        backgroundImage: `url(${backgroundConfig[userType]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="form-overlay"></div>
      
      <div className="form-content">
        <button className="form-back-button" onClick={handleBack}>
          ← Back
        </button>

        <div className="form-box">
          <div className="form-header">
            <div className="form-icon">{icons[userType]}</div>
            <h1 className="form-main-title">Login As {userType}</h1>
            <p className="form-sub-title">Alaraj Driving School System</p>
          </div>

          <form className="form-inputs" onSubmit={handleSubmit}>
            <div className="form-field">
              <label className="form-field-label">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="form-field-input"
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="form-field">
              <label className="form-field-label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-field-input"
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="form-submit-btn">
              SIGN IN
            </button>

            {/* زر Signup يظهر فقط للطلاب */}
            {userType === 'Students' && (
              <button 
                type="button" 
                className="form-signup-btn"
                onClick={handleSignup}
              >
                Don't have an account? SIGN UP
              </button>
            )}
          </form>

          <div className="form-footer">
            <p className="form-footer-text">Contact administration for login assistance</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;