import KPICards from './KPICards';
import TodaysSessions from './TodaysSessions';
import WeeklySchedule from './WeeklySchedule';
import RecentStudents from './RecentStudents';

/**
 * Trainer Dashboard Content Component
 * Contains the actual dashboard widgets and sections for trainers
 */
export default function TrainerDashboardContent() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-3xl font-bold text-foreground">Trainer Dashboard</h1>
        <span className="px-3 py-1 bg-gradient-to-r from-success to-[#10b981] text-white text-xs font-semibold rounded-full shadow-sm">Active</span>
      </div>
      
      {/* KPI Cards Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">Statistics</h2>
        <KPICards />
      </section>
      
      {/* Today's Sessions Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">Today's Sessions</h2>
        <TodaysSessions />
      </section>
      
      {/* Weekly Schedule Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">Weekly Schedule</h2>
        <WeeklySchedule />
      </section>
      
      {/* Recent Students Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">Recent Students</h2>
        <RecentStudents />
      </section>
    </div>
  );
}
