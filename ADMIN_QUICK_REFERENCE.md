# Admin Module - Quick Reference Guide

## 📁 هيكل الملفات

```
frontend/src/
├── app/admin/dashboard/
│   └── page.tsx                          # الصفحة الرئيسية للـ Admin
│
├── components/admin/
│   ├── AdminDashboardContent.tsx         # ✅ لوحة التحكل الرئيسية
│   ├── AdminStudentsManagement.tsx       # ✅ إدارة الطلاب
│   ├── AdminStaffManagement.tsx          # ✅ إدارة الموظفين
│   ├── AdminVehiclesLicenses.tsx         # ✅ المركبات والرخص
│   ├── AdminExamsManagement.tsx          # ✅ إدارة الامتحانات (جديد)
│   ├── AdminPaymentsManagement.tsx       # ✅ إدارة المدفوعات
│   └── AdminReportsManagement.tsx        # ✅ التقارير والإحصائيات (جديد)
│
└── services/api/admin/
    ├── dashboard.js                      # ✅ API Dashboard
    ├── students.js                       # ✅ API Students
    ├── staff.js                          # ✅ API Staff
    ├── vehicles.js                       # ✅ API Vehicles
    ├── licenses.js                       # ✅ API Licenses
    ├── exams.js                          # ✅ API Exams (محدّث)
    └── payments.js                       # ✅ API Payments

backend/src/
├── Controllers/
│   └── adminController.js                # ✅ 40+ endpoints
│
├── Services/
│   └── adminService.js                   # ✅ Business logic
│
├── Repositories/
│   └── adminRepo.js                      # ✅ Database operations
│
└── Routes/
    └── adminRoutes.js                    # ✅ Route registration
```

---

## 🔗 خريطة API Endpoints

### Dashboard
```
GET  /api/admin/dashboard/stats           → getDashboardStats()
GET  /api/admin/dashboard/activities      → getRecentActivities()
GET  /api/admin/dashboard/revenue         → getRevenueAnalytics()
```

### Students
```
GET    /api/admin/students                → getAllStudents()
GET    /api/admin/students/pending        → getPendingStudents()
GET    /api/admin/students/:id            → getStudentDetails()
PUT    /api/admin/students/:id/approve    → approveStudent()
PUT    /api/admin/students/:id/reject     → rejectStudent()
PUT    /api/admin/students/:id/assign-teacher  → assignTeacher()
PUT    /api/admin/students/:id/assign-trainer  → assignTrainer()
DELETE /api/admin/students/:id            → deleteStudent()
```

### Staff
```
GET    /api/admin/teachers                → getAllTeachers()
POST   /api/admin/teachers                → createTeacher()
GET    /api/admin/trainers                → getAllTrainers()
POST   /api/admin/trainers                → createTrainer()
```

### Vehicles & Licenses
```
GET    /api/admin/vehicles                → getAllVehicles()
POST   /api/admin/vehicles                → createVehicle()
GET    /api/admin/licenses                → getAllLicenses()
POST   /api/admin/licenses                → createLicense()
```

### Exams
```
GET    /api/admin/exams                   → getAllExams()
POST   /api/admin/exams                   → createExam()
PUT    /api/admin/exams/:id               → updateExam()
DELETE /api/admin/exams/:id               → deleteExam()
GET    /api/admin/exam-attempts           → getAllExamAttempts()
PUT    /api/admin/exam-attempts/:id/grade → gradeExamAttempt()
```

### Payments
```
GET    /api/admin/payments                → getAllPayments()
POST   /api/admin/payments                → createPayment()
```

---

## 🎨 مكونات الصفحات

### 1. Dashboard
**المسار:** `/admin/dashboard`

**المكونات:**
- 4 KPI Cards (clickable)
- 3 Secondary Stats Cards (clickable)
- 4 Quick Action Buttons
- Recent Activities Section
- 2 View All Buttons

**Props:**
```typescript
interface AdminDashboardContentProps {
  onNavigate: (section: string) => void;
}
```

---

### 2. Students Management
**المسار:** `/admin/dashboard` (section='students')

**المكونات:**
- View Toggle (Pending/All)
- Approve/Reject Buttons
- Assign Teacher Modal
- Assign Trainer Modal
- View Details Modal
- Delete Button
- Search & Filter

**State:**
```typescript
- students: any[]
- pendingStudents: any[]
- teachers: any[]
- trainers: any[]
- selectedStudent: any
- showDetailsModal: boolean
- showAssignModal: boolean
```

---

### 3. Staff Management
**المسار:** `/admin/dashboard` (section='staff')

**المكونات:**
- Teachers/Trainers Tabs
- Add Staff Modal
- Staff Grid Cards

**State:**
```typescript
- activeTab: 'teachers' | 'trainers'
- teachers: any[]
- trainers: any[]
- showModal: boolean
```

---

### 4. Vehicles & Licenses
**المسار:** `/admin/dashboard` (section='vehicles')

**المكونات:**
- Vehicles/Licenses Tabs
- Add Vehicle Modal
- Add License Modal
- Cards Grid

**State:**
```typescript
- activeTab: 'vehicles' | 'licenses'
- vehicles: any[]
- licenses: any[]
- showModal: boolean
```

---

### 5. Exams Management
**المسار:** `/admin/dashboard` (section='exams')

**المكونات:**
- Scheduled Exams/Attempts Tabs
- Schedule Exam Button
- Create/Edit Exam Modal
- Grade Attempt Modal
- Exams Grid
- Attempts Table

**State:**
```typescript
- activeTab: 'exams' | 'attempts'
- exams: any[]
- attempts: any[]
- students: any[]
- showModal: boolean
- modalMode: 'create' | 'edit' | 'grade'
- selectedItem: any
```

