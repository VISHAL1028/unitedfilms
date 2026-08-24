import { Link } from 'react-router-dom';
import { services } from '@/pages/services/serviceData';

export function ServicesEditorial() {
  return (
    <section id="services" style={{
      backgroundColor: 'var(--background)',
      padding: '5rem 0',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '3.5rem' }}>
          <p className="eyebrow" style={{ marginBottom: '1rem' }}>Our Services</p>
          <h2 style={{
            fontFamily: "'Poppins', ui-sans-serif, system-ui, sans-serif",
            fontSize: 'clamp(1.75rem, 4vw, 3rem)',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            color: 'var(--foreground)',
            margin: '0 0 1rem',
          }}>
            Complete Film Solutions
          </h2>
          <p style={{
            fontSize: '0.9375rem',
            color: 'var(--muted-foreground)',
            lineHeight: 1.7,
            maxWidth: '44ch',
            margin: 0,
          }}>
            From initial concept to final delivery, we provide comprehensive filmmaking
            services tailored to your vision and budget.
          </p>
        </div>

        {/* 3×2 editorial grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          borderTop: '1px solid var(--border)',
          borderLeft: '1px solid var(--border)',
        }}
        className="services-grid">
          {services.map((svc, i) => (
            <Link
              key={svc.id}
              to={svc.route ?? `/services/${svc.id}`}
              style={{
                display: 'block',
                padding: '2rem',
                borderRight: '1px solid var(--border)',
                borderBottom: '1px solid var(--border)',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--muted)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {/* Number */}
              <p style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: '0.6875rem',
                fontWeight: 500,
                color: 'var(--primary)',
                letterSpacing: '0.08em',
                margin: '0 0 0.75rem',
              }}>
                {String(i + 1).padStart(2, '0')}
              </p>

              {/* Title */}
              <h3 style={{
                fontFamily: "'Poppins', ui-sans-serif, system-ui, sans-serif",
                fontSize: '1.25rem',
                fontWeight: 400,
                color: 'var(--foreground)',
                margin: '0 0 0.75rem',
                letterSpacing: '-0.01em',
              }}>
                {svc.title}
              </h3>

              {/* Description */}
              <p style={{
                fontSize: '0.8125rem',
                color: 'var(--muted-foreground)',
                lineHeight: 1.65,
                margin: '0 0 1.25rem',
              }}>
                {svc.description}
              </p>

              {/* Features — small-caps */}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {svc.features.map(f => (
                  <li key={f} style={{
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontSize: '0.625rem',
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--muted-foreground)',
                  }}>
                    {f}
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .services-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 580px) {
          .services-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
