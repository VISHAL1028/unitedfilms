import heroImg from '@/assets/hero-editorial.png';

const ABOUT_STATS = [
  { label: 'Years in Business',  value: '20+' },
  { label: 'Projects Delivered', value: '500+' },
  { label: 'Countries Reached',  value: '50+' },
  { label: 'Client Satisfaction',value: '100%' },
];

const VALUES = [
  { title: 'Excellence',    desc: 'We pursue perfection in every frame, delivering cinema-quality results that exceed expectations.' },
  { title: 'Innovation',    desc: 'Utilizing cutting-edge technology and creative techniques to push the boundaries of visual storytelling.' },
  { title: 'Collaboration', desc: 'Working closely with our clients to understand their vision and bring it to life authentically.' },
  { title: 'Global Reach',  desc: 'Serving clients worldwide with productions spanning from extreme sports to commercial campaigns.' },
];

export function AboutEditorial() {
  return (
    <section id="about" style={{
      backgroundColor: 'var(--background)',
      borderTop: '1px solid var(--border)',
      padding: '5rem 0',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>

        {/* Two-column: photo left, text right */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          marginBottom: '4rem',
          alignItems: 'start',
        }}
        className="about-grid">

          {/* Photo */}
          <div>
            <img
              src={heroImg}
              alt="United Films crew on location with a classic cinema camera"
              style={{
                width: '100%',
                aspectRatio: '4/3',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>

          {/* Text */}
          <div>
            <p className="eyebrow" style={{ marginBottom: '1rem' }}>About Us</p>
            <h2 style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              color: 'var(--foreground)',
              margin: '0 0 1.25rem',
            }}>
              Two Decades of Cinematic Excellence
            </h2>
            <p style={{
              fontSize: '0.9rem',
              color: 'var(--muted-foreground)',
              lineHeight: 1.75,
              margin: '0 0 2rem',
            }}>
              United Films has been at the forefront of motion picture production for
              over two decades. From music videos to extreme sports documentaries, our
              passion drives us to capture extraordinary moments with unparalleled
              technical expertise.
            </p>

            {/* Stats grid 2×2 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              borderTop: '1px solid var(--border)',
              borderLeft: '1px solid var(--border)',
            }}>
              {ABOUT_STATS.map((s, i) => (
                <div key={s.label} style={{
                  padding: '1.25rem',
                  borderRight: '1px solid var(--border)',
                  borderBottom: '1px solid var(--border)',
                }}>
                  <p style={{
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontSize: '0.5625rem',
                    fontWeight: 500,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--muted-foreground)',
                    margin: '0 0 0.35rem',
                  }}>
                    {s.label}
                  </p>
                  <p style={{
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    fontSize: '1.5rem',
                    fontWeight: 400,
                    color: 'var(--foreground)',
                    margin: 0,
                    letterSpacing: '-0.02em',
                  }}>
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values — four columns, hairline ruled */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          borderTop: '1px solid var(--border)',
          borderLeft: '1px solid var(--border)',
        }}
        className="values-grid">
          {VALUES.map(v => (
            <div key={v.title} style={{
              padding: '2rem 1.5rem',
              borderRight: '1px solid var(--border)',
              borderBottom: '1px solid var(--border)',
            }}>
              <h3 style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: '1.0625rem',
                fontWeight: 400,
                color: 'var(--foreground)',
                margin: '0 0 0.5rem',
              }}>
                {v.title}
              </h3>
              <p style={{
                fontSize: '0.8125rem',
                color: 'var(--muted-foreground)',
                lineHeight: 1.65,
                margin: 0,
              }}>
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .about-grid  { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .values-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 520px) {
          .values-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
