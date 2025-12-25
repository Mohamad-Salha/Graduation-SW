import TotalStudentsCard from './TotalStudentsCard';
import UpcomingSessionsCard from './UpcomingSessionsCard';
import CompletedSessionsCard from './CompletedSessionsCard';
import PendingPaymentsCard from './PendingPaymentsCard';
import MyVehicleCard from './MyVehicleCard';
import AttendanceTodayCard from './AttendanceTodayCard';

export default function KPICards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <TotalStudentsCard />
      <UpcomingSessionsCard />
      <CompletedSessionsCard />
      <PendingPaymentsCard />
      <MyVehicleCard />
      <AttendanceTodayCard />
    </div>
  );
}
