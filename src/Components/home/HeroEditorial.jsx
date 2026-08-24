import { Link } from 'react-router-dom';

const rule = {
  border: 'none',
  borderTop: '1px solid var(--border)',
  margin: 0,
};

export function HeroEditorial() {
  return (
    <section id="home" style={{
      paddingTop: 'calc(60px + 5rem)',
      paddingBottom: 0,
      backgroundColor: 'var(--background)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>

        {/* Eyebrow */}
        <p className="eyebrow" style={{ marginBottom: '1.5rem' }}>
          Professional Film Production
        </p>

        {/* H1 */}
        <h1 style={{
          fontFamily: "'Poppins', ui-sans-serif, system-ui, sans-serif",
          fontSize: 'clamp(2.75rem, 6vw, 4.5rem)',
          fontWeight: 400,
          lineHeight: 1.08,
          color: 'var(--foreground)',
          letterSpacing: '-0.02em',
          margin: 0,
          maxWidth: '18ch',
        }}>
          Capture Your Vision
        </h1>

        {/* Hairline rule accent */}
        <div style={{
          width: 72,
          height: 1,
          backgroundColor: 'var(--primary)',
          margin: '2rem 0',
        }} />

        {/* Subhead */}
        <p style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: '0.9375rem',
          lineHeight: 1.7,
          color: 'var(--muted-foreground)',
          maxWidth: '40ch',
          margin: '0 0 2.5rem',
          fontWeight: 400,
        }}>
          World-class film production, high-speed camera rentals, and professional
          post-production services. Bringing cinematic excellence to every frame.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '5rem' }}>
          <Link to="/our-work" style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: '0.6875rem',
            fontWeight: 500,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--foreground)',
            textDecoration: 'none',
            border: '1px solid var(--foreground)',
            padding: '0.6rem 1.25rem',
            transition: 'background-color 0.2s ease, color 0.2s ease',
            display: 'inline-block',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--foreground)'; e.currentTarget.style.color = 'var(--background)'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--foreground)'; }}>
            View Our Work
          </Link>

          <a href="#services" style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: '0.6875rem',
            fontWeight: 500,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--muted-foreground)',
            textDecoration: 'none',
            borderBottom: '1px solid var(--border)',
            paddingBottom: '1px',
            transition: 'color 0.2s ease, border-color 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--foreground)'; e.currentTarget.style.borderColor = 'var(--foreground)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted-foreground)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
            Explore Services
          </a>
        </div>
      </div>

      {/* Stats strip — full width with hairline rules */}
      <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 2rem',
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        }}>
          {[
            { label: 'Years Experience',    value: '20+' },
            { label: 'Projects Completed',  value: '500+' },
            { label: 'Ultra HD Quality',    value: '4K' },
          ].map((stat, i) => (
            <div key={stat.label} style={{
              padding: '2rem 0',
              borderRight: i < 2 ? '1px solid var(--border)' : 'none',
              paddingRight: i < 2 ? '2rem' : 0,
              paddingLeft: i > 0 ? '2rem' : 0,
            }}>
              <p style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: '0.625rem',
                fontWeight: 500,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--muted-foreground)',
                margin: '0 0 0.5rem',
              }}>
                {stat.label}
              </p>
              <p style={{
                fontFamily: "'Poppins', ui-sans-serif, system-ui, sans-serif",
                fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                fontWeight: 400,
                color: 'var(--foreground)',
                margin: 0,
                letterSpacing: '-0.02em',
              }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
