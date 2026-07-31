import { useState } from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { saveMessage } from '@/lib/db';
import { toast } from 'sonner';

const contactInfo = [
  {
    icon: Phone,
    label: 'Phone',
    value: '1 (323) 228-9022',
    href: 'tel:+13232289022',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'vito@unitedfilms.com',
    href: 'mailto:vito@unitedfilms.com',
  },
  {
    icon: MapPin,
    label: 'Locations',
    value: 'US & Europe',
    href: '#',
  },
];

export const ContactSection = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name || !form.email || !form.message) {
      toast.error('Please add your name, email, and message.');
      return;
    }

    setSending(true);
    try {
      await saveMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
        source: 'homepage-contact',
      });
      toast.success('Message sent. We will get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error(error);
      toast.error('Message could not be sent. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Side - Info */}
          <div>
            <span className="inline-block px-4 py-1 rounded-full text-sm font-medium text-primary border border-primary/30 mb-4">
              Get in Touch
            </span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl mb-6">
              LET'S CREATE <span className="text-gradient">TOGETHER</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
              Ready to bring your vision to life? Contact us for free consulting, inquiries, 
              and bookings. Our team is here to help you achieve cinematic excellence.
            </p>

            {/* Contact Cards */}
            <div className="space-y-4 mb-10">
              {contactInfo.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-4 glass-card rounded-xl p-5 group hover:border-primary/50 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</div>
                    <div className="font-semibold group-hover:text-primary transition-colors duration-300">{item.value}</div>
                  </div>
                </a>
              ))}
            </div>

            {/* Availability Badge */}
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm text-muted-foreground">Available for new projects</span>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="glass-card rounded-2xl p-8 lg:p-10">
            <h3 className="font-display text-2xl mb-6">Send us a message</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Name</label>
                  <Input
                    placeholder="Your name"
                    value={form.name}
                    onChange={handleChange('name')}
                    className="bg-background/50 border-border focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Email</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handleChange('email')}
                    className="bg-background/50 border-border focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Subject</label>
                <Input
                  placeholder="Project inquiry"
                  value={form.subject}
                  onChange={handleChange('subject')}
                  className="bg-background/50 border-border focus:border-primary"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Message</label>
                <Textarea
                  placeholder="Tell us about your project..."
                  rows={5}
                  value={form.message}
                  onChange={handleChange('message')}
                  className="bg-background/50 border-border focus:border-primary resize-none"
                />
              </div>
              <Button type="submit" size="lg" disabled={sending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold glow-primary">
                <Send className="w-4 h-4 mr-2" />
                {sending ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
