import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/our-work', label: 'Our Work' },
  { to: '/equipment', label: 'Equipment' },
  { to: '/film-restoration', label: 'Film Restoration' },
  { to: '/special-rental', label: 'Special Rental' },
  { to: '/vr-360-3d', label: '360 3D Production' },
  { to: '/contact', label: 'Contact US & Europe' },
  { to: '/about', label: 'About Me' },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <header className="sticky top-0 z-50 bg-nav text-nav-foreground">
      {/* Desktop nav */}
      <nav
        aria-label="Main"
        className="mx-auto hidden max-w-[1600px] flex-wrap items-center gap-x-6 gap-y-1 px-4 py-3 sm:px-6 lg:flex"
      >
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={
              isActive(item.to)
                ? 'text-[0.8125rem] font-medium uppercase tracking-[0.06em] text-nav-foreground underline underline-offset-4'
                : 'text-[0.8125rem] font-medium uppercase tracking-[0.06em] text-nav-foreground/80 transition-colors hover:text-primary'
            }
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Mobile bar */}
      <div className="flex items-center justify-between px-4 py-3 lg:hidden">
        <Link to="/" className="font-display text-base font-bold tracking-tight">
          United<span style={{ color: 'oklch(0.48 0.196 25.6)' }}>Films</span>
        </Link>
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="flex items-center text-nav-foreground"
          style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          className="border-t border-border bg-nav px-4 pb-4 lg:hidden"
          style={{ borderColor: 'oklch(0.14 0.004 20 / 14%)' }}
        >
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block py-2 text-[0.8125rem] font-medium uppercase tracking-[0.06em] text-nav-foreground/80 hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
