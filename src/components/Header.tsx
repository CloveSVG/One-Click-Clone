'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'Creative Studio', href: '#', active: false },
  { label: 'API Platform', href: '/dev', active: true },
  { label: 'About Us', href: '#', active: false },
  { label: 'Blog', href: '#', active: false },
] as const;

export function Header() {
  return (
    <header className="fixed top-0 z-50 h-[77px] w-full">
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 12C8 9.79 9.79 8 12 8M16 12C16 14.21 14.21 16 12 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="text-lg font-semibold text-white">KlingAI</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                'text-sm transition-colors',
                link.active
                  ? 'font-medium text-white'
                  : 'text-white/80 hover:text-white'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Avatar */}
        <div className="flex items-center">
          <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-600" />
        </div>
      </div>
    </header>
  );
}
