import { Link } from 'react-router-dom';

export function FooterEditorial() {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      backgroundColor: 'var(--background)',
      borderTop: '1px solid var(--border)',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        {/* Wordmark */}
        <Link to="/" style={{
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontSize: '1rem',
          fontWeight: 400,
          color: 'var(--foreground)',
          textDecoration: 'none',
          letterSpacing: '-0.01em',
        }}>
          United<span style={{ color: 'var(--primary)' }}>Films</span>
        </Link>

        {/* Center — phone */}
        <a href="tel:+13232289022" style={{
          fontSize: '0.75rem',
          color: 'var(--muted-foreground)',
          textDecoration: 'none',
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '0.02em',
        }}>
          1 (323) 228-9022
        </a>

        {/* Copyright */}
        <p style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: '0.6875rem',
          color: 'var(--muted-foreground)',
          margin: 0,
          letterSpacing: '0.04em',
        }}>
          © {year} United Films. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
