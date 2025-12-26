interface RoleSpecificInfoProps {
  role: 'student' | 'teacher' | 'trainer' | 'admin';
  data: any;
}

export default function RoleSpecificInfo({ role, data }: RoleSpecificInfoProps) {
  if (!data) return null;

  const renderContent = () => {
    switch (role) {
      case 'student':
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-600/30">
              <p className="text-gray-400 text-sm mb-2">License Type</p>
              <p className="text-white font-bold text-lg">{data.licenseType || 'Not Enrolled'}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <p className="text-gray-400 text-xs mb-1">👨‍🏫 Teacher</p>
                <p className="text-white font-medium text-sm">{data.teacherName || 'Not Assigned'}</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <p className="text-gray-400 text-xs mb-1">🚗 Trainer</p>
                <p className="text-white font-medium text-sm">{data.trainerName || 'Not Assigned'}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-400 text-sm flex items-center gap-1.5">
                    <span>📚</span> Theory Progress
                  </p>
                  <span className="text-blue-400 font-bold">{data.theoryProgress || 0}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-blue-400 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${data.theoryProgress || 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-400 text-sm flex items-center gap-1.5">
                    <span>🚙</span> Practical Progress
                  </p>
                  <span className="text-green-400 font-bold">{data.practicalProgress || 0}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-600 to-green-400 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${data.practicalProgress || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'teacher':
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-600/30">
              <p className="text-gray-400 text-sm mb-2">Specialization</p>
              <p className="text-white font-bold text-lg flex items-center gap-2">
                <span>🎓</span>
                {data.specialization || 'Traffic Rules'}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-center">
                <p className="text-3xl font-bold text-blue-400 mb-1">{data.studentCount || 0}</p>
                <p className="text-gray-400 text-sm">👥 Students</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-center">
                <p className="text-3xl font-bold text-green-400 mb-1">{data.experience || 0}</p>
                <p className="text-gray-400 text-sm">⭐ Years Exp</p>
              </div>
            </div>
          </div>
        );
      
      case 'trainer':
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gradient-to-r from-green-600/20 to-teal-600/20 border border-green-600/30">
              <p className="text-gray-400 text-sm mb-2">Assigned Vehicle</p>
              <p className="text-white font-bold text-lg flex items-center gap-2">
                <span>🚗</span>
                {data.vehicleInfo ? `${data.vehicleInfo.model} (${data.vehicleInfo.plateNumber})` : 'Not Assigned'}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-center">
                <p className="text-3xl font-bold text-blue-400 mb-1">{data.studentCount || 0}</p>
                <p className="text-gray-400 text-sm">👥 Students</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-center">
                <p className="text-3xl font-bold text-green-400 mb-1">{data.experience || 0}</p>
                <p className="text-gray-400 text-sm">⭐ Years Exp</p>
              </div>
            </div>
          </div>
        );
      
      case 'admin':
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-600/30">
              <p className="text-gray-400 text-sm mb-2">Admin Role</p>
              <p className="text-white font-bold text-lg flex items-center gap-2">
                <span>🛡️</span>
                {data.adminRole || 'System Administrator'}
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <p className="text-gray-400 text-sm mb-2">Access Level</p>
              <p className="text-white font-medium flex items-center gap-2">
                <span>🔑</span>
                {data.accessLevel || 'Full Access'}
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <span className="text-2xl">💼</span>
        {role === 'student' ? 'Course Information' : 
         role === 'teacher' ? 'Teacher Information' :
         role === 'trainer' ? 'Trainer Information' : 'Admin Information'}
      </h2>
      {renderContent()}
    </div>
  );
}
