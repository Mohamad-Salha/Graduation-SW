# Driving School Management System - API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

Tokens are obtained through login and expire after 24 hours.

---

## Table of Contents
1. [Authentication Endpoints](#authentication-endpoints)
2. [Admin Endpoints](#admin-endpoints)
3. [Student Endpoints](#student-endpoints)
4. [Teacher Endpoints](#teacher-endpoints)
5. [Trainer Endpoints](#trainer-endpoints)
6. [Data Models](#data-models)
7. [Error Responses](#error-responses)

---

# Authentication Endpoints

## POST /api/auth/signup
**Description:** Register a new student account (pending admin approval)

**Access:** Public

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "student@example.com",
  "password": "password123",
  "phone": "01234567890"
}
```

**Success Response (201):**
```json
{
  "message": "Student registered successfully. Awaiting admin approval.",
  "userId": "67440a1b2c3d4e5f6g7h8i9j",
  "studentId": "67440a1b2c3d4e5f6g7h8i9k",
  "status": "pending"
}
```

**Error Response (400):**
```json
{
  "error": "Email already exists"
}
```

---

## POST /api/auth/login
**Description:** Login for all user roles (admin, teacher, trainer, student)

**Access:** Public

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "67440a1b2c3d4e5f6g7h8i9j",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "student"
  }
}
```

**Error Response (401):**
```json
{
  "error": "Invalid email or password"
}
```

---

# Admin Endpoints

All admin endpoints require `Authorization: Bearer <admin_token>`

## Student Management

### GET /api/admin/students/pending
**Description:** Get all students awaiting approval

**Success Response (200):**
```json
{
  "count": 2,
  "students": [
    {
      "studentId": "67440a1b2c3d4e5f6g7h8i9k",
      "name": "John Doe",
      "email": "student@example.com",
      "phone": "01234567890",
      "signupDate": "2025-11-22T10:30:00.000Z",
      "status": "pending"
    }
  ]
}
```

---

### GET /api/admin/students
**Description:** Get all students (all statuses)

**Success Response (200):**
```json
{
  "count": 10,
  "students": [
    {
      "studentId": "67440a1b2c3d4e5f6g7h8i9k",
      "name": "John Doe",
      "email": "student@example.com",
      "phone": "01234567890",
      "status": "approved",
      "license": "Category B",
      "teacher": "Ahmed Ali",
      "trainer": "Mohamed Hassan"
    }
  ]
}
```

---

### PUT /api/admin/students/:studentId/approve
**Description:** Approve a pending student

**URL Parameters:**
- `studentId` - Student's ID

**Success Response (200):**
```json
{
  "message": "Student approved successfully",
  "studentId": "67440a1b2c3d4e5f6g7h8i9k",
  "status": "approved"
}
```

**Error Response (400):**
```json
{
  "error": "Student is not pending approval"
}
```

---

### PUT /api/admin/students/:studentId/reject
**Description:** Reject a pending student

**URL Parameters:**
- `studentId` - Student's ID

**Success Response (200):**
```json
{
  "message": "Student rejected",
  "studentId": "67440a1b2c3d4e5f6g7h8i9k"
}
```

---

### GET /api/admin/students/ready-theo
**Description:** Get students ready for theoretical exam

**Success Response (200):**
```json
{
  "count": 3,
  "students": [
    {
      "studentId": "67440a1b2c3d4e5f6g7h8i9k",
      "name": "John Doe",
      "email": "student@example.com",
      "phone": "01234567890",
      "license": "Category B",
      "teacher": "Ahmed Ali"
    }
  ]
}
```

---

### GET /api/admin/students/ready-practical
**Description:** Get students ready for practical exam

**Success Response (200):**
```json
{
  "count": 2,
  "students": [
    {
      "studentId": "67440a1b2c3d4e5f6g7h8i9k",
      "name": "John Doe",
      "email": "student@example.com",
      "phone": "01234567890",
      "license": "Category B",
      "trainer": "Mohamed Hassan"
    }
  ]
}
```

---

## License Management

### POST /api/admin/licenses
**Description:** Create a new license/course

**Request Body:**
```json
{
  "name": "Category B",
  "description": "Standard car license",
  "price": 500,
  "minPracticalSessions": 20
}
```

**Success Response (201):**
```json
{
  "message": "License created successfully",
  "license": {
    "licenseId": "67440a1b2c3d4e5f6g7h8i9l",
    "name": "Category B",
    "description": "Standard car license",
    "price": 500,
    "minPracticalSessions": 20
  }
}
```

---

### GET /api/admin/licenses
**Description:** Get all available licenses

**Success Response (200):**
```json
{
  "count": 3,
  "licenses": [
    {
      "licenseId": "67440a1b2c3d4e5f6g7h8i9l",
      "name": "Category B",
      "description": "Standard car license",
      "price": 500,
      "minPracticalSessions": 20
    }
  ]
}
```

---

## Teacher Management

### POST /api/admin/teachers
**Description:** Create a new teacher account

**Request Body:**
```json
{
  "name": "Ahmed Ali",
  "email": "teacher@example.com",
  "password": "teacher123",
  "phone": "01234567890"
}
```

**Success Response (201):**
```json
{
  "message": "Teacher created successfully",
  "teacherId": "67440a1b2c3d4e5f6g7h8i9m",
  "userId": "67440a1b2c3d4e5f6g7h8i9n",
  "name": "Ahmed Ali",
  "email": "teacher@example.com"
}
```

---

### GET /api/admin/teachers
**Description:** Get all teachers

**Success Response (200):**
```json
{
  "count": 5,
  "teachers": [
    {
      "teacherId": "67440a1b2c3d4e5f6g7h8i9m",
      "name": "Ahmed Ali",
      "email": "teacher@example.com",
      "phone": "01234567890",
      "assignedStudentsCount": 12
    }
  ]
}
```

---

## Trainer Management

### POST /api/admin/trainers
**Description:** Create a new trainer account

**Request Body:**
```json
{
  "name": "Mohamed Hassan",
  "email": "trainer@example.com",
  "password": "trainer123",
  "phone": "01987654321"
}
```

**Success Response (201):**
```json
{
  "message": "Trainer created successfully",
  "trainerId": "67440a1b2c3d4e5f6g7h8i9o",
  "userId": "67440a1b2c3d4e5f6g7h8i9p",
  "name": "Mohamed Hassan",
  "email": "trainer@example.com"
}
```

---

### GET /api/admin/trainers
**Description:** Get all trainers

**Success Response (200):**
```json
{
  "count": 4,
  "trainers": [
    {
      "trainerId": "67440a1b2c3d4e5f6g7h8i9o",
      "name": "Mohamed Hassan",
      "email": "trainer@example.com",
      "phone": "01987654321",
      "assignedStudentsCount": 8
    }
  ]
}
```

---

## Exam Management

### POST /api/admin/exams/theoretical
**Description:** Schedule a theoretical exam

**Request Body:**
```json
{
  "courseId": "67440a1b2c3d4e5f6g7h8i9l",
  "date": "2025-12-15T10:00:00.000Z",
  "location": "Testing Center A"
}
```

**Success Response (201):**
```json
{
  "message": "Theoretical exam scheduled successfully",
  "exam": {
    "examId": "67440a1b2c3d4e5f6g7h8i9q",
    "type": "theoretical",
    "courseId": "67440a1b2c3d4e5f6g7h8i9l",
    "date": "2025-12-15T10:00:00.000Z",
    "location": "Testing Center A"
  }
}
```

---

### POST /api/admin/exams/practical
**Description:** Schedule a practical exam

**Request Body:**
```json
{
  "courseId": "67440a1b2c3d4e5f6g7h8i9l",
  "date": "2025-12-20T14:00:00.000Z",
  "location": "Driving Track B"
}
```

**Success Response (201):**
```json
{
  "message": "Practical exam scheduled successfully",
  "exam": {
    "examId": "67440a1b2c3d4e5f6g7h8i9r",
    "type": "practical",
    "courseId": "67440a1b2c3d4e5f6g7h8i9l",
    "date": "2025-12-20T14:00:00.000Z",
    "location": "Driving Track B"
  }
}
```

---

### GET /api/admin/exams
**Description:** Get all scheduled exams

**Success Response (200):**
```json
{
  "count": 5,
  "exams": [
    {
      "examId": "67440a1b2c3d4e5f6g7h8i9q",
      "type": "theoretical",
      "courseName": "Category B",
      "courseId": "67440a1b2c3d4e5f6g7h8i9l",
      "date": "2025-12-15T10:00:00.000Z",
      "location": "Testing Center A"
    }
  ]
}
```

---

### GET /api/admin/exams/:examId/attempts
**Description:** Get all student attempts for a specific exam

**URL Parameters:**
- `examId` - Exam's ID

**Success Response (200):**
```json
{
  "count": 8,
  "attempts": [
    {
      "attemptId": "67440a1b2c3d4e5f6g7h8i9s",
      "studentName": "John Doe",
      "studentEmail": "student@example.com",
      "attemptNumber": 1,
      "status": "pending",
      "date": "2025-11-22T10:00:00.000Z"
    }
  ]
}
```

---

### PUT /api/admin/exam-attempts/:attemptId/result
**Description:** Record exam result (pass/fail)

**URL Parameters:**
- `attemptId` - Exam attempt's ID

**Request Body:**
```json
{
  "status": "passed"
}
```
*Allowed values: "passed" or "failed"*

**Success Response (200):**
```json
{
  "message": "Exam result recorded successfully",
  "attempt": {
    "attemptId": "67440a1b2c3d4e5f6g7h8i9s",
    "studentId": "67440a1b2c3d4e5f6g7h8i9k",
    "status": "passed"
  }
}
```

**Note:** If theoretical exam status is "passed", student's `theoPassed` field is automatically set to `true`.

---

## Vehicle Management

### POST /api/admin/vehicles
**Description:** Create a new vehicle

**Request Body:**
```json
{
  "model": "Toyota Corolla 2023",
  "licensePlate": "ABC-1234",
  "type": "sedan"
}
```
*Type options: "sedan", "suv", "truck"*

**Success Response (201):**
```json
{
  "message": "Vehicle created successfully",
  "vehicle": {
    "vehicleId": "67440a1b2c3d4e5f6g7h8i9t",
    "model": "Toyota Corolla 2023",
    "licensePlate": "ABC-1234",
    "type": "sedan"
  }
}
```

---

### GET /api/admin/vehicles
**Description:** Get all vehicles

**Success Response (200):**
```json
{
  "count": 6,
  "vehicles": [
    {
      "vehicleId": "67440a1b2c3d4e5f6g7h8i9t",
      "model": "Toyota Corolla 2023",
      "licensePlate": "ABC-1234",
      "type": "sedan",
      "isAvailable": true,
      "assignedTrainer": "Mohamed Hassan"
    }
  ]
}
```

---

### PUT /api/admin/vehicles/:vehicleId/assign
**Description:** Assign vehicle to trainer

**URL Parameters:**
- `vehicleId` - Vehicle's ID

**Request Body:**
```json
{
  "trainerId": "67440a1b2c3d4e5f6g7h8i9o"
}
```

**Success Response (200):**
```json
{
  "message": "Vehicle assigned to trainer successfully",
  "vehicleId": "67440a1b2c3d4e5f6g7h8i9t",
  "trainerId": "67440a1b2c3d4e5f6g7h8i9o"
}
```

---

# Student Endpoints

All student endpoints require `Authorization: Bearer <student_token>`

## Profile & Enrollment

### GET /api/student/profile
**Description:** Get student profile

**Success Response (200):**
```json
{
  "studentId": "67440a1b2c3d4e5f6g7h8i9k",
  "name": "John Doe",
  "email": "student@example.com",
  "phone": "01234567890",
  "status": "active",
  "theoPassed": true,
  "practicalProgress": 65,
  "practicalSessionsCompleted": 13,
  "license": {
    "name": "Category B",
    "description": "Standard car license",
    "price": 500,
    "minPracticalSessions": 20
  },
  "teacher": {
    "name": "Ahmed Ali",
    "email": "teacher@example.com",
    "phone": "01234567890"
  },
  "trainer": {
    "name": "Mohamed Hassan",
    "email": "trainer@example.com",
    "phone": "01987654321"
  }
}
```

---

### GET /api/student/licenses
**Description:** Get available licenses (only if student doesn't have active license)

**Success Response (200):**
```json
{
  "count": 3,
  "licenses": [
    {
      "_id": "67440a1b2c3d4e5f6g7h8i9l",
      "name": "Category B",
      "description": "Standard car license",
      "price": 500,
      "minPracticalSessions": 20
    }
  ]
}
```

**Error Response (400):**
```json
{
  "error": "You already have an active license. Complete or cancel it before choosing a new one."
}
```

---

### POST /api/student/enroll
**Description:** Enroll in a course

**Request Body:**
```json
{
  "licenseId": "67440a1b2c3d4e5f6g7h8i9l"
}
```

**Success Response (200):**
```json
{
  "message": "Successfully enrolled in course",
  "studentId": "67440a1b2c3d4e5f6g7h8i9k",
  "license": {
    "name": "Category B",
    "description": "Standard car license",
    "price": 500,
    "minPracticalSessions": 20
  },
  "status": "active"
}
```

---

## Teacher Selection

### GET /api/student/teachers
**Description:** Get all available theoretical teachers

**Success Response (200):**
```json
{
  "count": 5,
  "teachers": [
    {
      "teacherId": "67440a1b2c3d4e5f6g7h8i9m",
      "name": "Ahmed Ali",
      "email": "teacher@example.com",
      "phone": "01234567890",
      "assignedStudentsCount": 12
    }
  ]
}
```

---

### POST /api/student/choose-teacher
**Description:** Choose theoretical teacher

**Request Body:**
```json
{
  "teacherId": "67440a1b2c3d4e5f6g7h8i9m"
}
```

**Success Response (200):**
```json
{
  "message": "Successfully chose theoretical teacher",
  "studentId": "67440a1b2c3d4e5f6g7h8i9k",
  "teacher": {
    "teacherId": "67440a1b2c3d4e5f6g7h8i9m",
    "name": "Ahmed Ali",
    "email": "teacher@example.com"
  }
}
```

---

## Exam Management

### GET /api/student/my-exams
**Description:** Get upcoming exams and past attempts

**Success Response (200):**
```json
{
  "attempts": [
    {
      "attemptId": "67440a1b2c3d4e5f6g7h8i9s",
      "examType": "theoretical",
      "courseName": "Category B",
      "examDate": "2025-12-15T10:00:00.000Z",
      "location": "Testing Center A",
      "attemptNumber": 1,
      "status": "passed"
    }
  ],
  "upcomingExams": [
    {
      "examId": "67440a1b2c3d4e5f6g7h8i9r",
      "type": "practical",
      "courseName": "Category B",
      "date": "2025-12-20T14:00:00.000Z",
      "location": "Driving Track B"
    }
  ]
}
```

---

### POST /api/student/request-retest
**Description:** Register for exam (first attempt or retest)

**Request Body:**
```json
{
  "examId": "67440a1b2c3d4e5f6g7h8i9q"
}
```

**Success Response (200):**
```json
{
  "message": "Successfully registered for exam",
  "attemptId": "67440a1b2c3d4e5f6g7h8i9s",
  "attemptNumber": 1,
  "status": "pending"
}
```

---

## Trainer & Practical Sessions

### GET /api/student/trainers
**Description:** Get available trainers (only after passing theoretical exam)

**Success Response (200):**
```json
{
  "count": 4,
  "trainers": [
    {
      "trainerId": "67440a1b2c3d4e5f6g7h8i9o",
      "name": "Mohamed Hassan",
      "email": "trainer@example.com",
      "phone": "01987654321",
      "assignedStudentsCount": 8
    }
  ]
}
```

**Error Response (400):**
```json
{
  "error": "You must pass the theoretical exam before choosing a trainer"
}
```

---

### POST /api/student/choose-trainer
**Description:** Choose practical trainer

**Request Body:**
```json
{
  "trainerId": "67440a1b2c3d4e5f6g7h8i9o"
}
```

**Success Response (200):**
```json
{
  "message": "Successfully chose trainer",
  "studentId": "67440a1b2c3d4e5f6g7h8i9k",
  "trainer": {
    "trainerId": "67440a1b2c3d4e5f6g7h8i9o",
    "name": "Mohamed Hassan",
    "email": "trainer@example.com"
  }
}
```

---

### GET /api/student/my-sessions
**Description:** Get all practical sessions

**Success Response (200):**
```json
{
  "count": 13,
  "sessions": [
    {
      "sessionId": "67440a1b2c3d4e5f6g7h8i9u",
      "trainerName": "Mohamed Hassan",
      "date": "2025-11-20T09:00:00.000Z",
      "time": "09:00",
      "attended": true,
      "paymentAmount": 50,
      "vehicle": "Toyota Corolla 2023 (ABC-1234)"
    }
  ]
}
```

---

# Teacher Endpoints

All teacher endpoints require `Authorization: Bearer <teacher_token>`

### GET /api/teacher/profile
**Description:** Get teacher profile

**Success Response (200):**
```json
{
  "teacherId": "67440a1b2c3d4e5f6g7h8i9m",
  "name": "Ahmed Ali",
  "email": "teacher@example.com",
  "phone": "01234567890",
  "assignedStudentsCount": 12
}
```

---

### GET /api/teacher/students
**Description:** Get assigned students

**Success Response (200):**
```json
{
  "count": 12,
  "students": [
    {
      "studentId": "67440a1b2c3d4e5f6g7h8i9k",
      "name": "John Doe",
      "email": "student@example.com",
      "phone": "01234567890",
      "license": "Category B",
      "status": "active",
      "readyForTheoExam": false
    }
  ]
}
```

---

### POST /api/teacher/schedules
**Description:** Create weekly recurring schedule

**Request Body:**
```json
{
  "courseId": "67440a1b2c3d4e5f6g7h8i9l",
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
*Day options: "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"*

**Success Response (201):**
```json
{
  "message": "Weekly schedule created successfully",
  "scheduleId": "67440a1b2c3d4e5f6g7h8i9v",
  "course": "Category B",
  "weeklySlots": [
    {
      "day": "Sunday",
      "startTime": "10:00",
      "endTime": "12:00"
    }
  ]
}
```

---

### GET /api/teacher/schedules
**Description:** Get all active schedules

**Success Response (200):**
```json
{
  "count": 2,
  "schedules": [
    {
      "scheduleId": "67440a1b2c3d4e5f6g7h8i9v",
      "courseName": "Category B",
      "courseId": "67440a1b2c3d4e5f6g7h8i9l",
      "weeklySlots": [
        {
          "day": "Sunday",
          "startTime": "10:00",
          "endTime": "12:00"
        }
      ]
    }
  ]
}
```

---

### PUT /api/teacher/students/:studentId/ready
**Description:** Mark student as ready for theoretical exam

**URL Parameters:**
- `studentId` - Student's ID

**Success Response (200):**
```json
{
  "message": "Student marked as ready for theoretical exam",
  "studentId": "67440a1b2c3d4e5f6g7h8i9k",
  "studentName": "John Doe"
}
```

---

# Trainer Endpoints

All trainer endpoints require `Authorization: Bearer <trainer_token>`

### GET /api/trainer/profile
**Description:** Get trainer profile

**Success Response (200):**
```json
{
  "trainerId": "67440a1b2c3d4e5f6g7h8i9o",
  "name": "Mohamed Hassan",
  "email": "trainer@example.com",
  "phone": "01987654321",
  "assignedStudentsCount": 8
}
```

---

### GET /api/trainer/students
**Description:** Get assigned students with progress

**Success Response (200):**
```json
{
  "count": 8,
  "students": [
    {
      "studentId": "67440a1b2c3d4e5f6g7h8i9k",
      "name": "John Doe",
      "email": "student@example.com",
      "phone": "01234567890",
      "license": "Category B",
      "theoPassed": true,
      "practicalSessionsCompleted": 13,
      "practicalProgress": 65,
      "minPracticalSessions": 20,
      "readyForPracticalExam": false
    }
  ]
}
```

---

### POST /api/trainer/sessions
**Description:** Schedule practical session

**Request Body:**
```json
{
  "studentId": "67440a1b2c3d4e5f6g7h8i9k",
  "date": "2025-11-25T09:00:00.000Z",
  "time": "09:00",
  "vehicleId": "67440a1b2c3d4e5f6g7h8i9t",
  "paymentAmount": 50
}
```

**Success Response (201):**
```json
{
  "message": "Practical session scheduled successfully",
  "sessionId": "67440a1b2c3d4e5f6g7h8i9u",
  "studentId": "67440a1b2c3d4e5f6g7h8i9k",
  "date": "2025-11-25T09:00:00.000Z",
  "time": "09:00"
}
```

**Error Response (400):**
```json
{
  "error": "Student must pass theoretical exam before practical sessions"
}
```

---

### GET /api/trainer/sessions
**Description:** Get all trainer's sessions

**Success Response (200):**
```json
{
  "count": 45,
  "sessions": [
    {
      "sessionId": "67440a1b2c3d4e5f6g7h8i9u",
      "studentName": "John Doe",
      "studentId": "67440a1b2c3d4e5f6g7h8i9k",
      "date": "2025-11-25T09:00:00.000Z",
      "time": "09:00",
      "attended": true,
      "paymentAmount": 50,
      "vehicle": "Toyota Corolla 2023 (ABC-1234)"
    }
  ]
}
```

---

### PUT /api/trainer/sessions/:sessionId/attendance
**Description:** Mark session attendance (auto-updates student progress)

**URL Parameters:**
- `sessionId` - Session's ID

**Request Body:**
```json
{
  "attended": true
}
```

**Success Response (200):**
```json
{
  "message": "Attendance marked successfully",
  "sessionId": "67440a1b2c3d4e5f6g7h8i9u",
  "attended": true
}
```

**Note:** When `attended` is `true`, the system automatically:
- Increments student's `practicalSessionsCompleted`
- Recalculates `practicalProgress` percentage

---

### PUT /api/trainer/students/:studentId/ready
**Description:** Mark student as ready for practical exam

**URL Parameters:**
- `studentId` - Student's ID

**Success Response (200):**
```json
{
  "message": "Student marked as ready for practical exam",
  "studentId": "67440a1b2c3d4e5f6g7h8i9k",
  "studentName": "John Doe"
}
```

**Error Response (400):**
```json
{
  "error": "Student must complete at least 20 practical sessions (completed: 13)"
}
```

---

# Data Models

## User
```javascript
{
  "_id": "ObjectId",
  "name": "String",
  "email": "String (unique)",
  "password": "String (hashed)",
  "phone": "String",
  "role": "admin | teacher | trainer | student",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

## Student
```javascript
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: User)",
  "chosenLicense": "ObjectId (ref: License)",
  "theoTeacherId": "ObjectId (ref: Teacher)",
  "trainerId": "ObjectId (ref: Trainer)",
  "theoPassed": "Boolean (default: false)",
  "readyForTheoExam": "Boolean (default: false)",
  "readyForPracticalExam": "Boolean (default: false)",
  "practicalProgress": "Number (default: 0)",
  "practicalSessionsCompleted": "Number (default: 0)",
  "status": "pending | approved | active | inactive",
  "courses": [
    {
      "licenseId": "ObjectId (ref: License)",
      "status": "active | completed | failed"
    }
  ]
}
```

---

## Teacher
```javascript
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: User)",
  "assignedStudents": ["ObjectId (ref: Student)"]
}
```

---

## Trainer
```javascript
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: User)",
  "assignedStudents": ["ObjectId (ref: Student)"]
}
```

---

## License (Course)
```javascript
{
  "_id": "ObjectId",
  "name": "String",
  "description": "String",
  "price": "Number",
  "minPracticalSessions": "Number"
}
```

---

## Exam
```javascript
{
  "_id": "ObjectId",
  "type": "theoretical | practical",
  "courseId": "ObjectId (ref: License)",
  "date": "Date",
  "location": "String"
}
```

---

## ExamAttempt
```javascript
{
  "_id": "ObjectId",
  "examId": "ObjectId (ref: Exam)",
  "studentId": "ObjectId (ref: Student)",
  "attemptNumber": "Number",
  "status": "pending | passed | failed",
  "date": "Date (auto-generated)"
}
```

---

## StudentSession (Practical)
```javascript
{
  "_id": "ObjectId",
  "studentId": "ObjectId (ref: Student)",
  "trainerId": "ObjectId (ref: Trainer)",
  "vehicleId": "ObjectId (ref: Vehicle)",
  "date": "Date",
  "time": "String",
  "attended": "Boolean (default: false)",
  "paymentAmount": "Number (default: 0)",
  "progressPercentage": "Number (default: 0)"
}
```

---

## TheoSchedule
```javascript
{
  "_id": "ObjectId",
  "teacherId": "ObjectId (ref: Teacher)",
  "courseId": "ObjectId (ref: License)",
  "weeklySlots": [
    {
      "day": "String",
      "startTime": "String",
      "endTime": "String"
    }
  ],
  "isActive": "Boolean (default: true)"
}
```

---

## Vehicle
```javascript
{
  "_id": "ObjectId",
  "model": "String",
  "licensePlate": "String (unique)",
  "type": "sedan | suv | truck",
  "assignedTrainerId": "ObjectId (ref: Trainer)",
  "isAvailable": "Boolean (default: true)"
}
```

---

# Error Responses

## 400 Bad Request
Validation errors or business logic violations
```json
{
  "error": "Error message describing the issue"
}
```

## 401 Unauthorized
Missing or invalid authentication token
```json
{
  "error": "No token provided" 
}
```
```json
{
  "error": "Token has expired. Please login again."
}
```

## 403 Forbidden
Insufficient permissions for the requested resource
```json
{
  "error": "Access denied. Required role: admin. Your role: student"
}
```

## 404 Not Found
Resource not found
```json
{
  "error": "Resource not found"
}
```

## 500 Internal Server Error
Server-side error
```json
{
  "error": "Internal server error"
}
```

---

# Workflow Summary

## Student Journey

1. **Signup** → `POST /api/auth/signup` (status: pending)
2. **Admin Approval** → `PUT /api/admin/students/:id/approve`
3. **Login** → `POST /api/auth/login`
4. **Enroll in Course** → `POST /api/student/enroll`
5. **Choose Teacher** → `POST /api/student/choose-teacher`
6. **Teacher marks ready** → `PUT /api/teacher/students/:id/ready`
7. **Admin schedules exam** → `POST /api/admin/exams/theoretical`
8. **Student registers** → `POST /api/student/request-retest`
9. **Admin records result** → `PUT /api/admin/exam-attempts/:id/result`
10. **Choose Trainer** → `POST /api/student/choose-trainer`
11. **Trainer schedules sessions** → `POST /api/trainer/sessions`
12. **Trainer marks attendance** → `PUT /api/trainer/sessions/:id/attendance`
13. **After 20 sessions, trainer marks ready** → `PUT /api/trainer/students/:id/ready`
14. **Admin schedules practical exam** → `POST /api/admin/exams/practical`
15. **Student registers** → `POST /api/student/request-retest`
16. **Admin records result** → `PUT /api/admin/exam-attempts/:id/result`
17. ✅ **License obtained!**

---

# Notes

- All dates use ISO 8601 format: `2025-12-15T10:00:00.000Z`
- JWT tokens expire after 24 hours
- Passwords are hashed using bcrypt before storage
- Student progress is automatically calculated when attendance is marked
- Students cannot choose trainers until they pass the theoretical exam
- Trainers can only mark students ready after minimum required sessions are completed
- Weekly schedules repeat indefinitely (calculated in frontend based on day names)

---

**Version:** 1.0  
**Last Updated:** November 22, 2025
