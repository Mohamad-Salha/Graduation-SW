# Driving School Management System - Complete Testing Guide

## Prerequisites
1. **Start the server**: `npm run dev` (from backend folder)
2. **Use Postman or similar REST client**
3. **Base URL**: `http://localhost:3000`

---

## Complete Workflow Test

### Phase 1: Initial Setup (Admin)

#### 1.1 Login as Admin
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```
**Save response token as `ADMIN_TOKEN`**

---

#### 1.2 Create Licenses (Courses)
```http
POST http://localhost:3000/api/admin/licenses
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "name": "Category B",
  "description": "Standard car license",
  "price": 500,
  "minPracticalSessions": 20
}
```
**Save the `licenseId` from response**

---

#### 1.3 Create Teacher Account
```http
POST http://localhost:3000/api/admin/teachers
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "name": "Ahmed Ali",
  "email": "teacher@example.com",
  "password": "teacher123",
  "phone": "01234567890"
}
```
**Save `teacherId` from response**

---

#### 1.4 Create Trainer Account
```http
POST http://localhost:3000/api/admin/trainers
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "name": "Mohamed Hassan",
  "email": "trainer@example.com",
  "password": "trainer123",
  "phone": "01987654321"
}
```
**Save `trainerId` from response**

---

#### 1.5 Create Vehicles
```http
POST http://localhost:3000/api/admin/vehicles
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "model": "Toyota Corolla 2023",
  "licensePlate": "ABC-1234",
  "type": "sedan"
}
```
**Save `vehicleId` from response**

---

#### 1.6 Assign Vehicle to Trainer
```http
PUT http://localhost:3000/api/admin/vehicles/VEHICLE_ID/assign
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "trainerId": "TRAINER_ID"
}
```

---

### Phase 2: Student Registration & Enrollment

#### 2.1 Student Signup
```http
POST http://localhost:3000/api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "student@example.com",
  "password": "student123",
  "phone": "01555555555"
}
```
**Status will be "pending"**

---

#### 2.2 Admin Approves Student
```http
GET http://localhost:3000/api/admin/students/pending
Authorization: Bearer ADMIN_TOKEN
```
**Get the `studentId` from the response**

```http
PUT http://localhost:3000/api/admin/students/STUDENT_ID/approve
Authorization: Bearer ADMIN_TOKEN
```

---

#### 2.3 Student Login
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "student123"
}
```
**Save response token as `STUDENT_TOKEN`**

---

#### 2.4 Student Views Available Licenses
```http
GET http://localhost:3000/api/student/licenses
Authorization: Bearer STUDENT_TOKEN
```

---

#### 2.5 Student Enrolls in Course
```http
POST http://localhost:3000/api/student/enroll
Authorization: Bearer STUDENT_TOKEN
Content-Type: application/json

{
  "licenseId": "LICENSE_ID_FROM_STEP_1.2"
}
```

---

#### 2.6 Student Views Available Teachers
```http
GET http://localhost:3000/api/student/teachers
Authorization: Bearer STUDENT_TOKEN
```

---

#### 2.7 Student Chooses Teacher
```http
POST http://localhost:3000/api/student/choose-teacher
Authorization: Bearer STUDENT_TOKEN
Content-Type: application/json

{
  "teacherId": "TEACHER_ID_FROM_STEP_1.3"
}
```

---

### Phase 3: Theoretical Phase (Teacher)

#### 3.1 Teacher Login
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "teacher@example.com",
  "password": "teacher123"
}
```
**Save response token as `TEACHER_TOKEN`**

---

#### 3.2 Teacher Views Assigned Students
```http
GET http://localhost:3000/api/teacher/students
Authorization: Bearer TEACHER_TOKEN
```

---

#### 3.3 Teacher Creates Weekly Schedule
```http
POST http://localhost:3000/api/teacher/schedules
Authorization: Bearer TEACHER_TOKEN
Content-Type: application/json

