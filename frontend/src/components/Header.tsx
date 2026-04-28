import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { Menu, User, X } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';

type NavItem = {
  label: string;
  to: string;
  icon?: React.ReactNode;
};

const navItems: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Verify', to: '/verify' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Profile', to: '/profile', icon: <User className="h-4 w-4" /> }
];

export default function Header(): JSX.Element {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close drawer on Escape key
  useEffect(() => {
    if (!drawerOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [drawerOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  // Move focus to close button when drawer opens
  useEffect(() => {
    if (drawerOpen) {
      closeButtonRef.current?.focus();
    }
  }, [drawerOpen]);

  return (
    <header className="no-print border-b border-gray-200 dark:border-white/10 bg-white dark:bg-slate-950/90 dark:backdrop-blur transition-colors duration-250">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white dark:text-slate-950 font-semibold transition-colors duration-250">
            SC
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-250">
              StellarCert
            </p>
            <p className="text-xs text-gray-600 dark:text-slate-400 transition-colors duration-250">
              Certificate Verification System
            </p>
          </div>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6 text-sm font-medium text-gray-700 dark:text-slate-300 transition-colors duration-250">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `transition-colors duration-250 ${isActive
                    ? 'text-primary dark:text-primary'
                    : 'hover:text-gray-900 dark:hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="h-6 w-px bg-gray-300 dark:bg-slate-700 transition-colors duration-250"></div>
          <NotificationDropdown />
          <ThemeToggle />
        </div>

        {/* Mobile: notification, theme toggle, and hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <NotificationDropdown />
          <ThemeToggle />
          <button
            type="button"
            aria-label="Open navigation menu"
            aria-expanded={drawerOpen}
            aria-controls="mobile-nav-drawer"
            onClick={() => setDrawerOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors duration-250"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Overlay */}
      {drawerOpen && (
        <div
          data-testid="drawer-overlay"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          aria-hidden="true"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Slide-out drawer */}
      <div
        id="mobile-nav-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed top-0 right-0 z-50 flex h-full w-72 flex-col bg-white dark:bg-slate-950 shadow-xl transition-transform duration-300 ease-in-out md:hidden ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white dark:text-slate-950 text-sm font-semibold">
              SC
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              StellarCert
            </span>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setDrawerOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors duration-250"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer nav links */}
        <nav
          aria-label="Mobile navigation"
          className="flex flex-col gap-1 p-4 text-sm font-medium"
        >
          {navItems.map((item) => (
            <NavLink
              key={`${item.to}-drawer`}
              to={item.to}
              onClick={() => setDrawerOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-250 ${
                  isActive
                    ? 'bg-primary/10 text-primary dark:text-primary'
                    : 'text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-white/5'
                }`
              }
            >
              {item.icon && <span aria-hidden="true">{item.icon}</span>}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

