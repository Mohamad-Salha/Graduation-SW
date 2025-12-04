// src/StudentDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';

const PRACTICAL_LESSON_PRICE = 90;

const StudentDashboard = () => {
  const navigate = useNavigate();

  const [showCourses, setShowCourses] = useState(false);
  const [showInstructors, setShowInstructors] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showPracticalPanel, setShowPracticalPanel] = useState(false);
  const [showTrainerSelection, setShowTrainerSelection] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [hasSelectedCourse, setHasSelectedCourse] = useState(false);

  const [studentName, setStudentName] = useState('');
  const [studentStatus, setStudentStatus] = useState('theoretical');
  const [hasPassedExam, setHasPassedExam] = useState(false);

  const [studentProgress, setStudentProgress] = useState(0);
  const [passCount, setPassCount] = useState(0);

  const [practicalTrainer, setPracticalTrainer] = useState(null);
  const [practicalLessons, setPracticalLessons] = useState(0);
  const [practicalPaid, setPracticalPaid] = useState(0);
  const [myPracticalLessons, setMyPracticalLessons] = useState([]);

  useEffect(() => {
    
    const currentStudentData = JSON.parse(localStorage.getItem('currentStudent') || '{}');

    if (!currentStudentData.username) {
      navigate('/login/Students');
      return;
    }

    setStudentName(currentStudentData.username);

    const allStudents = JSON.parse(localStorage.getItem('students') || '[]');
    const currentStudent = allStudents.find(
      (s) => s.name === currentStudentData.username
    );

    if (currentStudent) {
      setStudentStatus(currentStudent.status || 'theoretical');
      setHasPassedExam(!!currentStudent.examPassed);

      if (currentStudent.course && currentStudent.course !== 'Not Selected Yet') {
        setSelectedCourse(currentStudent.course);
        setSelectedInstructor({ name: currentStudent.instructor });
        setHasSelectedCourse(true);
        calculateStudentProgress(currentStudent);
      } else {
        const savedCourse = localStorage.getItem(
          `selectedCourse_${currentStudentData.username}`
        );
        const savedInstructor = localStorage.getItem(
          `selectedInstructor_${currentStudentData.username}`
        );
        if (savedCourse && savedInstructor) {
          setSelectedCourse(savedCourse);
          setSelectedInstructor(JSON.parse(savedInstructor));
          setHasSelectedCourse(true);
        }
      }

      setPracticalTrainer(currentStudent.practicalTrainer || null);
      setPracticalLessons(currentStudent.practicalLessons || 0);
      setPracticalPaid(currentStudent.practicalPaid || 0);

      // إذا نجح في الامتحان النظري ولم يختر مدرب عملي بعد
      if (currentStudent.examPassed && !currentStudent.practicalTrainer) {
        setShowTrainerSelection(true);
      }
    } else {
      // لم يتم إنشاء سجل لهذا الطالب بعد – فقط حاول استرجاع اختيار الكورس
      const savedCourse = localStorage.getItem(
        `selectedCourse_${currentStudentData.username}`
      );
      const savedInstructor = localStorage.getItem(
        `selectedInstructor_${currentStudentData.username}`
      );
      if (savedCourse && savedInstructor) {
        setSelectedCourse(savedCourse);
        setSelectedInstructor(JSON.parse(savedInstructor));
        setHasSelectedCourse(true);
      }
    }
  }, [navigate]);

  const calculateStudentProgress = (student) => {
    let count = 0;
    if (student.trafficSigns) count++;
    if (student.trafficLaws) count++;
    if (student.carMechanics) count++;
    if (student.quiz) count++;

    setPassCount(count);
    setStudentProgress(count * 25);
  };

  const courses = [
    {
      type: 'Manual Transmission Car',
      icon: '🚗',
      color: '#6366f1',
      description: 'Learn to drive manual transmission vehicles',
    },
    {
      type: 'Automatic Transmission Car',
      icon: '🚙',
      color: '#10b981',
      description: 'Learn to drive automatic transmission vehicles',
    },
    {
      type: 'Motorcycle',
      icon: '🏍️',
      color: '#f59e0b',
      description: 'Learn to ride motorcycles',
    },
    {
      type: 'Light Truck',
      icon: '🚐',
      color: '#ec4899',
      description: 'Learn to drive light trucks',
    },
    {
      type: 'Heavy Truck',
      icon: '🚛',
      color: '#8b5cf6',
      description: 'Learn to drive heavy trucks',
    },
    {
      type: 'Trailer',
      icon: '🚚',
      color: '#06b6d4',
      description: 'Learn to drive trailers',
    },
    {
      type: 'Bus',
      icon: '🚌',
      color: '#dc2626',
      description: 'Learn to drive buses',
    },
  ];

  const instructors = [
    {
      name: 'Suliman',
      schedule: 'Sunday, Monday, Tuesday',
      time: '8:00 AM - 10:00 AM',
      icon: '👨‍🏫',
      color: '#6366f1',
      rating: '4.9',
      experience: '5 years',
      specialties: ['All Vehicle Types'],
    },
    {
      name: 'Majed',
      schedule: 'Sunday, Monday, Tuesday',
      time: '2:00 PM - 4:00 PM',
      icon: '👨‍💼',
      color: '#10b981',
      rating: '4.8',
      experience: '4 years',
      specialties: ['All Vehicle Types'],
    },
  ];

  // المدربين العمليين حسب ما أعطيتني
  const practicalTrainers = [
    {
      name: 'عبد الرحمن',
      specialties: ['Manual Transmission Car', 'Automatic Transmission Car', 'Light Truck'],
      icon: '🚗',
      color: '#1d4ed8',
      experience: '7 سنوات',
    },
    {
      name: 'احمد',
      specialties: ['Manual Transmission Car', 'Automatic Transmission Car'],
      icon: '🚗',
      color: '#16a34a',
      experience: '5 سنوات',
    },
    {
      name: 'محمد',
      specialties: ['Manual Transmission Car', 'Automatic Transmission Car'],
      icon: '🚗',
      color: '#22c55e',
      experience: '4 سنوات',
    },
    {
      name: 'عبد الكريم',
      specialties: ['Manual Transmission Car', 'Automatic Transmission Car'],
      icon: '🚗',
      color: '#0ea5e9',
      experience: '4 سنوات',
    },
    {
      name: 'جهاد',
      specialties: ['Manual Transmission Car', 'Automatic Transmission Car'],
      icon: '🚗',
      color: '#6366f1',
      experience: '6 سنوات',
    },
    {
      name: 'لينا',
      specialties: ['Manual Transmission Car', 'Automatic Transmission Car'],
      icon: '🚗',
      color: '#ec4899',
      experience: '3 سنوات',
    },
    {
      name: 'امل',
      specialties: ['Manual Transmission Car', 'Automatic Transmission Car'],
      icon: '🚗',
      color: '#f97316',
      experience: '3 سنوات',
    },
    {
      name: 'رينا',
      specialties: ['Manual Transmission Car', 'Automatic Transmission Car'],
      icon: '🚗',
      color: '#a855f7',
      experience: '4 سنوات',
    },
    {
      name: 'ايمن',
      specialties: ['Manual Transmission Car', 'Automatic Transmission Car', 'Light Truck'],
      icon: '🚗',
      color: '#22c55e',
      experience: '6 سنوات',
    },
    {
      name: 'ايوب',
      specialties: ['Manual Transmission Car', 'Automatic Transmission Car', 'Light Truck'],
      icon: '🚗',
      color: '#0f766e',
      experience: '5 سنوات',
    },
    {
      name: 'سمير',
      specialties: ['Heavy Truck', 'Trailer', 'Bus'],
      icon: '🚛',
      color: '#7c3aed',
      experience: '10 سنوات (شحن وباص)',
    },
  ];

  const getEligibleTrainers = () => {
    if (!selectedCourse) return [];
    return practicalTrainers.filter((t) => t.specialties.includes(selectedCourse));
  };

  const getSelectedCourseIcon = () => {
    const course = courses.find((c) => c.type === selectedCourse);
    return course ? course.icon : '🎓';
  };

  const getSelectedCourseColor = () => {
    const course = courses.find((c) => c.type === selectedCourse);
    return course ? course.color : '#6366f1';
  };

  const handleLogout = () => {
    localStorage.removeItem('currentStudent');
    navigate('/');
  };

  const handleBackToDashboard = () => {
    setShowCourses(false);
    setShowInstructors(false);
    setShowSchedule(false);
    setShowPracticalPanel(false);
    setShowTrainerSelection(false);
  };

  const handleCourseSelect = (courseType) => {
    setSelectedCourse(courseType);
    setShowInstructors(true);
  };

  const handleInstructorSelect = (instructor) => {
    const currentStudentData = JSON.parse(localStorage.getItem('currentStudent') || '{}');
    const studentUsername = currentStudentData.username;

    if (!studentUsername) {
      alert('Error: Student data not found. Please login again.');
      return;
    }

    const allStudents = JSON.parse(localStorage.getItem('students') || '[]');

    let studentExists = false;
    const updatedStudents = allStudents.map((student) => {
      if (student.name === studentUsername) {
        studentExists = true;
        return {
          ...student,
          course: selectedCourse,
          instructor: instructor.name,
          courseSelected: true,
          status: student.status || 'theoretical',
        };
      }
      return student;
    });

    if (!studentExists) {
      const newStudent = {
        id: `${studentUsername}_${Date.now()}`,
        name: studentUsername,
        course: selectedCourse,
        instructor: instructor.name,
        trafficSigns: false,
        trafficLaws: false,
        carMechanics: false,
        quiz: false,
        readyForExam: false,
        approved: true,
        courseSelected: true,
        status: 'theoretical',
        examPassed: false,
        practicalExam: false,
        practicalTrainer: null,
        practicalLessons: 0,
        practicalPaid: 0,
      };
      updatedStudents.push(newStudent);
    }

    localStorage.setItem('students', JSON.stringify(updatedStudents));

    setSelectedInstructor(instructor);
    setHasSelectedCourse(true);

    localStorage.setItem(`selectedCourse_${studentUsername}`, selectedCourse);
    localStorage.setItem(
      `selectedInstructor_${studentUsername}`,
      JSON.stringify(instructor)
    );

    setShowInstructors(false);
    setShowCourses(false);

    alert(`✅ Successfully selected: ${selectedCourse} with Instructor: ${instructor.name}`);
  };

  const handlePracticalClick = () => {
    if (!hasSelectedCourse) {
      alert('Please select a theoretical course first from the Courses section');
      return;
    }
    setShowSchedule(true);
    setShowPracticalPanel(false);
  };

  const handleTheoreticalClick = () => {
    setShowCourses(true);
    setShowPracticalPanel(false);
    setShowSchedule(false);
  };

  const handlePracticalPanelClick = () => {
  if (!hasPassedExam) {
    alert('يجب أن تجتاز الامتحان النظري أولاً قبل البدء بالمرحلة العملية.');
    return;
  }

  if (!practicalTrainer) {
    setShowTrainerSelection(true);
  } else {
    setShowPracticalPanel(true);
    setShowSchedule(false);
    setShowCourses(false);
    setShowInstructors(false);
    loadStudentLessons();   // ← هنا الإضافة
  }
};

  const handleBackToCourses = () => {
    setShowInstructors(false);
  };

  const handlePracticalTrainerSelect = (trainer) => {
    const currentStudentData = JSON.parse(localStorage.getItem('currentStudent') || '{}');
    const studentUsername = currentStudentData.username;
    if (!studentUsername) {
      alert('Error: Student data not found. Please login again.');
      return;
    }

    const allStudents = JSON.parse(localStorage.getItem('students') || '[]');
    const updatedStudents = allStudents.map((student) => {
      if (student.name === studentUsername) {
        return {
          ...student,
          status: 'practical',
          practicalExam: true,
          practicalTrainer: trainer.name,
          practicalLessons: student.practicalLessons || 0,
          practicalPaid: student.practicalPaid || 0,
        };
      }
      return student;
    });

    localStorage.setItem('students', JSON.stringify(updatedStudents));

    setStudentStatus('practical');
    setPracticalTrainer(trainer.name);
    setShowTrainerSelection(false);
    setShowPracticalPanel(true);

    alert(`✅ تم اختيار المدرب ${trainer.name} للتدريب العملي الخاص بك`);
  };

  const handleAddPracticalLesson = () => {
    const currentStudentData = JSON.parse(localStorage.getItem('currentStudent') || '{}');
    const studentUsername = currentStudentData.username;
    if (!studentUsername) return;

    const newLessons = practicalLessons + 1;

    const allStudents = JSON.parse(localStorage.getItem('students') || '[]');
    const updatedStudents = allStudents.map((student) => {
      if (student.name === studentUsername) {
        return {
          ...student,
          practicalLessons: newLessons,
        };
      }
      return student;
    });

    localStorage.setItem('students', JSON.stringify(updatedStudents));
    setPracticalLessons(newLessons);
  };

  const practicalTotal = practicalLessons * PRACTICAL_LESSON_PRICE;
  const practicalRemaining = practicalTotal - practicalPaid;
  const loadStudentLessons = () => {
  if (!practicalTrainer || !studentName) return;

  const key = `trainerSchedule_${practicalTrainer}`;
  const schedule = JSON.parse(localStorage.getItem(key) || '[]');

  const filtered = schedule.filter(
    (slot) => slot.studentName === studentName
  );

  setMyPracticalLessons(filtered);
};

  // ================== VIEWS ==================

  // اختيار المدرب العملي (مرة واحدة بعد النجاح في النظري)
  if (showTrainerSelection) {
    const eligible = getEligibleTrainers();

    return (
      <div className="student-dashboard instructors-page">
        <div className="dashboard-container">
          <div className="glass-card">
            <div className="dashboard-header">
              <div className="header-content">
                <div className="title-section">
                  <h1 className="dashboard-title">اختيار المدرب العملي</h1>
                  <p className="dashboard-subtitle">
                    لقد اجتزت الامتحان النظري ✅ اختر الآن المدرب العملي المناسب لنوع رخصتك.
                  </p>
                </div>
                <div className="progress-steps">
                  <div className="step active">نظري</div>
                  <div className="step active">امتحان</div>
                  <div className="step active">مدرب عملي</div>
                </div>
              </div>
            </div>

            {selectedCourse ? (
              <div className="instructors-grid">
                {eligible.length > 0 ? (
                  eligible.map((trainer, index) => (
                    <div
                      key={index}
                      className="instructor-card glass-card hover-lift"
                      onClick={() => handlePracticalTrainerSelect(trainer)}
                    >
                      <div className="instructor-header">
                        <div
                          className="instructor-avatar"
                          style={{ backgroundColor: trainer.color }}
                        >
                          {trainer.icon}
                        </div>
                        <div className="instructor-info">
                          <h3 className="instructor-name">{trainer.name}</h3>
                          <div className="instructor-rating">
                            <span className="stars">★★★★★</span>
                            <span className="rating-text">{trainer.experience}</span>
                          </div>
                        </div>
                      </div>

                      <div className="instructor-details">
                        <div className="detail-item">
                          <span className="detail-icon">🚘</span>
                          <div className="detail-content">
                            <span className="detail-label">يدرب على</span>
                            <span className="detail-value">
                              {trainer.specialties.join(', ')}
                            </span>
                          </div>
                        </div>
                        <div className="detail-item">
                          <span className="detail-icon">⏱️</span>
                          <div className="detail-content">
                            <span className="detail-label">مدة الحصة</span>
                            <span className="detail-value">50 دقيقة</span>
                          </div>
                        </div>
                        <div className="detail-item">
                          <span className="detail-icon">💰</span>
                          <div className="detail-content">
                            <span className="detail-label">سعر الحصة</span>
                            <span className="detail-value">
                              {PRACTICAL_LESSON_PRICE} ₪
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="select-instructor-btn">اختر هذا المدرب</div>
                    </div>
                  ))
                ) : (
                  <div className="no-students">
                    <div className="no-students-icon">😕</div>
                    <h3>لا يوجد مدربون مناسبون لهذا النوع من الرخصة حالياً</h3>
                    <p>رجاءً تواصل مع الإدارة.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="no-students">
                <div className="no-students-icon">📝</div>
                <h3>لم تقم باختيار نوع الرخصة بعد</h3>
                <p>اذهب أولاً إلى My Courses واختر نوع الرخصة.</p>
              </div>
            )}

            <div className="action-buttons">
              <button className="back-button glass-button" onClick={handleBackToDashboard}>
                ← Back to Dashboard
              </button>
              <button className="logout-button glass-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // جدول المواعيد النظري
  if (showSchedule && selectedInstructor) {
    return (
      <div className="student-dashboard schedule-page">
        <div className="dashboard-container">
          <div className="glass-card">
            <div className="dashboard-header">
              <div className="header-content">
                <div className="title-section">
                  <h1 className="dashboard-title">Appointment Schedule</h1>
                  <p className="dashboard-subtitle">
                    Your theoretical training timetable
                  </p>
                </div>
                <div className="user-badge">
                  <span className="user-avatar">👨‍🎓</span>
                  <span className="user-name">{studentName}</span>
                </div>
              </div>
            </div>

            <div className="selected-info-grid">
              <div className="info-card gradient-card">
                <div className="info-icon">📅</div>
                <div className="info-content">
                  <h3>Schedule Period</h3>
                  <p>{selectedInstructor.time}</p>
                </div>
              </div>
              <div className="info-card gradient-card">
                <div className="info-icon">{getSelectedCourseIcon()}</div>
                <div className="info-content">
                  <h3>License Type</h3>
                  <p>{selectedCourse}</p>
                </div>
              </div>
              <div className="info-card gradient-card">
                <div className="info-icon">👨‍🏫</div>
                <div className="info-content">
                  <h3>Instructor</h3>
                  <p>{selectedInstructor.name}</p>
                </div>
              </div>
            </div>

            <div className="schedule-timeline">
              <h2 className="timeline-title">This Week's Schedule</h2>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h4>Sunday</h4>
                    <p>Traffic Signs & Road Safety</p>
                    <span className="timeline-time">{selectedInstructor.time}</span>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h4>Monday</h4>
                    <p>Traffic Laws & Regulations</p>
                    <span className="timeline-time">{selectedInstructor.time}</span>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h4>Tuesday</h4>
                    <p>Car Mechanics & Maintenance</p>
                    <span className="timeline-time">{selectedInstructor.time}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button className="back-button glass-button" onClick={handleBackToDashboard}>
                ← Back to Dashboard
              </button>
              <button className="logout-button glass-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // اختيار المدرس النظري
  if (showInstructors) {
    return (
      <div className="student-dashboard instructors-page">
        <div className="dashboard-container">
          <div className="glass-card">
            <div className="dashboard-header">
              <div className="header-content">
                <div className="title-section">
                  <h1 className="dashboard-title">Choose Your Instructor</h1>
                  <p className="dashboard-subtitle">
                    Select the best instructor for your {selectedCourse} course
                  </p>
                </div>
                <div className="progress-steps">
                  <div className="step active">1</div>
                  <div className="step active">2</div>
                  <div className="step">3</div>
                </div>
              </div>
            </div>

            <div className="instructors-grid">
              {instructors.map((instructor, index) => (
                <div
                  key={index}
                  className="instructor-card glass-card hover-lift"
                  onClick={() => handleInstructorSelect(instructor)}
                >
                  <div className="instructor-header">
                    <div
                      className="instructor-avatar"
                      style={{ backgroundColor: instructor.color }}
                    >
                      {instructor.icon}
                    </div>
                    <div className="instructor-info">
                      <h3 className="instructor-name">{instructor.name}</h3>
                      <div className="instructor-rating">
                        <span className="stars">★★★★★</span>
                        <span className="rating-text">{instructor.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="instructor-details">
                    <div className="detail-item">
                      <span className="detail-icon">⏰</span>
                      <div className="detail-content">
                        <span className="detail-label">Available Time</span>
                        <span className="detail-value">{instructor.time}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">📅</span>
                      <div className="detail-content">
                        <span className="detail-label">Training Days</span>
                        <span className="detail-value">{instructor.schedule}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">🎯</span>
                      <div className="detail-content">
                        <span className="detail-label">Experience</span>
                        <span className="detail-value">{instructor.experience}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">🚗</span>
                      <div className="detail-content">
                        <span className="detail-label">Specialties</span>
                        <span className="detail-value">
                          {instructor.specialties.join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="select-instructor-btn">Choose Instructor</div>
                </div>
              ))}
            </div>

            <div className="action-buttons">
              <button className="back-button glass-button" onClick={handleBackToCourses}>
                ← Back to Courses
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // صفحة اختيار نوع الرخصة (الكورس النظري)
  if (showCourses) {
    if (hasSelectedCourse) {
      return (
        <div className="student-dashboard selected-course-page">
          <div className="dashboard-container">
            <div className="glass-card">
              <div className="dashboard-header">
                <div className="header-content">
                  <div className="title-section">
                    <h1 className="dashboard-title">Your Selected Course</h1>
                    <p className="dashboard-subtitle">Course details and progress</p>
                  </div>
                  <div className="status-badge active">
                    <span className="status-dot"></span>
                    Active
                  </div>
                </div>
              </div>

              <div className="course-details-card">
                <div className="course-icon-large" style={{ color: getSelectedCourseColor() }}>
                  {getSelectedCourseIcon()}
                </div>
                <div className="course-info">
                  <h2 className="course-title">{selectedCourse}</h2>
                  <p className="course-instructor">
                    with Instructor {selectedInstructor?.name || 'N/A'}
                  </p>
                  <div className="progress-stats">
                    <div className="progress-item">
                      <span className="progress-label">Course Progress</span>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${studentProgress}%` }}
                        ></div>
                      </div>
                      <span className="progress-percent">{studentProgress}%</span>
                    </div>
                  </div>
                  <div className="pass-count">
                    <span>Passes: {passCount}/4</span>
                    <div className="pass-breakdown">
                      <span className={`pass-item ${passCount >= 1 ? 'completed' : ''}`}>
                        Traffic Signs
                      </span>
                      <span className={`pass-item ${passCount >= 2 ? 'completed' : ''}`}>
                        Traffic Laws
                      </span>
                      <span className={`pass-item ${passCount >= 3 ? 'completed' : ''}`}>
                        Car Mechanics
                      </span>
                      <span className={`pass-item ${passCount >= 4 ? 'completed' : ''}`}>
                        Final Quiz
                      </span>
                    </div>
                  </div>
                  {hasPassedExam && (
                    <div className="exam-passed-banner">
                      🎉 You have passed the theoretical exam. Practical training is now available.
                    </div>
                  )}
                </div>
              </div>

              <div className="action-buttons">
                <button className="back-button glass-button" onClick={handleBackToDashboard}>
                  ← Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="student-dashboard courses-page">
        <div className="dashboard-container">
          <div className="glass-card">
            <div className="dashboard-header">
              <div className="header-content">
                <div className="title-section">
                  <h1 className="dashboard-title">Choose Your Vehicle Type</h1>
                  <p className="dashboard-subtitle">
                    Select the vehicle you want to learn driving
                  </p>
                </div>
                <div className="progress-steps">
                  <div className="step active">1</div>
                  <div className="step">2</div>
                  <div className="step">3</div>
                </div>
              </div>
            </div>

            <div className="courses-grid">
              {courses.map((course, index) => (
                <div
                  key={index}
                  className="course-card glass-card hover-lift"
                  onClick={() => handleCourseSelect(course.type)}
                  style={{ '--course-color': course.color }}
                >
                  <div className="course-icon" style={{ color: course.color }}>
                    {course.icon}
                  </div>
                  <h3 className="course-title">{course.type}</h3>
                  <p className="course-description">{course.description}</p>
                  <div className="select-course-btn">Select Vehicle</div>
                </div>
              ))}
            </div>

            <div className="action-buttons">
              <button className="back-button glass-button" onClick={handleBackToDashboard}>
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // صفحة التدريب العملي للطالب
  if (showPracticalPanel) {
    return (
      <div className="student-dashboard schedule-page">
        <div className="dashboard-container">
          <div className="glass-card">
            <div className="dashboard-header">
              <div className="header-content">
                <div className="title-section">
                  <h1 className="dashboard-title">Practical Training</h1>
                  <p className="dashboard-subtitle">
                    Track your practical lessons, payments, and trainer information
                  </p>
                </div>
                <div className="user-badge">
                  <span className="user-avatar">🚗</span>
                  <span className="user-name">{studentName}</span>
                </div>
              </div>
            </div>

            <div className="selected-info-grid">
              <div className="info-card gradient-card">
                <div className="info-icon">👨‍🏫</div>
                <div className="info-content">
                  <h3>Trainer</h3>
                  <p>{practicalTrainer || 'Not selected yet'}</p>
                </div>
              </div>
              <div className="info-card gradient-card">
                <div className="info-icon">{getSelectedCourseIcon()}</div>
                <div className="info-content">
                  <h3>License Type</h3>
                  <p>{selectedCourse}</p>
                </div>
              </div>
              <div className="info-card gradient-card">
                <div className="info-icon">📚</div>
                <div className="info-content">
                  <h3>Lessons Completed</h3>
                  <p>{practicalLessons} lessons</p>
                </div>
              </div>
            </div>

            <div className="schedule-timeline">
              <h2 className="timeline-title">Financial Summary</h2>
              {/* حصص الطالب العملية */}
<div className="schedule-timeline">
  <h2 className="timeline-title">Your Practical Lessons</h2>

  {myPracticalLessons.length === 0 ? (
    <p>No lessons scheduled yet.</p>
  ) : (
    <div className="timeline">
      {myPracticalLessons.map((lesson) => (
        <div className="timeline-item" key={lesson.id}>
          <div className="timeline-marker"></div>
          <div className="timeline-content">
            <h4>{lesson.date} — {lesson.time}</h4>
            <p>Trainer: {practicalTrainer}</p>
            <p>Vehicle: {lesson.vehicleType}</p>
            <p>Status: {lesson.status}</p>

            {lesson.carId ? (
              <p style={{ color: '#4f46e5', fontWeight: '700' }}>
                🚗 Car Assigned: #{lesson.carId}
              </p>
            ) : (
              <p style={{ opacity: 0.7 }}>Waiting for car assignment…</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )}
</div>

              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h4>Lesson Price</h4>
                    <p>Each practical lesson (50 min)</p>
                    <span className="timeline-time">{PRACTICAL_LESSON_PRICE} ₪</span>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h4>Total Amount (so far)</h4>
                    <p>lessons × price</p>
                    <span className="timeline-time">{practicalTotal} ₪</span>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h4>Remaining</h4>
                    <p>after payments recorded by manager</p>
                    <span className="timeline-time">{practicalRemaining} ₪</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button className="back-button glass-button" onClick={handleBackToDashboard}>
                ← Back to Dashboard
              </button>
              
              <button className="logout-button glass-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // الصفحة الرئيسية للطالب
  return (
    <div className="student-dashboard main-dashboard">
      <div className="dashboard-container">
        <div className="glass-card">
          <div className="dashboard-header">
            <div className="header-content">
              <div className="title-section">
                <h1 className="dashboard-title">Student Dashboard</h1>
                <p className="dashboard-subtitle">
                  Welcome back, {studentName}! Ready to continue your driving journey?
                </p>
              </div>
              <div className="user-badge">
                <span className="user-avatar">👨‍🎓</span>
                <span className="user-name">{studentName}</span>
              </div>
            </div>
          </div>

          {hasSelectedCourse && (
            <div className="current-course-banner">
              <div className="banner-content">
                <div className="banner-icon">{getSelectedCourseIcon()}</div>
                <div className="banner-info">
                  <h3>Current Course</h3>
                  <p>
                    {selectedCourse} with {selectedInstructor?.name || 'N/A'}
                  </p>
                  <div className="progress-display-banner">
                    <div className="progress-bar-banner">
                      <div
                        className="progress-fill-banner"
                        style={{ width: `${studentProgress}%` }}
                      ></div>
                    </div>
                    <span className="progress-text-banner">
                      {studentProgress}% Complete ({passCount}/4 passes)
                    </span>
                  </div>
                  {hasPassedExam && (
                    <div className="exam-passed-banner">
                      🎉 You have passed the theoretical exam. Practical training is now available.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="dashboard-actions">
            <div
              className="action-card primary-card hover-lift"
              onClick={handlePracticalClick}
            >
              <div className="action-icon">📅</div>
              <div className="action-content">
                <h3>Theoretical Schedule</h3>
                <p>View your theoretical training timetable and sessions</p>
              </div>
              <div className="action-arrow">→</div>
            </div>

            <div
              className="action-card secondary-card hover-lift"
              onClick={handleTheoreticalClick}
            >
              <div className="action-icon">🎓</div>
              <div className="action-content">
                <h3>My Courses</h3>
                <p>
                  {hasSelectedCourse
                    ? `Manage your ${selectedCourse} license`
                    : 'Choose your vehicle type and instructor'}
                </p>
              </div>
              <div className="action-arrow">→</div>
            </div>

            <div
              className="action-card secondary-card hover-lift"
              onClick={handlePracticalPanelClick}
            >
              <div className="action-icon">🚗</div>
              <div className="action-content">
                <h3>Practical Training</h3>
                <p>
                  {hasPassedExam
                    ? practicalTrainer
                      ? `Trainer: ${practicalTrainer} | Lessons: ${practicalLessons}`
                      : 'Choose your practical trainer'
                    : 'Available after passing theoretical exam'}
                </p>
              </div>
              <div className="action-arrow">→</div>
            </div>

            <div className="quick-stats">
              <div className="stat-card">
                <div className="stat-icon">⏱️</div>
                <div className="stat-content">
                  <span className="stat-number">{practicalLessons}</span>
                  <span className="stat-label">Practical Lessons</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📚</div>
                <div className="stat-content">
                  <span className="stat-number">{passCount}</span>
                  <span className="stat-label">Theoretical Passes</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-content">
                  <span className="stat-number">{studentProgress}%</span>
                  <span className="stat-label">Theoretical Progress</span>
                </div>
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button className="logout-button glass-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
