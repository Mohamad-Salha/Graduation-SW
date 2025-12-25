export default function PendingPaymentsCard() {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-5 shadow-card hover-lift">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-medium text-muted-foreground">Pending Payments</div>
        <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
          <span className="text-xl">💳</span>
        </div>
      </div>
      <div className="text-3xl font-bold text-error mb-1">{0}</div>
      <div className="text-xs text-muted-foreground">Students with unpaid sessions</div>
    </div>
  );
}
