// Home page — exact port of film-essence-archive index.tsx
import { Link } from 'react-router-dom';
import { ContactStrip, Section, SiteShell } from '@/components/site/SiteSection';
import { ImageGrid, SpecList, VideoBlock, VideoGrid } from '@/components/site/MediaBlocks';
import { clips, contactInfo, images } from '@/lib/site-media';

const QUICK_LINKS = [
  { to: '/our-work', label: 'View Our Work' },
  { to: '/equipment', label: 'Available Equipment' },
  { to: '/production', label: 'Production' },
  { to: '/post-production', label: 'Post production' },
  { to: '/film-restoration', label: 'Full film restoration — free test' },
  { to: '/prices', label: 'Prices' },
];

const PACKAGE = [
  'Phantom Flex 4K camera',
  'Recorder + preview monitor',
  'Tripod',
  'Lenses 50mm, 100mm, 300mm (vintage lens set available)',
  'Remote control',
  'Underwater housing for the Phantom camera (in making)',
  'Splash bag camera protection',
  'Flame relighting workstation — save time and money on set',
];

export default function Index() {
  return (
    <SiteShell>
      {/* Hero title band */}
      <div className="mx-auto max-w-[1200px] px-6 py-8">
        <div className="rule-band py-4 text-center">
          <p className="font-display text-4xl font-bold sm:text-6xl">UnitedFilms.com</p>
        </div>
      </div>

      <Section>
        <VideoBlock clip={clips.hero} />
      </Section>

      <Section>
        <div className="flex flex-wrap justify-center gap-3">
          {QUICK_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="border border-border px-5 py-3 text-sm font-semibold uppercase tracking-[0.1em] transition-colors hover:border-primary hover:text-primary"
            >
              {l.label}
            </Link>
          ))}
          <a
            href="https://www.phantomhighspeed.com/products/cameras/4kmedia/flex4k"
            target="_blank"
            rel="noreferrer"
            className="border border-border px-5 py-3 text-sm font-semibold uppercase tracking-[0.1em] transition-colors hover:border-primary hover:text-primary"
          >
            Phantom info
          </a>
        </div>
      </Section>

      <Section>
        <div className="grid items-center gap-10 md:grid-cols-2">
          <img
            src={images.phantomHero}
            alt="Phantom Flex 4K camera on set"
            className="w-full border border-border object-cover"
          />
          <div>
            <h2 className="text-2xl uppercase leading-tight sm:text-4xl">
              Give your production edge with our Phantom Flex camera
            </h2>
            <p className="script-line mt-4 text-2xl">50% off — lock in your special.</p>
            <p className="mt-5 text-lg text-muted-foreground">
              Shoot two formats at the same time. You get the same price as an Arri Alexa, but with
              far more versatility.
            </p>
            <ul className="mt-6 space-y-2 text-muted-foreground">
              <li>— Standard motion: one channel at 24–30 frames per second</li>
              <li>— High-speed action: a second channel up to 2000 frames per second</li>
            </ul>
            <div className="mt-8">
              <ContactStrip />
            </div>
          </div>
        </div>
      </Section>

      <Section title="Phantom Flex 4K camera for hire">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="text-muted-foreground">
              Film production, live sports, expeditions, commercials, research. Our rental includes a
              skilled camera technician who helps operate the camera and manage footage downloads,
              ensuring a seamless production experience.
            </p>
            <p className="mt-4 text-muted-foreground">
              Camera + lens set + tripod + c-stands + 3 ton lights, electric, grip and more + camera
              tech. Available on set: Nucoda / Flame.
            </p>
            <p className="script-line mt-6 text-xl">
              Unlock incredible cinematic potential with our limited-time offer!
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-sm uppercase tracking-[0.16em] text-accent">
              Included in the package
            </h3>
            <SpecList items={PACKAGE} />
          </div>
        </div>
      </Section>

      <Section title="Phantom Flex 4K footage">
        <VideoGrid clips={clips.showcase} />
        <p className="mt-6 text-muted-foreground">
          We do motion picture production, music videos, commercials and extreme sports — our
          passion is surfing and skiing. This three-and-a-half minute music video took only 3.5
          seconds to shoot with the Phantom Flex 4K.
        </p>
      </Section>

      <Section title="Relighting with Autodesk Flame">
        <div className="grid gap-6 md:grid-cols-2">
          <VideoBlock clip={clips.relighting} />
          <div>
            <p className="text-muted-foreground">
              A Flame relighting workstation can travel with the camera package — save time and money
              while achieving the exact lighting you want with this special effects tool.
            </p>
            <div className="mt-6">
              <ImageGrid images={images.post} alt="Post production suite" columns={3} />
            </div>
          </div>
        </div>
      </Section>

      <Section title="Featured Projects & Showreels">
        <div className="border border-border bg-card p-8 md:p-12 text-center">
          <p className="script-line text-2xl">Cinematic excellence in every frame</p>
          <h3 className="mt-3 font-display text-2xl sm:text-4xl font-bold uppercase">
            Explore Our Portfolio & High-Speed Work
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            From award-winning automotive commercials and extreme sports cinematography to 16/35mm archival film restoration and 360° 3D immersive stages.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/our-work"
              className="bg-primary px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-opacity hover:opacity-90 shadow-lg"
            >
              View All Projects →
            </Link>
            <Link
              to="/equipment"
              className="border border-border px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Browse Equipment →
            </Link>
          </div>
        </div>
      </Section>

      <Section title="Why choose us">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            'Capture both high-speed and standard-speed movement with precision and clarity.',
            'Tailored solutions for your production needs — flexibility and creativity.',
            'Competitive pricing similar to Arri, with a much more flexible camera.',
          ].map((t) => (
            <p key={t} className="border-l-2 border-primary bg-card p-5 text-muted-foreground">
              {t}
            </p>
          ))}
        </div>
        <p className="mt-8 text-muted-foreground">
          For free consulting, inquiries and bookings, call us at{' '}
          <a className="text-foreground hover:text-primary" href={contactInfo.phoneHref}>
            {contactInfo.phone}
          </a>
          . Don't miss out on this opportunity to elevate your production with the Phantom Flex 4K.
        </p>
      </Section>
    </SiteShell>
  );
}
