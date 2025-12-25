export default function AttendanceTodayCard() {
  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-5 shadow-card hover-lift">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-medium text-muted-foreground">Attendance Today</div>
        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
          <span className="text-xl">📝</span>
        </div>
      </div>
      <div className="text-3xl font-bold text-accent mb-1">{0}</div>
      <div className="text-xs text-muted-foreground">Sessions marked today</div>
    </div>
  );
}
