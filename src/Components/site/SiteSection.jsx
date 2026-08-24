// SiteSection.jsx — exact port of film-essence-archive SiteShell.tsx
// Uses the same Tailwind classes as the original
import { Phone, MessageSquare, Mail } from 'lucide-react';
import { contactInfo } from '@/lib/site-media';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export function ContactStrip() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <a
        href={contactInfo.phoneHref}
        className="inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-primary-foreground transition-opacity hover:opacity-90"
      >
        <Phone className="size-4" aria-hidden="true" /> Call {contactInfo.phone}
      </a>
      <a
        href="sms:+13232289022"
        className="inline-flex items-center gap-2 border border-border px-5 py-3 text-sm font-semibold uppercase tracking-[0.1em] transition-colors hover:border-primary hover:text-primary"
      >
        <MessageSquare className="size-4" aria-hidden="true" /> Text us
      </a>
      <a
        href={contactInfo.emailHref}
        className="inline-flex items-center gap-2 border border-border px-5 py-3 text-sm font-semibold uppercase tracking-[0.1em] transition-colors hover:border-primary hover:text-primary"
      >
        <Mail className="size-4" aria-hidden="true" /> {contactInfo.email}
      </a>
    </div>
  );
}

export function PageTitle({ kicker, title, lead }) {
  return (
    <div className="mx-auto max-w-[1200px] px-6 pt-16 pb-10">
      {kicker ? (
        <p className="script-line text-xl sm:text-2xl">{kicker}</p>
      ) : null}
      <h1 className="mt-3 text-3xl uppercase tracking-[0.02em] sm:text-5xl">{title}</h1>
      {lead ? (
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {lead}
        </p>
      ) : null}
    </div>
  );
}

export function Section({ title, children, className = '' }) {
  return (
    <section className={`mx-auto max-w-[1200px] px-6 py-10 ${className}`}>
      {title ? (
        <h2 className="mb-6 text-xl uppercase tracking-[0.14em] text-foreground sm:text-2xl">
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  );
}

export function SiteShell({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
