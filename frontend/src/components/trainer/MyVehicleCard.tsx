export default function MyVehicleCard() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 shadow-card hover-lift">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-medium text-muted-foreground">My Vehicle</div>
        <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
          <span className="text-xl">🚙</span>
        </div>
      </div>
      <div className="text-3xl font-bold text-secondary mb-1">1</div>
      <div className="text-xs text-muted-foreground">Assigned vehicle</div>
    </div>
  );
}