---

### 6. Payments Management
**المسار:** `/admin/dashboard` (section='payments')

**المكونات:**
- Record Payment Button
- Payment Modal
- Stats Cards
- Payments Table
- Status Filter

**State:**
```typescript
- payments: any[]
- students: any[]
- statusFilter: string
- showModal: boolean
```

---

### 7. Reports & Analytics
**المسار:** `/admin/dashboard` (section='reports')

**المكونات:**
- Date Range Picker
- Export Button
- 5 Report Type Tabs
- Dynamic Report Content

**State:**
```typescript
- activeReport: 'overview' | 'revenue' | 'students' | 'staff' | 'exams'
- dateRange: { start: string, end: string }
- overviewData: any
- revenueData: any
- studentsData: any[]
- staffData: any
- examsData: any
```

---

## 🔄 Navigation Flow

```
Dashboard
  ├─> KPI Card Click ──────────> Students/Staff/Payments
  ├─> Stats Card Click ────────> Vehicles/Exams/Payments
  ├─> Quick Action Click ──────> Students/Staff/Exams/Reports
  └─> View All Click ──────────> Students/Payments

Sidebar
  ├─> Dashboard
  ├─> Students
  ├─> Staff
  ├─> Vehicles & Licenses
  ├─> Exams
  ├─> Payments
  └─> Reports
```

---

## 🎯 الأزرار وأحداثها

### Dashboard
```typescript
onClick={() => onNavigate('students')}   // Total Students
onClick={() => onNavigate('students')}   // Pending Approvals
onClick={() => onNavigate('staff')}      // Staff Members
onClick={() => onNavigate('payments')}   // Monthly Revenue
onClick={() => onNavigate('vehicles')}   // Vehicles
onClick={() => onNavigate('exams')}      // Exams
onClick={() => onNavigate('payments')}   // Payments
onClick={() => onNavigate('students')}   // Manage Students
onClick={() => onNavigate('staff')}      // Manage Staff
onClick={() => onNavigate('exams')}      // Schedule Exams
onClick={() => onNavigate('reports')}    // View Reports
```

### Students
```typescript
onClick={() => handleApprove(id)}              // Approve
onClick={() => handleReject(id)}               // Reject
onClick={() => handleViewDetails(student)}     // View Details
onClick={() => openAssignModal(student, 'teacher')}  // Assign Teacher
onClick={() => openAssignModal(student, 'trainer')}  // Assign Trainer
onClick={() => handleDelete(id)}               // Delete
```

### Staff
```typescript
onClick={() => setShowModal(true)}       // Add Staff
onClick={() => setActiveTab('teachers')} // Teachers Tab
onClick={() => setActiveTab('trainers')} // Trainers Tab
```

### Exams
```typescript
onClick={openCreateModal}                // Schedule Exam
onClick={() => openEditModal(exam)}      // Edit
onClick={() => handleDeleteExam(id)}     // Delete
onClick={() => openGradeModal(attempt)}  // Grade
```

### Payments
```typescript
onClick={() => setShowModal(true)}       // Record Payment
onChange={setStatusFilter}               // Filter
```

### Reports
```typescript
onClick={() => setActiveReport('overview')}  // Overview Tab
onClick={() => setActiveReport('revenue')}   // Revenue Tab
onClick={() => setActiveReport('students')}  // Students Tab
onClick={() => setActiveReport('staff')}     // Staff Tab
onClick={() => setActiveReport('exams')}     // Exams Tab
onClick={handleExport}                       // Export
```

---

## 📦 الـ Props المشتركة

### Loading State
```typescript
const [loading, setLoading] = useState(true);

if (loading) {
  return <LoadingSpinner />;
}
```

### Error Handling
```typescript
try {
  // API call
} catch (error) {
  console.error('Error:', error);
  alert('Error: ' + error.message);
}
```

### Modal Pattern
```typescript
const [showModal, setShowModal] = useState(false);

<Modal show={showModal} onClose={() => setShowModal(false)}>
  {/* Modal content */}
</Modal>
```

---

## 🚀 Quick Commands

### Start Everything
```powershell
# Terminal 1: Backend
cd c:\Graduation-SW\backend
npm run dev

# Terminal 2: Frontend
cd c:\Graduation-SW\frontend
npm run dev
```

### Seed Database
```powershell
cd c:\Graduation-SW\backend
node Database/seedAdmin.js      # Create admin
node Database/seedFull.js       # Add test data
```

### Check for Errors
```powershell
cd c:\Graduation-SW\frontend
npm run build                   # Check TypeScript errors
```

---

## 📞 مشاكل شائعة وحلولها

### 1. "Module not found"
```powershell
cd frontend
npm install
```

### 2. "Port already in use"
```powershell
# Kill process on port 3000 or 4028
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### 3. "Payment is not defined"
✅ تم حله! التحقق من:
```javascript
// adminRepo.js
const Payment = require("../../Database/models/Payment");
```

### 4. TypeScript errors
✅ تم حله! جميع الأنواع موجودة.

---

## ✅ Checklist للنشر

- [ ] جميع TypeScript errors محلولة
- [ ] جميع الأزرار تعمل
- [ ] جميع API endpoints تستجيب
- [ ] Error handling موجود في كل مكان
- [ ] Loading states تعمل
- [ ] Modals تفتح وتُغلق
- [ ] Navigation سلس
- [ ] البيانات تُحدّث بعد العمليات

---

**تم التحديث:** 27 ديسمبر 2025  
**الإصدار:** 1.0.0 (مكتمل)  
**الحالة:** ✅ جاهز للإنتاج
