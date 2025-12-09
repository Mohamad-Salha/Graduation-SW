'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface HeaderProps {
  className?: string;
}

const Header = ({ className = '' }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const navigationItems = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'For Students', href: '#for-students' },
    { label: 'Success Stories', href: '#success-stories' },
    { label: 'Pricing', href: '#pricing' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = navigationItems.map(item => item.href.substring(1));
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(`#${section}`);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const element = document.getElementById(targetId);
    
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }

    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          isScrolled ? 'bg-background/95 backdrop-blur-sm shadow-md' : 'bg-background'
        } ${className}`}
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-20 px-4 lg:px-6">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L4 6V12C4 16.5 7.5 20.5 12 22C16.5 20.5 20 16.5 20 12V6L12 2Z"
                    fill="currentColor"
                    className="text-primary-foreground"
                  />
                  <path
                    d="M10 12L8.5 13.5L11 16L16 11L14.5 9.5L11 13L10 12Z"
                    fill="currentColor"
                    className="text-success"
                  />
                </svg>
              </div>
              <span className="text-xl font-headline font-headline-bold text-primary">
                DriveMaster Pro
              </span>
            </Link>

            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`px-4 py-2 text-sm font-body font-body-medium rounded-md transition-smooth hover:bg-muted ${
                    activeSection === item.href
                      ? 'text-primary bg-muted' :'text-foreground'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="hidden lg:flex items-center space-x-4">
              <Link
                href="/login"
                className="px-6 py-2.5 text-sm font-body font-body-medium text-white bg-success rounded-lg shadow-md hover:bg-success/90 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
              >
                Login
              </Link>
              <Link
                href="#get-started"
                onClick={(e) => handleNavClick(e, '#get-started')}
                className="px-6 py-2.5 text-sm font-body font-cta text-accent-foreground bg-accent rounded-lg shadow-cta hover-lift hover:bg-accent/90 transition-smooth"
              >
                Get Started
              </Link>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-foreground hover:bg-muted rounded-md transition-smooth"
              aria-label="Toggle mobile menu"
            >
              <Icon
                name={isMobileMenuOpen ? 'XMarkIcon' : 'Bars3Icon'}
                size={24}
                variant="outline"
              />
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[90] bg-foreground/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="fixed top-20 right-0 bottom-0 w-80 max-w-[85vw] bg-background shadow-card animate-slide-in-right overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col p-6 space-y-1">
              {navigationItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`px-4 py-3 text-base font-body font-body-medium rounded-md transition-smooth hover:bg-muted ${
                    activeSection === item.href
                      ? 'text-primary bg-muted' :'text-foreground'
                  }`}
                >
                  {item.label}
                </a>
              ))}
              
              <div className="pt-4 mt-4 border-t border-border space-y-3">
                <Link
                  href="/login"
                  className="block w-full px-6 py-3 text-center text-base font-body font-body-medium text-white bg-success rounded-lg shadow-md hover:bg-success/90 hover:shadow-lg active:scale-95 transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  href="#get-started"
                  onClick={(e) => handleNavClick(e, '#get-started')}
                  className="block w-full px-6 py-3 text-center text-base font-body font-cta text-accent-foreground bg-accent rounded-lg shadow-cta hover:bg-accent/90 transition-smooth"
                >
                  Get Started
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;