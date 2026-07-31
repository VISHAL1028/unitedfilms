import { Link } from 'react-router-dom';

const footerLinks = {
  services: [
    { name: 'Film Production', href: '/#services' },
    { name: 'Post Production', href: '/#services' },
    { name: 'Film Restoration', href: '/#services' },
    { name: 'Equipment Rental', href: '/equipment' },
  ],
  company: [
    { name: 'About Us', href: '/#about' },
    { name: 'Our Work', href: '/our-work' },
    { name: 'Contact', href: '/#contact' },
    { name: 'Admin Login', href: '/login' },
  ],
  resources: [
    { name: 'Phantom Flex 4K', href: '/equipment' },
    { name: 'Pricing & Rental', href: '/equipment' },
    { name: '360° 3D Production', href: '/#services' },
    { name: 'Flame Relighting', href: '/#services' },
  ],
};

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: 'var(--card)', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '4rem 2rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3.5rem' }}>

          {/* Brand */}
          <div style={{ gridColumn: 'span 2' }}>
            <Link to="/" style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: '1.5rem',
              fontWeight: 400,
              color: 'var(--foreground)',
              textDecoration: 'none',
              display: 'inline-block',
              marginBottom: '1rem',
              letterSpacing: '-0.01em',
            }}>
              United<span style={{ color: 'var(--primary)' }}>Films</span>
            </Link>
            <p style={{
              fontSize: '0.8125rem',
              color: 'var(--muted-foreground)',
              lineHeight: 1.7,
              maxWidth: '320px',
              margin: 0,
            }}>
              World-class film production, high-speed Phantom camera rentals, and professional post-production services. Bringing cinematic excellence to every project.
            </p>
          </div>

          {/* Links: Services */}
          <div>
            <p className="eyebrow" style={{ marginBottom: '1rem' }}>Services</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = 'var(--foreground)'}
                    onMouseLeave={e => e.target.style.color = 'var(--muted-foreground)'}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links: Company */}
          <div>
            <p className="eyebrow" style={{ marginBottom: '1rem' }}>Company</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = 'var(--foreground)'}
                    onMouseLeave={e => e.target.style.color = 'var(--muted-foreground)'}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links: Resources */}
          <div>
            <p className="eyebrow" style={{ marginBottom: '1rem' }}>Resources</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = 'var(--foreground)'}
                    onMouseLeave={e => e.target.style.color = 'var(--muted-foreground)'}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '0.6875rem', color: 'var(--muted-foreground)', margin: 0 }}>
            © {year} United Films. All rights reserved.
          </p>
          <a href="tel:+13232289022" style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', textDecoration: 'none', fontVariantNumeric: 'tabular-nums' }}>
            1 (323) 228-9022
          </a>
        </div>
      </div>
    </footer>
  );
};
