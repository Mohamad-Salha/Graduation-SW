import type { Metadata } from 'next';
import LandingPageInteractive from './components/LandingPageInteractive';

export const metadata: Metadata = {
  title: 'DriveMaster Pro - Complete Driving School Management System',
  description: 'Transform your driving education journey with smart scheduling, real-time progress tracking, and expert instruction. Join 10,000+ students who achieved their license on the first try with our comprehensive driving school management platform.',
};

export default function LandingPage() {
  return <LandingPageInteractive />;
}