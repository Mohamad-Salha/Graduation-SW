'use client';

import { useState, useEffect } from 'react';
import LicenseCard from './LicenseCard';
import CarouselArrow from './CarouselArrow';

interface License {
  id: string;
  name: string;
  description: string;
  category: string;
  totalPrice: number;
  pricePerSession: number;
  minPracticalSessions: number;
  estimatedDuration: string;
  difficulty: string;
  color: string;
  icon: string;
  isPopular: boolean;
  backgroundImage?: string;
}

interface LicenseCarouselProps {
  licenses: License[];
  onSelectLicense: (license: License) => void;
  autoCycle?: boolean;
  cycleInterval?: number;
}

export default function LicenseCarousel({ 
  licenses, 
  onSelectLicense,
  autoCycle = true,
  cycleInterval = 5000 
}: LicenseCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const cardsPerView = 3;
  const maxIndex = Math.max(0, licenses.length - cardsPerView);

  // Auto-cycle effect
  useEffect(() => {
    if (!autoCycle || isPaused || maxIndex === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        // Loop back to start when reaching the end
        if (prev >= maxIndex) return 0;
        return prev + 1;
      });
    }, cycleInterval);

    return () => clearInterval(interval);
  }, [autoCycle, isPaused, maxIndex, cycleInterval]);

  const handlePrevious = () => {
    setIsPaused(true);
    setCurrentIndex((prev) => {
      if (prev === 0) return maxIndex; // Loop to end
      return prev - 1;
    });
    // Resume auto-cycle after 10 seconds
    setTimeout(() => setIsPaused(false), 10000);
  };

  const handleNext = () => {
    setIsPaused(true);
    setCurrentIndex((prev) => {
      if (prev >= maxIndex) return 0; // Loop to start
      return prev + 1;
    });
    // Resume auto-cycle after 10 seconds
    setTimeout(() => setIsPaused(false), 10000);
  };

  const handleCardClick = (license: License) => {
    setSelectedLicense(license);
    onSelectLicense(license);
    setIsPaused(true); // Pause when user selects
  };

  // Get visible licenses
  const visibleLicenses = licenses.slice(currentIndex, currentIndex + cardsPerView);

  return (
    <div 
      className="relative w-full mx-auto px-4 sm:px-8 lg:px-16"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Left Arrow */}
      <CarouselArrow
        direction="left"
        onClick={handlePrevious}
        disabled={false}
      />

      {/* Cards Container */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 py-12 px-4">
        {visibleLicenses.map((license, index) => (
          <div
            key={license.id}
            className="transform transition-all duration-700 ease-out"
            style={{
              transitionDelay: `${index * 100}ms`,
              animation: 'slideIn 0.6s ease-out forwards',
            }}
          >
            <LicenseCard
              {...license}
              isSelected={selectedLicense?.id === license.id}
              onClick={() => handleCardClick(license)}
            />
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      <CarouselArrow
        direction="right"
        onClick={handleNext}
        disabled={false}
      />

      {/* Pagination Dots */}
      {maxIndex > 0 && (
        <div className="flex justify-center gap-3 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`
                h-3 rounded-full transition-all duration-500
                ${index === currentIndex ? 'bg-white w-12' : 'bg-white/40 hover:bg-white/70 w-3'}
              `}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
