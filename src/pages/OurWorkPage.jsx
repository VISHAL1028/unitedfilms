import { useState, useEffect, useRef } from 'react';
import { Play, X, ExternalLink, Clapperboard, Film } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getAllWorks } from '@/lib/works';

/* ─── Dummy / fallback data ─── */
const FALLBACK_WORKS = [
  {
    id: 'dummy-1',
    title: 'Phantom High-Speed Chase',
    category: 'Commercial',
    description: 'A high-octane car commercial filmed entirely on the Phantom Flex 4K at 2,500 fps, capturing every splash of rain and spark of tyres in stunning slow motion.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80',
    videoUrl: '',
    year: '2024',
    client: 'AutoBrand India',
    tags: ['High-Speed', '4K', 'Commercial'],
  },
  {
    id: 'dummy-2',
    title: 'Monsoon Reel',
    category: 'Music Video',
    description: 'An award-winning music video shot in the heavy monsoon of Kerala, blending slow-motion rain droplets with vibrant dance choreography.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    videoUrl: '',
    year: '2024',
    client: 'Sony Music India',
    tags: ['Music Video', 'Slow-Mo', 'Outdoor'],
  },
  {
    id: 'dummy-3',
    title: 'Flame Restoration Series',
    category: 'Film Restoration',
    description: 'Digitally restored and relit a 1970s Bollywood classic frame-by-frame using our proprietary Flame workstation, bringing it back to its cinematic glory.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80',
    videoUrl: '',
    year: '2023',
    client: 'FilmHeritage India',
    tags: ['Restoration', 'VFX', 'Flame'],
  },
  {
    id: 'dummy-4',
    title: 'Documentary — Streets of Mumbai',
    category: 'Documentary',
    description: 'A raw, cinematic documentary following street photographers across Mumbai, captured on film and later processed in our in-house lab.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80',
    videoUrl: '',
    year: '2023',
    client: 'Netflix India',
    tags: ['Documentary', 'Film', 'Lab'],
  },
  {
    id: 'dummy-5',
    title: '3D Production — VFX Short',
    category: '3D & VFX',
    description: 'Full 360° 3D environment build and VFX compositing for a sci-fi short film that screened at IFFI Goa 2023.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1620778182530-703effa65e34?w=800&q=80',
    videoUrl: '',
    year: '2023',
    client: 'Independent Director',
    tags: ['3D', 'VFX', 'Short Film'],
  },
  {
    id: 'dummy-6',
    title: 'Wedding Cinematic Film',
    category: 'Wedding',
    description: "A cinematic wedding film shot across two days in Udaipur using anamorphic lenses, with colour grade inspired by Wes Anderson's palette.",
    thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    videoUrl: '',
    year: '2024',
    client: 'Private Client',
    tags: ['Wedding', 'Anamorphic', 'Colour Grade'],
  },
];

