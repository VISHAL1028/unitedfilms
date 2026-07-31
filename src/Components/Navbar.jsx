import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';

const navLinks = [
  { name: 'Services', href: '/#services' },
  { name: 'Equipment', href: '/equipment' },
  { name: 'Our Work', href: '/our-work' },
  { name: 'About', href: '/#about' },
  { name: 'Contact', href: '/#contact' },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        backgroundColor: 'var(--background)',
        borderBottom: isScrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'border-color 0.3s ease, background-color 0.3s ease',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: 60, gap: '2rem' }}>

          {/* Clean Wordmark (No Film Icon Box) */}
          <Link to="/" style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: '1.25rem',
            fontWeight: 400,
            letterSpacing: '-0.01em',
            color: 'var(--foreground)',
            textDecoration: 'none',
            flexShrink: 0,
          }}>
            United<span style={{ color: 'var(--primary)' }}>Films</span>
          </Link>

          {/* Desktop Navigation */}
          <nav style={{ display: 'flex', gap: '1.75rem', flex: 1, justifySelf: 'center', justifyContent: 'center' }}
            className="hidden lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: '0.6875rem',
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--muted-foreground)',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.target.style.color = 'var(--foreground)')}
                onMouseLeave={(e) => (e.target.style.color = 'var(--muted-foreground)')}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Items */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginLeft: 'auto' }}>
            <a
              href="tel:+13232289022"
              className="hidden lg:block"
              style={{
                fontSize: '0.75rem',
                color: 'var(--muted-foreground)',
                textDecoration: 'none',
                letterSpacing: '0.02em',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              1 (323) 228-9022
            </a>

            <Link
              to="/#contact"
              className="hidden lg:block"
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
              }}
            >
              Get Quote
            </Link>

            {/* Theme Toggle */}
            <button
              id="theme-toggle"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              style={{
                width: 30,
                height: 30,
                border: '1px solid var(--border)',
                background: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--muted-foreground)',
                transition: 'color 0.2s ease, border-color 0.2s ease',
                flexShrink: 0,
              }}
            >
              {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden"
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: 'var(--foreground)',
                padding: 4,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'var(--background)',
            borderTop: '1px solid var(--border)',
            padding: '1.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: '0.75rem',
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--foreground)',
                textDecoration: 'none',
              }}
            >
              {link.name}
            </Link>
          ))}
          <a
            href="tel:+13232289022"
            style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', textDecoration: 'none' }}
          >
            1 (323) 228-9022
          </a>
        </div>
      )}
    </header>
  );
};

