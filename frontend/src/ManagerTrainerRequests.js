// src/TrainerDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TrainerDashboard.css';

const AUTOMATIC_PRICE = 90;
const MANUAL_PRICE = 90;
const MOTORCYCLE_PRICE = 90;
const OTHER_VEHICLE_PRICE = 110;

// تحويل اسم الكورس إلى نوع المركبة
const mapCourseToVehicleType = (course) => {
  if (!course) return null;

  if (course.includes('Automatic')) return 'Automatic';
  if (course.includes('Manual')) return 'Manual';
  if (course.includes('Motorcycle')) return 'Motorcycle';
  if (course.includes('Light Truck')) return 'Light Truck';
  if (course.includes('Heavy Truck')) return 'Heavy Truck';
  if (course.includes('Bus')) return 'Bus';
  if (course.includes('Trailer')) return 'Trailer';

  return null;
};

const getLessonPrice = (course) => {
  const type = mapCourseToVehicleType(course);
  if (!type) return AUTOMATIC_PRICE;

  if (type === 'Automatic' || type === 'Manual' || type === 'Motorcycle') {
    return AUTOMATIC_PRICE;
  }
  return OTHER_VEHICLE_PRICE;
};

const TrainerDashboard = () => {
  const navigate = useNavigate();
  const [currentTrainer, setCurrentTrainer] = useState('');
  const [activeTab, setActiveTab] = useState('students');

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toISOString().split('T')[0]
  );
  const [scheduleSlots, setScheduleSlots] = useState([]);
  const [newSlotTime, setNewSlotTime] = useState('');
  const [newSlotStudentId, setNewSlotStudentId] = useState('');

  const [carRequests, setCarRequests] = useState([]);

  // تحميل المدرب + الطلاب + الجدول + الطلبات
  useEffect(() => {
    const trainerName = localStorage.getItem('currentTrainer');
    if (!trainerName) {
      navigate('/login/Trainers');
      return;
    }

    setCurrentTrainer(trainerName);
    loadStudents(trainerName);
    loadSchedule(trainerName);
    loadCarRequests();
  }, [navigate]);

  // تحميل الطلاب
  const loadStudents = (trainerName) => {
    const allStudents = JSON.parse(localStorage.getItem('students') || '[]');

    const trainerStudents = allStudents.filter((s) => {
      const isPractical = s.status === 'practical';
      const hasTrainer = s.practicalTrainer === trainerName;
      return isPractical && hasTrainer;
    });

    setStudents(trainerStudents);
  };

  // مفتاح الجدول
  const getScheduleKey = (trainerName) => `trainerSchedule_${trainerName}`;

  // تحميل الجدول
  const loadSchedule = (trainerName) => {
    const key = getScheduleKey(trainerName);
    const stored = JSON.parse(localStorage.getItem(key) || '[]');
    setScheduleSlots(stored);
  };

  // حفظ الجدول
  const saveSchedule = (slots) => {
    if (!currentTrainer) return;
    const key = getScheduleKey(currentTrainer);
    localStorage.setItem(key, JSON.stringify(slots));
    setScheduleSlots(slots);
  };

  // 🔥 تحميل طلبات السيارات (الإصلاح هنا)
  const loadCarRequests = () => {
    let reqs = localStorage.getItem("carRequests");

    // إذا لا يوجد -> انشئ Array
    if (!reqs) {
      reqs = [];
      localStorage.setItem("carRequests", JSON.stringify(reqs));
    } else {
      try {
        reqs = JSON.parse(reqs);
        if (!Array.isArray(reqs)) {
          reqs = [];
          localStorage.setItem("carRequests", JSON.stringify(reqs));
        }
      } catch (e) {
        reqs = [];
        localStorage.setItem("carRequests", JSON.stringify(reqs));
      }
    }

    setCarRequests(reqs);
  };

  // 🔥 حفظ الطلبات (الإصلاح هنا)
  const saveCarRequests = (reqs) => {
    if (!Array.isArray(reqs)) reqs = [];
    localStorage.setItem("carRequests", JSON.stringify(reqs));
    setCarRequests(reqs);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentTrainer');
    navigate('/');
  };

  // إضافة موعد جديد
  const handleAddSlot = (e) => {
    e.preventDefault();

    if (!newSlotTime) {
      alert('Please select a time.');
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
      vehicleType: student ? mapCourseToVehicleType(student.course) : null,
      status: student ? 'booked' : 'available',
      carId: null
    };

    const updated = [...scheduleSlots, newSlot];
    saveSchedule(updated);

    setNewSlotTime('');
    setNewSlotStudentId('');
  };

  // سلوطات اليوم
  const getSlotsForSelectedDate = () => {
    return scheduleSlots
      .filter((slot) => slot.date === selectedDate)
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  // 🔥 إرسال طلب سيارة (هنا كان الخطأ)
  const handleRequestCar = (slotId) => {
    const slot = scheduleSlots.find((s) => s.id === slotId);
    if (!slot) return;

    if (!slot.studentId || !slot.vehicleType) {
      alert('Assign a student first.');
      return;
    }

    // إذا carRequests ليس Array → تم إصلاحه سابقًا
    const existing = carRequests.find(
      (r) => r.slotId === slotId && r.status === 'pending'
    );
    if (existing) {
      alert('A request already exists for this lesson.');
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
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const updatedReqs = [...carRequests, newRequest];
    saveCarRequests(updatedReqs);

    // تحديث حالة الدرس
    const updatedSlots = scheduleSlots.map((s) =>
      s.id === slotId ? { ...s, status: 'waiting-car' } : s
    );
    saveSchedule(updatedSlots);

    alert('Car request sent.');
  };

  // إنهاء الدرس
  const handleCompleteLesson = (slotId) => {
    const slot = scheduleSlots.find((s) => s.id === slotId);

    if (!slot || slot.status === "completed") return;

    // تحديث الطالب
    const allStudents = JSON.parse(localStorage.getItem('students') || '[]');
    const price = getLessonPrice(slot.course);

    const updatedStudents = allStudents.map((s) => {
      if (s.id === slot.studentId) {
        return {
          ...s,
          practicalLessons: (s.practicalLessons || 0) + 1,
          practicalPaid: (s.practicalPaid || 0) + price
        };
      }
      return s;
    });

    localStorage.setItem('students', JSON.stringify(updatedStudents));
    loadStudents(currentTrainer);

    // تحرير السيارة
    if (slot.carId) {
      const cars = JSON.parse(localStorage.getItem('cars') || '[]');

      const updatedCars = cars.map((c) =>
        c.id === slot.carId
          ? {
              ...c,
              busy: false,
              currentTrainer: null,
              currentStudent: null,
              releaseTime: null
            }
          : c
      );

      localStorage.setItem('cars', JSON.stringify(updatedCars));
    }

    // تحديث حالة السلوط
    const updatedSlots = scheduleSlots.map((s) =>
      s.id === slotId ? { ...s, status: 'completed' } : s
    );
    saveSchedule(updatedSlots);

    alert('Lesson completed successfully.');
  };

  const getStatusBadge = (slot) => {
    switch (slot.status) {
      case 'available':
        return <span className="status-badge available">Available</span>;
      case 'booked':
        return <span className="status-badge booked">Booked</span>;
      case 'waiting-car':
        return <span className="status-badge waiting">Waiting Car</span>;
      case 'in-progress':
        return <span className="status-badge in-progress">In Progress</span>;
      case 'completed':
        return <span className="status-badge completed">Completed</span>;
      default:
        return null;
    }
  };

  if (!currentTrainer) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <div className="trainer-dashboard">
      <header className="trainer-header">
        <div className="header-content">
          <div className="trainer-info">
            <div className="trainer-avatar">🚗</div>
            <div>
              <h1 className="trainer-name">{currentTrainer}</h1>
              <p className="trainer-role">Practical Driving Trainer</p>
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
          className={`nav-btn ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          My Students
        </button>
        <button
          className={`nav-btn ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          Schedule
        </button>
      </nav>

      <main className="trainer-main">
        {/* Students Tab */}
        {activeTab === 'students' && (
          <section className="students-section">
            <h2 className="section-title">My Practical Students</h2>

            {students.length === 0 ? (
              <p>No students yet.</p>
            ) : (
              <div className="students-grid">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="student-card"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <h3>{student.name}</h3>
                    <p>{student.course}</p>
                    <p>Lessons: {student.practicalLessons || 0}</p>
                    <p>Paid: {student.practicalPaid || 0} ₪</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <section className="schedule-section">
            <div className="schedule-header">
              <h2 className="section-title">Daily Schedule</h2>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            {/* Add Slot */}
            <form className="add-slot-form" onSubmit={handleAddSlot}>
              <input
                type="time"
                value={newSlotTime}
                onChange={(e) => setNewSlotTime(e.target.value)}
                required
              />

              <select
                value={newSlotStudentId}
                onChange={(e) => setNewSlotStudentId(e.target.value)}
              >
                <option value="">No student</option>
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} — {st.course}
                  </option>
                ))}
              </select>

              <button type="submit">Add</button>
            </form>

            {/* Table */}
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Student</th>
                  <th>Status</th>
                  <th>Car</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getSlotsForSelectedDate().map((slot) => (
                  <tr key={slot.id}>
                    <td>{slot.time}</td>
                    <td>{slot.studentName || "-"}</td>
                    <td>{getStatusBadge(slot)}</td>
                    <td>{slot.carId || "-"}</td>
                    <td>
                      {slot.studentId && (
                        <button onClick={() => handleRequestCar(slot.id)}>
                          Request Car
                        </button>
                      )}

                      <button
                        onClick={() => handleCompleteLesson(slot.id)}
                        disabled={slot.status === "completed"}
                      >
                        Complete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </main>
    </div>
  );
};

export default TrainerDashboard;
