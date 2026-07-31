import { Link } from 'react-router-dom';
import phantomImg from '@/assets/phantom-editorial.png';

const INCLUSIONS = [
  'Phantom Flex 4K camera body',
  'High-speed lens set (24mm, 50mm, 85mm)',
  'On-board media + reader',
  'PCC power supply',
  'Qualified camera technician',
  'Pelican travel case',
];

const BADGES = ['Fast Setup', 'Pro Support', 'Cinema Quality'];

export function EquipmentEditorial() {
  return (
    <section id="equipment" style={{
      backgroundColor: 'var(--card)',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      padding: '5rem 0',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>

        {/* Section header */}
        <div style={{ marginBottom: '3rem' }}>
          <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>Featured Equipment</p>
        </div>

        {/* Two-column layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'start',
        }}
        className="equip-grid">

          {/* Left — image */}
          <div>
            <img
              src={phantomImg}
              alt="Phantom Flex 4K high-speed cinema camera on professional rig"
              style={{
                width: '100%',
                aspectRatio: '4/3',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>

          {/* Right — content */}
          <div>
            <h2 style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              color: 'var(--foreground)',
              margin: '0 0 0.75rem',
            }}>
              Phantom Flex 4K
            </h2>

            {/* Badges */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              {BADGES.map(b => (
                <span key={b} style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: '0.5625rem',
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--primary)',
                  border: '1px solid var(--primary)',
                  padding: '0.2rem 0.5rem',
                }}>
                  {b}
                </span>
              ))}
            </div>

            <p style={{
              fontSize: '0.875rem',
              color: 'var(--muted-foreground)',
              lineHeight: 1.7,
              margin: '0 0 1.75rem',
            }}>
              The industry-leading high-speed digital cinema camera. Up to 1,000 fps at
              4K resolution — the definitive tool for extreme sports, music videos,
              commercials, and feature films requiring slow-motion capture.
            </p>

            {/* Inclusions */}
            <div style={{ marginBottom: '1.75rem' }}>
              <p style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: '0.625rem',
                fontWeight: 500,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--muted-foreground)',
                margin: '0 0 0.75rem',
              }}>
                What's Included
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {INCLUSIONS.map(item => (
                  <li key={item} style={{
                    fontSize: '0.8125rem',
                    color: 'var(--foreground)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}>
                    <span style={{ width: 4, height: 4, backgroundColor: 'var(--primary)', display: 'inline-block', flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pricing */}
            <div style={{
              borderTop: '1px solid var(--border)',
              paddingTop: '1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'baseline',
              gap: '0.75rem',
            }}>
              <span style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: '1.75rem',
                color: 'var(--foreground)',
                letterSpacing: '-0.02em',
              }}>
                Rs. 1,500<span style={{ fontSize: '1rem', fontFamily: "'Inter', sans-serif", fontWeight: 400 }}>/day</span>
              </span>
              <span style={{
                fontSize: '0.875rem',
                color: 'var(--muted-foreground)',
                textDecoration: 'line-through',
              }}>
                Rs. 3,000/day
              </span>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/#contact" style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: '0.6875rem',
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--background)',
                backgroundColor: 'var(--foreground)',
                padding: '0.65rem 1.25rem',
                textDecoration: 'none',
                transition: 'opacity 0.2s ease',
                display: 'inline-block',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                Book Now
              </Link>
              <Link to="/equipment" style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: '0.6875rem',
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
                padding: '0.65rem 1.25rem',
                textDecoration: 'none',
                transition: 'border-color 0.2s ease',
                display: 'inline-block',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--foreground)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                View All Equipment
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .equip-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </section>
  );
}
