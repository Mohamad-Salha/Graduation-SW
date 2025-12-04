// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './Login';
import LoginForm from './LoginForm';

import ManagerDashboard from './ManagerDashboard';
import ManagerStudents from './ManagerStudents';
import ManagerCars from './ManagerCars';

import StudentDashboard from './StudentDashboard';
import StudentSignup from './StudentSignup';

import TeacherDashboard from './TeacherDashboard';
import TrainerDashboard from './TrainerDashboard';
import ManagerTrainers from "./ManagerTrainers";

import TrainerProfile from "./TrainerProfile";



import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Login */}
          <Route path="/" element={<Login />} />
          <Route path="/login/:userType" element={<LoginForm />} />

          {/* Manager */}
          <Route path="/manager/dashboard" element={<ManagerDashboard />} />
          <Route path="/manager/students" element={<ManagerStudents />} />
          <Route path="/manager/cars" element={<ManagerCars />} />

          {/* Student */}
          <Route path="/student/signup" element={<StudentSignup />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />

          {/* Teacher & Trainer */}
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/trainer/dashboard" element={<TrainerDashboard />} />
          <Route path="/manager/trainers" element={<ManagerTrainers />} />
          <Route path="/manager/trainer/:trainerName" element={<TrainerProfile />} />
          <Route path="/trainer/profile/:trainerName" element={<TrainerProfile />} />


        </Routes>
      </div>
    </Router>
  );
}

export default App;
