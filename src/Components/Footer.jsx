import { Link } from 'react-router-dom';
import { contactInfo } from '@/lib/site-media';

const SECTIONS = [
  { to: '/our-work', label: 'Our Work' },
  { to: '/equipment', label: 'Equipment' },
  { to: '/film-restoration', label: 'Film Restoration' },
  { to: '/special-rental', label: 'Special Rental' },
  { to: '/vr-360-3d', label: '360 3D Production' },
  { to: '/about', label: 'About Me' },
  { to: '/production', label: 'Production' },
  { to: '/post-production', label: 'Post production' },
  { to: '/prices', label: 'Prices' },
  { to: '/contact', label: 'Contact US & Europe' },
];

export const Footer = () => (
  <footer className="mt-24 border-t border-border" style={{ backgroundColor: 'var(--color-secondary, oklch(0.2 0.004 20))' }}>
    <div className="mx-auto grid max-w-[1200px] gap-10 px-6 py-14 md:grid-cols-3">
      <div>
        <p className="font-display text-2xl font-bold">UnitedFilms.com</p>
        <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
          Motion picture production, post production and film restoration. 20+ years of
          experience in production and post production.
        </p>
      </div>
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em]">Call us</h2>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          <li>USA <a className="text-foreground hover:text-primary" href={contactInfo.phoneHref}>{contactInfo.phone}</a></li>
          <li>EU Czech Republic — David +420 605 450 595</li>
          <li>Germany — Mathias Janhshen +420 737 900 058</li>
          <li>Free consulting <a className="text-foreground hover:text-primary" href={contactInfo.consultingHref}>{contactInfo.consulting}</a></li>
        </ul>
      </div>
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em]">Sections</h2>
        <ul className="mt-4 grid grid-cols-2 gap-y-2 text-sm text-muted-foreground">
          {SECTIONS.map((item) => (
            <li key={item.to}>
              <Link className="hover:text-primary" to={item.to}>{item.label}</Link>
            </li>
          ))}
          <li><Link className="hover:text-primary" to="/login">Admin Login</Link></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-border px-6 py-5 text-center text-xs uppercase tracking-[0.18em] text-muted-foreground">
      {`\u00A9 ${new Date().getFullYear()} United Films \u2014 Vit Kobliha`}
    </div>
  </footer>
);
