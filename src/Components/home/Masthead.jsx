import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

const NAV = [
  { label: 'Services',  href: '/#services'   },
  { label: 'Equipment', href: '/equipment'    },
  { label: 'Our Work',  href: '/our-work'     },
  { label: 'About',     href: '/#about'       },
  { label: 'Contact',   href: '/#contact'     },
];

export function Masthead() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        backgroundColor: 'var(--background)',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'border-color 0.3s ease, background-color 0.3s ease',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: 60, gap: '2rem' }}>

          {/* Wordmark */}
          <Link to="/" style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: '1.2rem',
            fontWeight: 400,
            letterSpacing: '-0.01em',
            color: 'var(--foreground)',
            textDecoration: 'none',
            flexShrink: 0,
          }}>
            United<span style={{ color: 'var(--primary)' }}>Films</span>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', gap: '1.75rem', flex: 1, justifyContent: 'center' }}
            className="hidden-mobile">
            {NAV.map(n => (
              <Link key={n.href} to={n.href} style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: '0.6875rem',
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--muted-foreground)',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => e.target.style.color = 'var(--foreground)'}
              onMouseLeave={e => e.target.style.color = 'var(--muted-foreground)'}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginLeft: 'auto' }}>
            <a href="tel:+910000000000"
              className="hidden-mobile"
              style={{
                fontSize: '0.75rem',
                color: 'var(--muted-foreground)',
                textDecoration: 'none',
                letterSpacing: '0.02em',
                fontVariantNumeric: 'tabular-nums',
              }}>
              +910000000000
            </a>

            <Link to="/#contact"
              className="hidden-mobile"
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: '0.6875rem',
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--primary)',
                textDecoration: 'none',
                borderBottom: '1px solid var(--primary)',
                paddingBottom: '1px',
                transition: 'opacity 0.2s ease',
              }}>
              Get Quote
            </Link>

            {/* Theme toggle */}
            <button
              id="theme-toggle"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
              style={{
                width: 30, height: 30,
                border: '1px solid var(--border)',
                background: 'transparent',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--muted-foreground)',
                transition: 'color 0.2s ease, border-color 0.2s ease',
                flexShrink: 0,
              }}>
              {theme === 'dark'
                ? <Sun  size={13} />
                : <Moon size={13} />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="show-mobile"
              style={{
                border: 'none', background: 'transparent',
                cursor: 'pointer', color: 'var(--foreground)',
                padding: 4, display: 'none',
              }}>
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          backgroundColor: 'var(--background)',
          borderTop: '1px solid var(--border)',
          padding: '1.5rem 2rem',
          display: 'flex', flexDirection: 'column', gap: '1.25rem',
        }}>
          {NAV.map(n => (
            <Link key={n.href} to={n.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: '0.75rem',
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--foreground)',
                textDecoration: 'none',
              }}>
              {n.label}
            </Link>
          ))}
          <a href="tel:+910000000000"
            style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', textDecoration: 'none' }}>
            +910000000000
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
