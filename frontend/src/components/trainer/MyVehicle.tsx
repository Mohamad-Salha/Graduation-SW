export default function MyVehicle() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">My Vehicle</h1>
      
      <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-200 rounded-xl p-6 shadow-lg max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center text-4xl">
            🚙
          </div>
          <div>
            <h2 className="text-2xl font-bold">ABC123</h2>
            <p className="text-muted-foreground">Toyota Corolla 2023</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-border">
            <div className="text-sm text-muted-foreground mb-1">Type</div>
            <div className="font-semibold">Sedan</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-border">
            <div className="text-sm text-muted-foreground mb-1">Transmission</div>
            <div className="font-semibold">Automatic</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-border">
            <div className="text-sm text-muted-foreground mb-1">License Type</div>
            <div className="font-semibold">Category B</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-border">
            <div className="text-sm text-muted-foreground mb-1">Status</div>
            <div className="font-semibold text-success">✓ Active</div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-border">
          <div className="text-sm text-muted-foreground mb-2">Vehicle Details</div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Color:</span>
              <span className="font-medium">Silver</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Year:</span>
              <span className="font-medium">2023</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Capacity:</span>
              <span className="font-medium">5 Seats</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
