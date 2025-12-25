export default function UpcomingSessionsCard() {
  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5 shadow-card hover-lift">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-medium text-muted-foreground">Upcoming Sessions</div>
        <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
          <span className="text-xl">📆</span>
        </div>
      </div>
      <div className="text-3xl font-bold text-success mb-1">{0}</div>
      <div className="text-xs text-muted-foreground">Sessions this week</div>
    </div>
  );
}
