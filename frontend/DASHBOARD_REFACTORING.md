# Dashboard Layout Refactoring Guide

## ✅ What Was Done

### 1. **Created Shared Components** (`/components/common/`)
- **`DashboardLayout.tsx`** - Main wrapper component that accepts header, sidebar, and children
- **`DashboardHeader.tsx`** - Reusable header with logo, notifications, profile dropdown (role-agnostic)
- **`DashboardSidebar.tsx`** - Reusable sidebar that accepts custom menu items per role

### 2. **Refactored Trainer Dashboard**
- **Renamed**: `TrainerDashboardLayout.tsx` → `TrainerDashboardContent.tsx`
  - Now contains only the dashboard content/widgets
  - No longer includes layout structure
- **Updated**: `/app/trainer/dashboard/page.tsx`
  - Now uses shared `DashboardLayout`, `DashboardHeader`, `DashboardSidebar`
  - Passes trainer-specific menu items and profile data
  - Kept all existing functionality (students, schedule, sessions, etc.)

### 3. **Prepared Admin & Teacher Dashboards**
- Both now use the shared layout system
- Have role-specific menu items defined
- Ready for you to add content when needed
- Currently show placeholder content

### 4. **Removed/Deprecated Files**
- `TrainerHeader.tsx` - Replaced by shared `DashboardHeader`
- `TrainerSidebar.tsx` - Replaced by shared `DashboardSidebar`
- *(These files still exist but are no longer used)*

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│       Shared Layout Components              │
│  (Used by Admin, Teacher, Trainer)          │
├─────────────────────────────────────────────┤
│  • DashboardLayout (wrapper)                │
│  • DashboardHeader (top bar)                │
│  • DashboardSidebar (navigation)            │
└─────────────────────────────────────────────┘
                    ↓
       ┌────────────┼────────────┐
       ↓            ↓            ↓
   ┌────────┐  ┌────────┐  ┌────────┐
   │ Admin  │  │Teacher │  │Trainer │
   │  Page  │  │  Page  │  │  Page  │
   └────────┘  └────────┘  └────────┘
       ↓            ↓            ↓
   [Empty]      [Empty]    ┌────────────┐
  Placeholder  Placeholder │  Content   │
                           │ Components │
                           └────────────┘
```

---

## 📋 How to Use (For Admin & Teacher)

### Example: Adding Admin Dashboard Content

1. **Create content component**:
   ```tsx
   // /components/admin/AdminDashboardContent.tsx
   export default function AdminDashboardContent() {
     return (
       <div>
         <h1>Admin Dashboard</h1>
         {/* Your KPI cards, charts, etc. */}
       </div>
     );
   }
   ```

2. **Import and use in page**:
   ```tsx
   // /app/admin/dashboard/page.tsx
   import AdminDashboardContent from '@/components/admin/AdminDashboardContent';
   
   // In renderContent() or directly in children:
   <DashboardLayout ...>
     <AdminDashboardContent />
   </DashboardLayout>
   ```

3. **Add routing** (if you want multiple sections):
   ```tsx
   const renderContent = () => {
     switch (activeSection) {
       case 'dashboard': return <AdminDashboardContent />;
       case 'students': return <StudentManagement />;
       case 'teachers': return <TeacherManagement />;
       // ... etc
     }
   };
   ```

---

## 🎯 Key Benefits

✅ **Consistency**: All dashboards look and feel the same  
✅ **Maintainability**: Change header once, affects all roles  
✅ **Flexibility**: Each role has unique menu items and content  
✅ **Clean Code**: Separation of concerns (layout vs content)  
✅ **Scalability**: Easy to add new roles or features  

---

## 🔧 Customization Options

### Per Dashboard:
- **Menu items** (sidebar links)
- **Quick stats** (optional sidebar widget)
- **Dashboard content** (main area)
- **User data** (name, email, role-specific info)

### Shared (affects all):
- Header styling
- Sidebar styling
- Layout structure
- Navigation behavior

---

## 📁 File Structure After Refactoring

```
frontend/src/
├── components/
│   ├── common/
│   │   ├── DashboardLayout.tsx      ← NEW (shared wrapper)
│   │   ├── DashboardHeader.tsx      ← NEW (shared header)
│   │   └── DashboardSidebar.tsx     ← NEW (shared sidebar)
│   ├── trainer/
│   │   ├── TrainerDashboardContent.tsx  ← RENAMED (was TrainerDashboardLayout)
│   │   ├── Header.tsx               ← DEPRECATED (not used)
│   │   ├── Sidebar.tsx              ← DEPRECATED (not used)
│   │   └── [other trainer components...]
│   └── [student components...]
└── app/
    ├── admin/dashboard/
    │   └── page.tsx                 ← UPDATED (uses shared layout)
    ├── teacher/dashboard/
    │   └── page.tsx                 ← UPDATED (uses shared layout)
    └── trainer/dashboard/
        └── page.tsx                 ← REFACTORED (uses shared layout)
```

---

## 🚀 Next Steps

1. **Test the trainer dashboard** - Should work exactly as before
2. **Build teacher dashboard content** - Create components in `/components/teacher/`
3. **Build admin dashboard content** - Create components in `/components/admin/`
4. **Fetch real data** - Add API calls for teacher/admin profiles
5. **Customize menu items** - Adjust based on actual permissions/features

---

## 💡 Tips

- **Don't modify shared components** unless the change should affect ALL roles
- **Create role-specific components** in their respective folders
- **Keep the layout system simple** - resist adding role-specific logic to shared files
- **Use the same patterns** as the trainer dashboard for consistency

---

## ⚠️ Student Dashboard

Left untouched as requested. When you want to refactor it, follow the same pattern:
1. Create `StudentDashboardContent.tsx`
2. Update page to use shared layout
3. Pass student-specific menu items
