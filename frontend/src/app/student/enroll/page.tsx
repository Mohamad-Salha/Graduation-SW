'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LicenseCarousel from '@/components/student/enroll/LicenseCarousel';
import { getAvailableLicenses, enrollInLicense } from '@/services/api/student/licenses';
import { getStudentProfile } from '@/services/api/student/profile';

export default function StudentEnroll() {
  const router = useRouter();
  const [licenses, setLicenses] = useState<any[]>([]);
  const [selectedLicense, setSelectedLicense] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check enrollment status first, then fetch licenses
  useEffect(() => {
    const checkAndFetchLicenses = async () => {
      try {
        setLoading(true);
        
        // First, check if student is already enrolled
        const profile = await getStudentProfile();
        
        console.log('Enroll page - Profile check:', profile);
        
        // If already has license, check teacher status and redirect
        if (profile && profile.chosenLicense) {
          console.log('Student already enrolled in license');
          
          // If has teacher, go to dashboard
          if (profile.theoTeacherId) {
            console.log('Has teacher, redirecting to dashboard');
            router.replace('/student/dashboard');
            return;
          }
          
          // If no teacher, go to teacher selection
          console.log('No teacher, redirecting to teachers');
          router.replace('/student/teachers');
          return;
        }
        
        // No license yet, fetch available licenses
        console.log('No license found, fetching available licenses');
        const data = await getAvailableLicenses();
        
        // Transform API data to match component interface
        const transformedLicenses = data.licenses.map((license: any) => ({
          id: license._id,
          name: license.name,
          description: license.description,
          category: license.category,
          totalPrice: license.totalPrice,
          pricePerSession: license.pricePerSession,
          minPracticalSessions: license.minPracticalSessions,
          estimatedDuration: license.estimatedDuration,
          difficulty: license.difficulty,
          color: license.color,
          icon: license.icon,
          isPopular: license.isPopular,
          backgroundImage: license.backgroundImage || `https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920&q=80`,
        }));
        
        setLicenses(transformedLicenses);
        setError(null);
      } catch (err: any) {
        console.error('Error loading licenses:', err);
        setError(err.message || 'Failed to load licenses');
      } finally {
        setLoading(false);
      }
    };

    checkAndFetchLicenses();
  }, [router]);

  const handleSelectLicense = (license: any) => {
    setSelectedLicense(license);
  };

  const handleEnroll = async () => {
    if (!selectedLicense) return;

    try {
      setEnrolling(true);
      await enrollInLicense(selectedLicense.id);
      
      // Success - redirect to teacher selection
      router.push('/student/teachers');
    } catch (err: any) {
      console.error('Enrollment error:', err);
      alert(err.message || 'Failed to enroll. Please try again.');
      setEnrolling(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8 sm:py-12 overflow-hidden">
      {/* Static Background - Highway Scene */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px) brightness(0.5)',
        }}
      />
      <div className="fixed inset-0 -z-5 bg-black/20" />

      {/* Header */}
      <div className="text-center mb-6 sm:mb-8 relative z-10 px-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          Choose Your License
        </h1>
        <p className="text-lg sm:text-xl text-white/90 drop-shadow-md">
          Select the perfect course to start your driving journey
        </p>
        {selectedLicense && (
          <div className="mt-4 inline-block bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full border border-white/20">
            <p className="text-white font-semibold">
              Selected: {selectedLicense.name}
            </p>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-white"></div>
          <p className="text-white mt-4 text-lg">Loading licenses...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-500/90 text-white px-6 py-4 rounded-lg max-w-md mx-4">
          <p className="font-semibold">Error loading licenses</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Carousel */}
      {!loading && !error && licenses.length > 0 && (
        <LicenseCarousel
          licenses={licenses}
          onSelectLicense={handleSelectLicense}
        />
      )}

      {/* Confirm Button (appears when license selected) */}
      {selectedLicense && !loading && (
        <div className="mt-6 sm:mt-8 relative z-10 animate-fade-in px-4">
          <button 
            onClick={handleEnroll}
            disabled={enrolling}
            className="bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 flex items-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{enrolling ? 'Enrolling...' : `Continue with ${selectedLicense.name}`}</span>
            {!enrolling && (
              <svg 
                className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            )}
          </button>
        </div>
      )}

      {/* Instructions */}
      {!loading && !error && (
        <div className="mt-8 text-center text-white/70 text-sm relative z-10 px-4">
          <p>💡 Tip: Hover over the carousel to pause auto-cycling</p>
        </div>
      )}
    </div>
  );
}
