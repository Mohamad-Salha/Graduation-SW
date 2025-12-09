'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

const Footer = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentYear, setCurrentYear] = useState('2025');

  useEffect(() => {
    setIsHydrated(true);
    setCurrentYear(new Date()?.getFullYear()?.toString());
  }, []);

  const footerLinks = {
    product: [
      { label: 'Features', href: '#how-it-works' },
      { label: 'For Students', href: '#for-students' },
      { label: 'For Schools', href: '#for-schools' },
      { label: 'Pricing', href: '#pricing' },
    ],
    company: [
      { label: 'About Us', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Press Kit', href: '#' },
    ],
    support: [
      { label: 'Help Center', href: '#' },
      { label: 'Contact Us', href: '#' },
      { label: 'System Status', href: '#' },
      { label: 'API Documentation', href: '#' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
      { label: 'GDPR Compliance', href: '#' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: 'facebook', href: '#' },
    { name: 'Twitter', icon: 'twitter', href: '#' },
    { name: 'Instagram', icon: 'instagram', href: '#' },
    { name: 'LinkedIn', icon: 'linkedin', href: '#' },
  ];

  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center space-x-2 mb-4">
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
                <span className="text-xl font-headline font-headline-bold text-background">
                  DriveMaster Pro
                </span>
              </Link>
              <p className="text-sm text-background/70 mb-4">
                Transforming driving education through technology, one student at a time.
              </p>
              <div className="flex items-center space-x-4">
                <a
                  href="#"
                  className="flex items-center justify-center w-10 h-10 bg-background/10 rounded-lg hover:bg-background/20 transition-smooth"
                  aria-label="Facebook"
                >
                  <Icon name="ShareIcon" size={20} variant="outline" className="text-background" />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center w-10 h-10 bg-background/10 rounded-lg hover:bg-background/20 transition-smooth"
                  aria-label="Twitter"
                >
                  <Icon name="ShareIcon" size={20} variant="outline" className="text-background" />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center w-10 h-10 bg-background/10 rounded-lg hover:bg-background/20 transition-smooth"
                  aria-label="LinkedIn"
                >
                  <Icon name="ShareIcon" size={20} variant="outline" className="text-background" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-headline font-headline-semibold text-background mb-4">
                Product
              </h3>
              <ul className="space-y-2">
                {footerLinks?.product?.map((link) => (
                  <li key={link?.label}>
                    <a
                      href={link?.href}
                      className="text-sm text-background/70 hover:text-background transition-smooth"
                    >
                      {link?.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-headline font-headline-semibold text-background mb-4">
                Company
              </h3>
              <ul className="space-y-2">
                {footerLinks?.company?.map((link) => (
                  <li key={link?.label}>
                    <a
                      href={link?.href}
                      className="text-sm text-background/70 hover:text-background transition-smooth"
                    >
                      {link?.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-headline font-headline-semibold text-background mb-4">
                Support
              </h3>
              <ul className="space-y-2">
                {footerLinks?.support?.map((link) => (
                  <li key={link?.label}>
                    <a
                      href={link?.href}
                      className="text-sm text-background/70 hover:text-background transition-smooth"
                    >
                      {link?.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-headline font-headline-semibold text-background mb-4">
                Legal
              </h3>
              <ul className="space-y-2">
                {footerLinks?.legal?.map((link) => (
                  <li key={link?.label}>
                    <a
                      href={link?.href}
                      className="text-sm text-background/70 hover:text-background transition-smooth"
                    >
                      {link?.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-background/20">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-6 text-sm text-background/70">
                <div className="flex items-center space-x-2">
                  <Icon name="ShieldCheckIcon" size={16} variant="solid" className="text-success" />
                  <span>SSL Secured</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="LockClosedIcon" size={16} variant="solid" className="text-success" />
                  <span>PCI Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="CheckBadgeIcon" size={16} variant="solid" className="text-success" />
                  <span>GDPR Ready</span>
                </div>
              </div>

              <p className="text-sm text-background/70">
                {isHydrated ? `© ${currentYear}` : '© 2025'} DriveMaster Pro. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;