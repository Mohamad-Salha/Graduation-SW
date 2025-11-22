# Practical Scheduling System Guide

## Overview

The new practical scheduling system allows trainers to create weekly availability schedules that students can book themselves. This provides flexibility for students while ensuring fairness through weekly booking limits.

---

## Key Features

1. **Trainer Control**: Trainers create their weekly availability with customizable time slots
2. **Recurring Schedules**: Schedules can repeat for a specified number of weeks
3. **Student Flexibility**: Students can view and book available slots independently
4. **Fairness System**: Students are limited to a maximum number of bookings per week (default: 3)
5. **Automatic Progress Tracking**: Student progress is automatically updated when attendance is marked
6. **Shared Visibility**: Both trainers and students can see schedule status in real-time

---

## Database Schema

### PracticalSchedule Model

```javascript
{
  trainerId: ObjectId (ref: Trainer),
  weeklySlots: [
    {
      day: String (enum: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]),
      startTime: String (e.g., "09:00"),
      endTime: String (e.g., "10:00"),
      vehicleId: ObjectId (ref: Vehicle),
      isBooked: Boolean (default: false),
      bookedBy: ObjectId (ref: Student),
      attended: Boolean (default: false),
      paymentAmount: Number (default: 0),
      sessionDate: Date
    }
  ],
  repeatForWeeks: Number (default: 1),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Student Model (Updated Field)

```javascript
{
  maxSessionsPerWeek: Number (default: 3)
  // ... other existing fields
}
```

---

## API Endpoints

### Trainer Endpoints

#### 1. Create Weekly Schedule

**POST** `/api/trainer/schedules`

Creates a new weekly availability schedule.

**Request Body:**
```json
{
  "weeklySlots": [
    {
      "day": "Sunday",
      "startTime": "09:00",
      "endTime": "10:00",
      "vehicleId": "vehicle_id_here"
    },
    {
      "day": "Sunday",
      "startTime": "10:00",
      "endTime": "11:00",
      "vehicleId": "vehicle_id_here"
    },
    {
      "day": "Monday",
      "startTime": "14:00",
      "endTime": "15:00",
      "vehicleId": "vehicle_id_here"
    }
  ],
  "repeatForWeeks": 4,
  "vehicleId": "vehicle_id_here"
}
```

**Response:**
```json
{
  "message": "Weekly schedule created successfully",
  "scheduleId": "schedule_id",
  "repeatForWeeks": 4,
  "slotsCount": 3
}
```

**Notes:**
- You can provide `vehicleId` at the schedule level (applies to all slots) or per slot
- `repeatForWeeks` determines how many weeks this schedule repeats (default: 1)
- Each slot requires: `day`, `startTime`, `endTime`

---

#### 2. View Your Schedules

**GET** `/api/trainer/schedules`

Returns all schedules created by the trainer with booking details.

**Response:**
```json
{
  "count": 1,
  "schedules": [
    {
      "scheduleId": "schedule_id",
      "repeatForWeeks": 4,
      "isActive": true,
      "createdAt": "2024-01-15T10:00:00.000Z",
      "slots": [
        {
          "slotId": "slot_id",
          "day": "Sunday",
          "startTime": "09:00",
          "endTime": "10:00",
          "isBooked": true,
          "bookedBy": "student_id",
          "sessionDate": "2024-01-21T09:00:00.000Z",
          "attended": false,
          "paymentAmount": 0,
          "vehicle": "Toyota Corolla (ABC-123)"
        },
        {
          "slotId": "slot_id_2",
          "day": "Sunday",
          "startTime": "10:00",
          "endTime": "11:00",
          "isBooked": false,
          "bookedBy": null,
          "sessionDate": null,
          "attended": false,
          "paymentAmount": 0,
          "vehicle": "Toyota Corolla (ABC-123)"
        }
      ]
    }
  ]
}
```

---

#### 3. Mark Slot Attendance

**PUT** `/api/trainer/schedules/:scheduleId/slots/:slotId/attendance`

Marks a booked slot as attended or not attended.

**Request Body:**
```json
{
  "attended": true,
  "paymentAmount": 50
}
```

**Response:**
```json
{
  "message": "Attendance marked successfully",
  "scheduleId": "schedule_id",
  "slotId": "slot_id",
  "attended": true
}
```

**Notes:**
- Only booked slots can be marked for attendance
- When `attended: true`, student's progress is automatically updated
- `paymentAmount` is optional (default: 0)

---

### Student Endpoints

#### 1. View Available Slots

**GET** `/api/student/available-slots?trainerId=trainer_id`

Returns all available (unbooked) slots. Optionally filter by trainer.

**Query Parameters:**
- `trainerId` (optional): Filter slots by specific trainer

**Response:**
```json
{
  "count": 5,
  "slots": [
    {
      "scheduleId": "schedule_id",
      "slotId": "slot_id",
      "trainerId": "trainer_id",
      "trainerName": "John Doe",
      "day": "Sunday",
      "startTime": "09:00",
      "endTime": "10:00",
      "vehicle": "Toyota Corolla (ABC-123)"
    },
    {
      "scheduleId": "schedule_id",
      "slotId": "slot_id_2",
      "trainerId": "trainer_id",
      "trainerName": "John Doe",
      "day": "Monday",
      "startTime": "14:00",
      "endTime": "15:00",
      "vehicle": "Honda Civic (XYZ-789)"
    }
  ]
}
```

**Notes:**
- Only shows slots where `isBooked: false`
- Students must have passed the theoretical exam to view slots

---

#### 2. Book a Slot

**POST** `/api/student/book-slot`

Books an available slot for a specific date.

**Request Body:**
```json
{
  "scheduleId": "schedule_id",
  "slotId": "slot_id",
  "sessionDate": "2024-01-21T09:00:00.000Z"
}
```

**Response:**
```json
{
  "message": "Slot booked successfully",
  "scheduleId": "schedule_id",
  "slotId": "slot_id",
  "sessionDate": "2024-01-21T09:00:00.000Z",
  "trainerName": "John Doe",
  "day": "Sunday",
  "time": "09:00 - 10:00"
}
```

**Error Responses:**
```json
{
  "error": "You have reached your weekly booking limit of 3 sessions"
}
```

```json
{
  "error": "This slot is already booked"
}
```

**Notes:**
- Students are limited by `maxSessionsPerWeek` (default: 3)
- Weekly limit resets each week
- Students must have passed the theoretical exam to book slots
- Once booked, the slot is locked and cannot be booked by others

---

#### 3. View Your Bookings

**GET** `/api/student/my-bookings`

Returns all slots booked by the student.

**Response:**
```json
{
  "count": 2,
  "sessions": [
    {
      "scheduleId": "schedule_id",
      "slotId": "slot_id",
      "trainerId": "trainer_id",
      "trainerName": "John Doe",
      "day": "Sunday",
      "startTime": "09:00",
      "endTime": "10:00",
      "sessionDate": "2024-01-21T09:00:00.000Z",
      "attended": true,
      "paymentAmount": 50,
      "vehicle": "Toyota Corolla (ABC-123)"
    },
    {
      "scheduleId": "schedule_id",
      "slotId": "slot_id_2",
      "trainerId": "trainer_id",
      "trainerName": "John Doe",
      "day": "Monday",
      "startTime": "14:00",
      "endTime": "15:00",
      "sessionDate": "2024-01-23T14:00:00.000Z",
      "attended": false,
      "paymentAmount": 0,
      "vehicle": "Honda Civic (XYZ-789)"
    }
  ],
  "practicalProgress": 40,
  "sessionsCompleted": 4,
  "minRequiredSessions": 10
}
```

---

## Workflow Examples

### Example 1: Trainer Creates Weekly Schedule

**Scenario:** Trainer wants to create availability for 4 weeks with 3 slots per week.

**Step 1:** Trainer sends POST request to `/api/trainer/schedules`:

```json
{
  "weeklySlots": [
    {
      "day": "Sunday",
      "startTime": "09:00",
      "endTime": "10:00"
    },
    {
      "day": "Tuesday",
      "startTime": "15:00",
      "endTime": "16:00"
    },
    {
      "day": "Thursday",
      "startTime": "10:00",
      "endTime": "11:00"
    }
  ],
  "repeatForWeeks": 4,
  "vehicleId": "67890abcdef123456"
}
```

**Step 2:** System creates schedule with 3 slots that repeat for 4 weeks.

**Step 3:** Trainer can view the schedule using GET `/api/trainer/schedules`.

---

### Example 2: Student Books Slots

**Scenario:** Student wants to book 3 sessions for next week.

**Step 1:** Student views available slots:
```
GET /api/student/available-slots
```

**Step 2:** Student books first slot:
```json
POST /api/student/book-slot
{
  "scheduleId": "schedule_id",
  "slotId": "slot_id_1",
  "sessionDate": "2024-01-21T09:00:00.000Z"
}
```

**Step 3:** Student books second slot:
```json
POST /api/student/book-slot
{
  "scheduleId": "schedule_id",
  "slotId": "slot_id_2",
  "sessionDate": "2024-01-23T15:00:00.000Z"
}
```

**Step 4:** Student books third slot:
```json
POST /api/student/book-slot
{
  "scheduleId": "schedule_id",
  "slotId": "slot_id_3",
  "sessionDate": "2024-01-25T10:00:00.000Z"
}
```

**Step 5:** Student tries to book 4th slot but gets error:
```json
{
  "error": "You have reached your weekly booking limit of 3 sessions"
}
```

**Step 6:** Student can view all bookings:
```
GET /api/student/my-bookings
```

---

### Example 3: Trainer Marks Attendance

**Scenario:** Trainer completes a session with a student and marks attendance.

**Step 1:** Trainer checks their schedule to see booked slots:
```
GET /api/trainer/schedules
```

**Step 2:** Trainer marks the slot as attended after the session:
```json
PUT /api/trainer/schedules/schedule_id/slots/slot_id/attendance
{
  "attended": true,
  "paymentAmount": 50
}
```

**Step 3:** System automatically:
- Marks slot as attended
- Increments student's `practicalSessionsCompleted` count
- Recalculates student's `practicalProgress` percentage
- Updates student's profile

---

## Business Logic

### Weekly Booking Limit

1. **Default Limit**: 3 sessions per week
2. **Configurable**: Can be adjusted per student via `maxSessionsPerWeek` field
3. **Reset**: Limit resets each week (Sunday to Saturday)
4. **Enforcement**: Checked before each booking attempt

### Progress Calculation

When a trainer marks attendance as `true`:

```javascript
attendedCount = count of all attended slots for student
minSessions = student's chosen license minPracticalSessions
progress = Math.min(100, Math.round((attendedCount / minSessions) * 100))
```

Example:
- Student has attended 4 sessions
- License requires 10 minimum sessions
- Progress = Math.round((4 / 10) * 100) = 40%

### Slot Locking

1. When student books a slot:
   - `isBooked` → `true`
   - `bookedBy` → student's ObjectId
   - `sessionDate` → specified date

2. Booked slots are:
   - Hidden from available slots list
   - Visible in trainer's schedule with student info
   - Visible in student's bookings list

3. Only the trainer can mark attendance (unlocking is not currently implemented but can be added)

---

## Validation Rules

### Trainer Schedule Creation

- ✅ Each slot must have `day`, `startTime`, `endTime`
- ✅ `weeklySlots` array cannot be empty
- ✅ Valid days: Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday
- ✅ Time format: HH:MM (e.g., "09:00", "14:30")
- ✅ `repeatForWeeks` must be positive integer (defaults to 1)

### Student Booking

- ✅ Student must have passed theoretical exam
- ✅ Slot must exist and be available (`isBooked: false`)
- ✅ Student must not exceed `maxSessionsPerWeek` limit
- ✅ Schedule must be active (`isActive: true`)
- ✅ `sessionDate` is required and must be valid date

### Attendance Marking

- ✅ Slot must be booked (`isBooked: true`)
- ✅ Schedule must belong to the trainer making the request
- ✅ `attended` must be boolean
- ✅ `paymentAmount` is optional (defaults to 0)

---

## Testing the System

### 1. Test Trainer Schedule Creation

```bash
# Login as trainer
POST /api/auth/login
{
  "email": "trainer@example.com",
  "password": "password123"
}