{
  "courseId": "LICENSE_ID",
  "weeklySlots": [
    {
      "day": "Sunday",
      "startTime": "10:00",
      "endTime": "12:00"
    },
    {
      "day": "Tuesday",
      "startTime": "14:00",
      "endTime": "16:00"
    },
    {
      "day": "Thursday",
      "startTime": "10:00",
      "endTime": "12:00"
    }
  ]
}
```

---

#### 3.4 Teacher Marks Student Ready for Theoretical Exam
```http
PUT http://localhost:3000/api/teacher/students/STUDENT_ID/ready
Authorization: Bearer TEACHER_TOKEN
```

---

### Phase 4: Theoretical Exam

#### 4.1 Admin Views Students Ready for Theo Exam
```http
GET http://localhost:3000/api/admin/students/ready-theo
Authorization: Bearer ADMIN_TOKEN
```

---

#### 4.2 Admin Schedules Theoretical Exam
```http
POST http://localhost:3000/api/admin/exams/theoretical
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "courseId": "LICENSE_ID",
  "date": "2025-12-15T10:00:00.000Z",
  "location": "Testing Center Building A"
}
```
**Save `examId` from response**

---

#### 4.3 Student Views Upcoming Exams
```http
GET http://localhost:3000/api/student/my-exams
Authorization: Bearer STUDENT_TOKEN
```

---

#### 4.4 Student Registers for Exam
```http
POST http://localhost:3000/api/student/request-retest
Authorization: Bearer STUDENT_TOKEN
Content-Type: application/json

{
  "examId": "EXAM_ID_FROM_STEP_4.2"
}
```
**Save `attemptId` from response**

---

#### 4.5 Admin Views Exam Attempts
```http
GET http://localhost:3000/api/admin/exams/EXAM_ID/attempts
Authorization: Bearer ADMIN_TOKEN
```

---

#### 4.6 Admin Records Exam Result (PASS)
```http
PUT http://localhost:3000/api/admin/exam-attempts/ATTEMPT_ID/result
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "status": "passed"
}
```
**This automatically sets student's `theoPassed: true`**

---

#### 4.7 Verify Student Profile Updated
```http
GET http://localhost:3000/api/student/profile
Authorization: Bearer STUDENT_TOKEN
```
**Should show `"theoPassed": true`**

---

### Phase 5: Practical Phase (Trainer)

#### 5.1 Student Views Available Trainers
```http
GET http://localhost:3000/api/student/trainers
Authorization: Bearer STUDENT_TOKEN
```

---

#### 5.2 Student Chooses Trainer
```http
POST http://localhost:3000/api/student/choose-trainer
Authorization: Bearer STUDENT_TOKEN
Content-Type: application/json

{
  "trainerId": "TRAINER_ID_FROM_STEP_1.4"
}
```

---

#### 5.3 Trainer Login
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "trainer@example.com",
  "password": "trainer123"
}
```
**Save response token as `TRAINER_TOKEN`**

---

#### 5.4 Trainer Views Assigned Students
```http
GET http://localhost:3000/api/trainer/students
Authorization: Bearer TRAINER_TOKEN
```

---

#### 5.5 Trainer Schedules Practical Session
```http
POST http://localhost:3000/api/trainer/sessions
Authorization: Bearer TRAINER_TOKEN
Content-Type: application/json

{
  "studentId": "STUDENT_ID",
  "date": "2025-11-25T09:00:00.000Z",
  "time": "09:00",
  "vehicleId": "VEHICLE_ID",
  "paymentAmount": 50
}
```
**Repeat this 20 times (or minPracticalSessions count) with different dates**

---

#### 5.6 Trainer Views All Sessions
```http
GET http://localhost:3000/api/trainer/sessions
Authorization: Bearer TRAINER_TOKEN
```

---

#### 5.7 Trainer Marks Session Attendance
```http
PUT http://localhost:3000/api/trainer/sessions/SESSION_ID/attendance
Authorization: Bearer TRAINER_TOKEN
Content-Type: application/json

{
  "attended": true
}
```
**This automatically updates student's progress percentage**

**Mark attendance for all sessions (20 sessions)**

---

#### 5.8 Student Views Their Practical Sessions
```http
GET http://localhost:3000/api/student/my-sessions
Authorization: Bearer STUDENT_TOKEN
```

---

#### 5.9 Trainer Marks Student Ready for Practical Exam
**(Only works after completing minimum required sessions)**
```http
PUT http://localhost:3000/api/trainer/students/STUDENT_ID/ready
Authorization: Bearer TRAINER_TOKEN
```

---

### Phase 6: Practical Exam

#### 6.1 Admin Views Students Ready for Practical Exam
```http
GET http://localhost:3000/api/admin/students/ready-practical
Authorization: Bearer ADMIN_TOKEN
```

---

