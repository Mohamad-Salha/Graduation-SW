export default function CompletedSessionsCard() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 shadow-card hover-lift">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-medium text-muted-foreground">Completed Sessions</div>
        <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
          <span className="text-xl">✅</span>
        </div>
      </div>
      <div className="text-3xl font-bold text-warning mb-1">{0}</div>
      <div className="text-xs text-muted-foreground">Total completed</div>
    </div>
  );
}
