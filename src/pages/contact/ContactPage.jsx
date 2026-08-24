import { useState } from 'react';
import { Send, CheckCircle2, Phone, Mail, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { ContactStrip, PageTitle, Section, SiteShell } from '@/components/site/SiteSection';
import { contactInfo } from '@/lib/site-media';
import { saveMessage } from '@/lib/db';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Camera & Lens Rental',
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Please fill in your name, email, and message.');
      return;
    }

    setSending(true);
    try {
      await saveMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        service: form.service,
        subject: form.subject.trim() || `${form.service} Enquiry`,
        message: form.message.trim(),
        source: 'contact-page',
      });
      toast.success('Your enquiry has been received. We will get back to you shortly.');
      setSent(true);
      setForm({
        name: '',
        email: '',
        phone: '',
        service: 'Camera & Lens Rental',
        subject: '',
        message: '',
      });
    } catch (err) {
      console.error('Contact enquiry submission error:', err);
      toast.error('Failed to submit enquiry. Please try again or call us directly.');
    } finally {
      setSending(false);
    }
  };

  return (
    <SiteShell>
      <PageTitle
        kicker="Call us for the best price on the market"
        title="Contact — US & Europe"
        lead="20+ years of experience in high-speed cinematography, motion picture production, and digital restoration. Send us an enquiry for bookings, rentals, and free project consulting."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          {/* Left Column: Direct Contact Details */}
          <div className="space-y-8 lg:col-span-5">
            <div className="border border-border bg-card p-6">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">USA Headquarters</h2>
              <a
                href={contactInfo.phoneHref}
                className="mt-3 block font-display text-2xl sm:text-3xl font-bold text-foreground hover:text-primary transition-colors"
              >
                {contactInfo.phone}
              </a>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Phone size={14} className="text-accent" />
                  <a href={contactInfo.consultingHref} className="hover:text-primary transition-colors">
                    {contactInfo.consulting} <span className="text-xs text-accent">(Free Consulting)</span>
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <Mail size={14} className="text-accent" />
                  <a href={contactInfo.emailHref} className="hover:text-primary transition-colors">
                    {contactInfo.email}
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <MapPin size={14} className="text-accent" />
                  <span>Los Angeles, California · United States</span>
                </p>
              </div>
            </div>

            <div className="border border-border bg-card p-6">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">European Operations</h2>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                <div>
                  <p className="font-semibold text-foreground">Czech Republic</p>
                  <p className="mt-0.5">David <a className="text-accent hover:text-primary" href="tel:+420605450595">+420 605 450 595</a></p>
                </div>
                <div className="border-t border-border/50 pt-2">
                  <p className="font-semibold text-foreground">Germany</p>
                  <p className="mt-0.5">Mathias Janhshen <a className="text-accent hover:text-primary" href="tel:+420737900058">+420 737 900 058</a></p>
                </div>
              </div>
            </div>

            <div>
              <ContactStrip />
            </div>
          </div>

          {/* Right Column: Backend-connected Contact Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="border border-border bg-card p-6 sm:p-8 shadow-xl">
              <div className="mb-6">
                <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-primary">
                  Online Enquiry Form
                </span>
                <h3 className="mt-1 font-display text-xl sm:text-2xl font-bold text-foreground">
                  Send Us a Message
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Fill out the details below and your enquiry will be sent directly to our production team.
                </p>
              </div>

              {sent && (
                <div className="mb-6 flex items-start gap-3 border border-emerald-500/40 bg-emerald-500/10 p-4 text-emerald-400">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider">Message Received</p>
                    <p className="mt-1 text-xs text-emerald-300">
                      Thank you for contacting United Films. Our team will review your enquiry and respond within 24 hours.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[0.6875rem] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={form.name}
                      onChange={handleChange('name')}
                      className="w-full border border-border bg-secondary/30 px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.6875rem] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. john@example.com"
                      value={form.email}
                      onChange={handleChange('email')}
                      className="w-full border border-border bg-secondary/30 px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[0.6875rem] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +1 (555) 000-0000"
                      value={form.phone}
                      onChange={handleChange('phone')}
                      className="w-full border border-border bg-secondary/30 px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.6875rem] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                      Service / Project Type
                    </label>
                    <select
                      value={form.service}
                      onChange={handleChange('service')}
                      className="w-full border border-border bg-secondary/30 px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none transition-colors"
                    >
                      <option value="Phantom Flex 4K Rental">Phantom Flex 4K Camera Rental</option>
                      <option value="Film Production">Film Production & Shooting</option>
                      <option value="Film Restoration">16/35mm Film Restoration</option>
                      <option value="Flame Relighting & Post">Flame Relighting & Post Production</option>
                      <option value="VR 360 3D Production">VR 360 3D Virtual Stage Backdrops</option>
                      <option value="Equipment Buy / Sell / Trade">Equipment Buy / Sell / Trade</option>
                      <option value="General Consulting">Free Consulting & Rates</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[0.6875rem] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                    Subject (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rental inquiry for upcoming shoot dates"
                    value={form.subject}
                    onChange={handleChange('subject')}
                    className="w-full border border-border bg-secondary/30 px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[0.6875rem] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                    Your Message / Requirements *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe your project, shooting schedule, camera/lens needs, or restoration details..."
                    value={form.message}
                    onChange={handleChange('message')}
                    className="w-full border border-border bg-secondary/30 px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none transition-colors resize-y"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary px-8 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground shadow-lg transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
                >
                  {sending ? (
                    'Sending Message...'
                  ) : (
                    <>
                      <Send size={14} /> Send Enquiry Now
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </Section>
    </SiteShell>
  );
}