#### 6.2 Admin Schedules Practical Exam
```http
POST http://localhost:3000/api/admin/exams/practical
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "courseId": "LICENSE_ID",
  "date": "2025-12-20T14:00:00.000Z",
  "location": "Driving Track - Area B"
}
```
**Save `examId`**

---

#### 6.3 Student Registers for Practical Exam
```http
POST http://localhost:3000/api/student/request-retest
Authorization: Bearer STUDENT_TOKEN
Content-Type: application/json

{
  "examId": "PRACTICAL_EXAM_ID"
}
```

---

#### 6.4 Admin Records Practical Exam Result
```http
PUT http://localhost:3000/api/admin/exam-attempts/ATTEMPT_ID/result
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "status": "passed"
}
```

---

## Additional Admin Operations

### View All Entities

```http
# Get all students
GET http://localhost:3000/api/admin/students
Authorization: Bearer ADMIN_TOKEN

# Get all teachers
GET http://localhost:3000/api/admin/teachers
Authorization: Bearer ADMIN_TOKEN

# Get all trainers
GET http://localhost:3000/api/admin/trainers
Authorization: Bearer ADMIN_TOKEN

# Get all licenses
GET http://localhost:3000/api/admin/licenses
Authorization: Bearer ADMIN_TOKEN

# Get all vehicles
GET http://localhost:3000/api/admin/vehicles
Authorization: Bearer ADMIN_TOKEN

# Get all exams
GET http://localhost:3000/api/admin/exams
Authorization: Bearer ADMIN_TOKEN
```

---

## Error Test Cases

### 1. Unauthorized Access
```http
# Student tries to access admin endpoint
GET http://localhost:3000/api/admin/students
Authorization: Bearer STUDENT_TOKEN
```
**Expected: 403 Forbidden**

---

### 2. Student Not Approved
```http
# Student tries to enroll before approval
POST http://localhost:3000/api/student/enroll
Authorization: Bearer STUDENT_TOKEN_PENDING
Content-Type: application/json

{
  "licenseId": "LICENSE_ID"
}
```
**Expected: 400 "Your account is still pending admin approval"**

---

### 3. Trainer Marks Ready Before Minimum Sessions
```http
# Trainer tries to mark student ready with only 10/20 sessions
PUT http://localhost:3000/api/trainer/students/STUDENT_ID/ready
Authorization: Bearer TRAINER_TOKEN
```
**Expected: 400 "Student must complete at least 20 practical sessions"**

---

## Quick Summary of All Endpoints

### Authentication (`/api/auth`)
- `POST /signup` - Student signup
- `POST /login` - Login (all roles)

### Admin (`/api/admin`)
- **Students**: `/students`, `/students/pending`, `/students/:id/approve`, `/students/:id/reject`, `/students/ready-theo`, `/students/ready-practical`
- **Licenses**: `POST /licenses`, `GET /licenses`
- **Teachers**: `POST /teachers`, `GET /teachers`
- **Trainers**: `POST /trainers`, `GET /trainers`
- **Exams**: `POST /exams/theoretical`, `POST /exams/practical`, `GET /exams`, `GET /exams/:examId/attempts`
- **Exam Results**: `PUT /exam-attempts/:attemptId/result`
- **Vehicles**: `POST /vehicles`, `GET /vehicles`, `PUT /vehicles/:vehicleId/assign`

### Student (`/api/student`)
- **Profile**: `GET /profile`
- **Enrollment**: `GET /licenses`, `POST /enroll`
- **Teachers**: `GET /teachers`, `POST /choose-teacher`
- **Exams**: `GET /my-exams`, `POST /request-retest`
- **Trainers**: `GET /trainers`, `POST /choose-trainer`
- **Sessions**: `GET /my-sessions`

### Teacher (`/api/teacher`)
- **Profile**: `GET /profile`
- **Students**: `GET /students`, `PUT /students/:studentId/ready`
- **Schedules**: `POST /schedules`, `GET /schedules`

### Trainer (`/api/trainer`)
- **Profile**: `GET /profile`
- **Students**: `GET /students`, `PUT /students/:studentId/ready`
- **Sessions**: `POST /sessions`, `GET /sessions`, `PUT /sessions/:sessionId/attendance`

---

## Notes
- All dates should be in ISO 8601 format: `2025-12-15T10:00:00.000Z`
- All protected routes require `Authorization: Bearer TOKEN` header
- Token expires in 24 hours
- When marking attendance as `true`, student progress auto-updates
- Students can only be marked ready for practical exam after completing minimum required sessions
