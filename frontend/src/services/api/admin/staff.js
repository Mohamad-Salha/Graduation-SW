import apiClient from '../client';

// === Teacher Management ===

// Get all teachers
export const getAllTeachers = async () => {
  return await apiClient.get('/admin/teachers');
};

// Get teacher details
export const getTeacherDetails = async (teacherId) => {
  return await apiClient.get(`/admin/teachers/${teacherId}`);
};

// Create new teacher
export const createTeacher = async (teacherData) => {
  return await apiClient.post('/admin/teachers', teacherData);
};

// Update teacher
export const updateTeacher = async (teacherId, updateData) => {
  return await apiClient.put(`/admin/teachers/${teacherId}`, updateData);
};

// Delete teacher
export const deleteTeacher = async (teacherId) => {
  return await apiClient.delete(`/admin/teachers/${teacherId}`);
};

// === Trainer Management ===

// Get all trainers
export const getAllTrainers = async () => {
  return await apiClient.get('/admin/trainers');
};

// Get trainer details
export const getTrainerDetails = async (trainerId) => {
  return await apiClient.get(`/admin/trainers/${trainerId}`);
};

// Create new trainer
export const createTrainer = async (trainerData) => {
  return await apiClient.post('/admin/trainers', trainerData);
};

// Update trainer
export const updateTrainer = async (trainerId, updateData) => {
  return await apiClient.put(`/admin/trainers/${trainerId}`, updateData);
};

// Delete trainer
export const deleteTrainer = async (trainerId) => {
  return await apiClient.delete(`/admin/trainers/${trainerId}`);
};
