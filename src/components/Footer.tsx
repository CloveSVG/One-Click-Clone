import Link from 'next/link';

const NAV_LINKS = [
  { label: 'Platform Homepage', href: '/dev' },
  { label: 'Pricing', href: '/dev/pricing' },
  { label: 'Documentation', href: '#' },
  { label: 'Creative Studio', href: '#' },
  { label: 'Usage guide', href: '#' },
  { label: 'Affiliate Program', href: '#' },
] as const;

const POLICY_LINKS = ['Privacy', 'Paid Service', 'SLA'] as const;

export function Footer() {
  return (
    <footer className="bg-[#111214] px-6 py-12">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex items-center gap-2 opacity-60">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 12C8 9.79 9.79 8 12 8M16 12C16 14.21 14.21 16 12 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="text-base font-semibold text-white">KlingAI</span>
        </div>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-white/40 transition-colors hover:text-white/70"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="mt-4 flex gap-6">
          {POLICY_LINKS.map((label) => (
            <span key={label} className="text-xs text-white/30">
              {label}
            </span>
          ))}
        </div>

        <div className="mt-8 text-xs text-white/30">
          &copy; 2024-2025 klingai.com All rights Reserved
        </div>
      </div>
    </footer>
  );
}