# Create schedule
POST /api/trainer/schedules
Authorization: Bearer <trainer_token>
{
  "weeklySlots": [
    {"day": "Sunday", "startTime": "09:00", "endTime": "10:00"},
    {"day": "Monday", "startTime": "14:00", "endTime": "15:00"}
  ],
  "repeatForWeeks": 2,
  "vehicleId": "vehicle_id"
}

# View schedules
GET /api/trainer/schedules
Authorization: Bearer <trainer_token>
```

### 2. Test Student Booking

```bash
# Login as student (who passed theo exam)
POST /api/auth/login
{
  "email": "student@example.com",
  "password": "password123"
}

# View available slots
GET /api/student/available-slots
Authorization: Bearer <student_token>

# Book a slot
POST /api/student/book-slot
Authorization: Bearer <student_token>
{
  "scheduleId": "schedule_id_from_available_slots",
  "slotId": "slot_id_from_available_slots",
  "sessionDate": "2024-01-21T09:00:00.000Z"
}

# View bookings
GET /api/student/my-bookings
Authorization: Bearer <student_token>
```

### 3. Test Attendance Marking

```bash
# Login as trainer
POST /api/auth/login
{
  "email": "trainer@example.com",
  "password": "password123"
}

# Mark attendance
PUT /api/trainer/schedules/schedule_id/slots/slot_id/attendance
Authorization: Bearer <trainer_token>
{
  "attended": true,
  "paymentAmount": 50
}

