import { useState } from 'react';
import { saveMessage } from '@/lib/db';
import { toast } from 'sonner';

const CONTACT = [
  { label: 'Phone',     value: '1 (323) 228-9022',   href: 'tel:+13232289022',           },
  { label: 'Email',     value: 'vito@unitedfilms.com', href: 'mailto:vito@unitedfilms.com', },
  { label: 'Locations', value: 'US & Europe',          href: null,                          },
];

const inputStyle = {
  display: 'block',
  width: '100%',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid var(--border)',
  padding: '0.5rem 0',
  fontSize: '0.875rem',
  color: 'var(--foreground)',
  fontFamily: "'Inter', system-ui, sans-serif",
  outline: 'none',
  transition: 'border-color 0.2s ease',
  boxSizing: 'border-box',
};

export function ContactEditorial() {
  const [form, setForm]     = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in name, email, and message.');
      return;
    }
    setSending(true);
    try {
      await saveMessage({
        name:    form.name.trim(),
        email:   form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
        source:  'homepage-contact',
      });
      toast.success("Message sent. We'll be in touch shortly.");
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
      toast.error('Failed to send. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" style={{
      backgroundColor: 'var(--card)',
      borderTop: '1px solid var(--border)',
      padding: '5rem 0',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>Get in Touch</p>
          <h2 style={{
            fontFamily: "'Poppins', ui-sans-serif, system-ui, sans-serif",
            fontSize: 'clamp(1.75rem, 4vw, 3rem)',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            color: 'var(--foreground)',
            margin: '0 0 1rem',
          }}>
            Let's Create Together
          </h2>
          <p style={{
            fontSize: '0.9rem',
            color: 'var(--muted-foreground)',
            lineHeight: 1.7,
            maxWidth: '44ch',
            margin: 0,
          }}>
            Ready to bring your vision to life? Contact us for free consulting, inquiries,
            and bookings. Our team is here to help you achieve cinematic excellence.
          </p>
        </div>

        {/* Two-column: info left, form right */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.5fr',
          gap: '4rem',
          alignItems: 'start',
        }}
        className="contact-grid">

          {/* Info */}
          <div>
            {CONTACT.map(c => (
              <div key={c.label} style={{
                borderBottom: '1px solid var(--border)',
                paddingBottom: '1.25rem',
                marginBottom: '1.25rem',
              }}>
                <p style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: '0.5625rem',
                  fontWeight: 500,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--muted-foreground)',
                  margin: '0 0 0.3rem',
                }}>
                  {c.label}
                </p>
                {c.href ? (
                  <a href={c.href} style={{
                    fontSize: '1rem',
                    color: 'var(--foreground)',
                    textDecoration: 'none',
                    fontFamily: "'Poppins', ui-sans-serif, system-ui, sans-serif",
                    letterSpacing: '-0.01em',
                  }}>
                    {c.value}
                  </a>
                ) : (
                  <p style={{
                    fontSize: '1rem',
                    color: 'var(--foreground)',
                    margin: 0,
                    fontFamily: "'Poppins', ui-sans-serif, system-ui, sans-serif",
                    letterSpacing: '-0.01em',
                  }}>
                    {c.value}
                  </p>
                )}
              </div>
            ))}
            <p style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: '0.625rem',
              fontWeight: 500,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--primary)',
              marginTop: '0.5rem',
            }}>
              Available for New Projects
            </p>
          </div>

          {/* Form */}
          <div style={{
            border: '1px solid var(--border)',
            padding: '2rem',
            backgroundColor: 'var(--background)',
          }}>
            <p style={{
              fontFamily: "'Poppins', ui-sans-serif, system-ui, sans-serif",
              fontSize: '1.125rem',
              fontWeight: 400,
              color: 'var(--foreground)',
              margin: '0 0 1.75rem',
            }}>
              Send us a message
            </p>

            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              <div>
                <label style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: '0.5625rem',
                  fontWeight: 500,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--muted-foreground)',
                  display: 'block',
                  marginBottom: '0.25rem',
                }}>Name</label>
                <input
                  id="contact-name"
                  required
                  value={form.name}
                  onChange={set('name')}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderBottomColor = 'var(--foreground)'}
                  onBlur={e => e.target.style.borderBottomColor = 'var(--border)'}
                />
              </div>

              <div>
                <label style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: '0.5625rem',
                  fontWeight: 500,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--muted-foreground)',
                  display: 'block',
                  marginBottom: '0.25rem',
                }}>Email</label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={set('email')}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderBottomColor = 'var(--foreground)'}
                  onBlur={e => e.target.style.borderBottomColor = 'var(--border)'}
                />
              </div>

              <div>
                <label style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: '0.5625rem',
                  fontWeight: 500,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--muted-foreground)',
                  display: 'block',
                  marginBottom: '0.25rem',
                }}>Subject</label>
                <input
                  id="contact-subject"
                  value={form.subject}
                  onChange={set('subject')}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderBottomColor = 'var(--foreground)'}
                  onBlur={e => e.target.style.borderBottomColor = 'var(--border)'}
                />
              </div>

              <div>
                <label style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: '0.5625rem',
                  fontWeight: 500,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--muted-foreground)',
                  display: 'block',
                  marginBottom: '0.25rem',
                }}>Message</label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={set('message')}
                  style={{
                    ...inputStyle,
                    resize: 'vertical',
                    minHeight: 100,
                  }}
                  onFocus={e => e.target.style.borderBottomColor = 'var(--foreground)'}
                  onBlur={e => e.target.style.borderBottomColor = 'var(--border)'}
                />
              </div>

              <div>
                <button
                  id="contact-submit"
                  type="submit"
                  disabled={sending}
                  style={{
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontSize: '0.6875rem',
                    fontWeight: 500,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--background)',
                    backgroundColor: 'var(--foreground)',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    cursor: sending ? 'not-allowed' : 'pointer',
                    opacity: sending ? 0.6 : 1,
                    transition: 'opacity 0.2s ease',
                  }}>
                  {sending ? 'Sending…' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </section>
  );
}