/* ─── Single Work Card ─── */
const WorkCard = ({ work, onOpenLightbox }) => {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);

  const startPlay = (e) => {
    e.stopPropagation();
    setPlaying(true);
    setTimeout(() => videoRef.current?.play(), 50);
  };

  const stopPlay = (e) => {
    e.stopPropagation();
    videoRef.current?.pause();
    setPlaying(false);
  };

  return (
    <div className="group bg-card border border-border overflow-hidden flex flex-col transition-colors duration-200 hover:bg-muted/40">
      {/* Media area */}
      <div
        className="relative bg-muted border-b border-border flex items-center justify-center aspect-[16/10] overflow-hidden cursor-pointer"
        onClick={playing ? undefined : () => onOpenLightbox(work)}
      >
        {/* Thumbnail */}
        <img
          src={work.thumbnailUrl}
          alt={work.title}
          className={`w-full h-full object-cover transition-transform duration-300 ${playing ? 'opacity-0 scale-95 pointer-events-none' : 'group-hover:scale-105'}`}
          loading="lazy"
        />

        {/* Inline video */}
        {work.videoUrl && (
          <video
            ref={videoRef}
            src={work.videoUrl}
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover bg-black transition-opacity duration-300 ${playing ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          />
        )}

        {/* Category badge */}
        <span className="absolute top-4 left-4 px-2.5 py-1 text-[0.625rem] font-medium uppercase tracking-wider bg-background/90 text-foreground border border-border z-10">
          {work.category}
        </span>

        {/* Video indicator badge */}
        {work.videoUrl && !playing && (
          <span className="absolute top-4 right-4 px-2.5 py-1 text-[0.625rem] font-medium uppercase tracking-wider bg-background/90 text-primary border border-border z-10 flex items-center gap-1">
            <Play style={{ width: 8, height: 8 }} fill="currentColor" /> VIDEO
          </span>
        )}

        {/* Hover play button */}
        {!playing && (
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
            <button
              className="w-10 h-10 rounded-full bg-background/90 text-foreground border border-border flex items-center justify-center shadow-md hover:scale-110 transition-transform"
              onClick={work.videoUrl ? startPlay : () => onOpenLightbox(work)}
            >
              {work.videoUrl
                ? <Play style={{ width: 14, height: 14, marginLeft: 2 }} fill="currentColor" />
                : <ExternalLink style={{ width: 14, height: 14 }} />}
            </button>
          </div>
        )}

        {/* Close button when playing */}
        {playing && (
          <button
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/90 text-foreground border border-border flex items-center justify-center z-20"
            onClick={stopPlay}
          >
            <X style={{ width: 14, height: 14 }} />
          </button>
        )}
      </div>

      {/* Card body */}
      <div className="p-6 flex flex-col flex-1 cursor-pointer" onClick={() => onOpenLightbox(work)}>
        <p className="text-[0.6875rem] font-medium uppercase tracking-widest text-muted-foreground mb-1">
          {work.client} · {work.year}
        </p>
        <h3 style={{ fontFamily: "'Instrument Serif', Georgia, serif" }} className="text-xl font-normal text-foreground mb-3 leading-tight">
          {work.title}
        </h3>
        <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
          {(work.tags || []).map((t) => (
            <span
              key={t}
              className="text-[0.625rem] font-medium uppercase tracking-wider text-muted-foreground bg-muted border border-border px-2 py-0.5"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Lightbox Modal ─── */
const Lightbox = ({ work, onClose }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-card border border-border overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-background border border-border text-foreground flex items-center justify-center hover:bg-muted transition-colors"
          onClick={onClose}
        >
          <X style={{ width: 16, height: 16 }} />
        </button>

        <div className="bg-muted border-b border-border aspect-video flex items-center justify-center overflow-hidden">
          {work.videoUrl ? (
            <video ref={videoRef} src={work.videoUrl} controls autoPlay playsInline className="w-full h-full object-cover" />
          ) : (
            <img src={work.thumbnailUrl} alt={work.title} className="w-full h-full object-cover" />
          )}
        </div>

        <div className="p-6 md:p-8">
          <span className="text-[0.625rem] font-medium uppercase tracking-widest text-primary border border-primary/30 px-2 py-0.5 inline-block mb-3">
            {work.category}
          </span>
          <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif" }} className="text-2xl md:text-3xl font-normal text-foreground mb-3">
            {work.title}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-2xl">
            {work.description}
          </p>
          <div className="flex flex-wrap gap-6 pt-4 border-t border-border text-xs">
            <div>
              <span className="block text-[0.625rem] uppercase tracking-widest text-muted-foreground font-semibold">Client</span>
              <span className="text-foreground font-medium">{work.client || '—'}</span>
            </div>
            <div>
              <span className="block text-[0.625rem] uppercase tracking-widest text-muted-foreground font-semibold">Year</span>
              <span className="text-foreground font-medium">{work.year || '—'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Page ─── */
const OurWorkPage = () => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxWork, setLightboxWork] = useState(null);

  useEffect(() => {
    getAllWorks()
      .then((data) => setWorks(data.length > 0 ? data : FALLBACK_WORKS))
      .catch(() => setWorks(FALLBACK_WORKS))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-28 pb-12 lg:pt-36 lg:pb-16 border-b border-border bg-background">
        <div className="container mx-auto px-6 lg:px-10 max-w-7xl">
          <p className="eyebrow mb-4">Portfolio</p>
          <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif" }} className="text-4xl md:text-6xl lg:text-7xl font-normal mb-4 tracking-tight leading-none text-foreground">
            Our <span className="text-primary italic">Work</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
            From high-speed cinema to film restoration — a curated showcase of our most celebrated productions, campaigns, and creative projects.
          </p>
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-6 lg:px-10 max-w-7xl">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card border border-border h-80 animate-pulse" />
              ))}
            </div>
          ) : works.length === 0 ? (
            <div className="text-center py-16 border border-border bg-card p-8">
              <Film className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No projects yet.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {works.map((work) => (
                <WorkCard key={work.id} work={work} onOpenLightbox={setLightboxWork} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 border-t border-border bg-card text-center">
        <div className="container mx-auto px-6 lg:px-10 max-w-2xl">
          <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif" }} className="text-3xl md:text-4xl font-normal mb-3 text-foreground">
            Ready to create <span className="text-primary italic">something extraordinary?</span>
          </h2>
          <p className="text-sm text-muted-foreground mb-6">Let's collaborate on your next production.</p>
          <a
            href="/#contact"
            className="inline-block text-xs font-medium uppercase tracking-widest text-background bg-foreground border border-foreground px-6 py-3 transition-opacity hover:opacity-85"
          >
            Start a Project
          </a>
        </div>
      </section>

      <Footer />

      {/* Lightbox Modal */}
      {lightboxWork && (
        <Lightbox work={lightboxWork} onClose={() => setLightboxWork(null)} />
      )}
    </div>
  );
};

export default OurWorkPage;