# Verify student progress updated
# (Check student profile or bookings)
```

### 4. Test Weekly Booking Limit

```bash
# As student, book 3 slots successfully
POST /api/student/book-slot (1st booking) ✅
POST /api/student/book-slot (2nd booking) ✅
POST /api/student/book-slot (3rd booking) ✅

# Try to book 4th slot
POST /api/student/book-slot (4th booking) ❌
# Expected: "You have reached your weekly booking limit of 3 sessions"
```

---

## Migration from Old System

The old practical session system (`POST /api/trainer/sessions`) is still available for backward compatibility. However, the new scheduling system is recommended for:

- Better student flexibility
- Fairness through booking limits
- Reduced trainer workload (create once, repeats for weeks)
- Transparent availability visibility

### Old vs New Comparison

| Feature | Old System | New System |
|---------|-----------|------------|
| Session Creation | Trainer schedules each session individually | Trainer creates weekly recurring schedule |
| Student Involvement | Passive (trainer assigns) | Active (student books) |
| Fairness | No built-in limits | Weekly booking limit enforced |
| Visibility | Limited | Full transparency |
| Flexibility | Low | High |
| Trainer Effort | High (per session) | Low (per week) |

---

## Future Enhancements

Potential improvements to consider:

1. **Slot Cancellation**: Allow students to cancel bookings with advance notice
2. **Waiting List**: Queue system when slots are full
3. **Notification System**: Alerts for new slots, upcoming sessions, reminders
4. **Schedule Templates**: Save and reuse common weekly patterns
5. **Admin Override**: Allow admins to adjust booking limits per student
6. **Analytics**: Track booking patterns, attendance rates, popular times
7. **Payment Integration**: Handle payments directly in the booking flow
8. **Multi-Week Booking**: Allow students to book multiple weeks in advance

---

## Troubleshooting

### Issue: "You must pass the theoretical exam before booking practical sessions"

**Solution:** Student must complete and pass a theoretical exam before they can view or book practical slots.

### Issue: "You have reached your weekly booking limit"

**Solution:** Student has booked the maximum allowed sessions for this week. Wait until next week or contact admin to increase limit.

### Issue: "This slot is already booked"

**Solution:** Another student booked this slot. Refresh available slots list and choose a different slot.

### Issue: "Schedule not found"

**Solution:** The schedule may have been deleted or deactivated. View available slots again to get current schedules.

### Issue: "This schedule does not belong to you"

**Solution:** Trainers can only mark attendance on their own schedules. Verify you're using the correct schedule ID.

---

## Summary

The new practical scheduling system provides a modern, flexible, and fair way to manage practical driving sessions. Key benefits:

✅ **For Trainers**: Create weekly schedules once, view all bookings in one place, mark attendance easily
✅ **For Students**: Book sessions at their convenience, see real-time availability, fair access through limits
✅ **For System**: Automated progress tracking, reduced manual work, better data for analytics

The system is designed to scale with your driving school's growth while maintaining simplicity and fairness for all users.
