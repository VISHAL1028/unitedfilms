import { useState, useEffect, useRef, useMemo } from 'react';
import { Play, X, ExternalLink, ArrowRight } from 'lucide-react';
import { ContactStrip, PageTitle, Section, SiteShell } from '@/components/site/SiteSection';
import { getAllWorks } from '@/lib/works';

/* ─── Fallback Project Showcases ─── */
const FALLBACK_WORKS = [
  {
    id: 'work-1',
    title: 'Phantom High-Speed Chase',
    category: 'Commercial',
    description: 'A high-octane automotive commercial filmed on the Phantom Flex 4K at 2,500 fps, capturing every splash of water and tire drift in crystal slow motion.',
    thumbnailUrl: '/archive/img-86faa472-b5b6-4f5f-b278-ca7332a676dd.jpg',
    videoUrl: '/archive/vid-264269.mp4',
    year: '2024',
    client: 'United Films Production',
    tags: ['High-Speed', '4K', 'Commercial'],
  },
  {
    id: 'work-2',
    title: 'Extreme Action & Ocean Waves',
    category: 'Action Sports',
    description: 'High-speed extreme sports cinematography capturing surfing, skiing, and board movements with millisecond precision.',
    thumbnailUrl: '/archive/img-bd65e40b-73f6-4edf-b025-6c32b11b1186.jpg',
    videoUrl: '/archive/vid-224384.mp4',
    year: '2024',
    client: 'Action Sports Feature',
    tags: ['Surfing', 'Slow-Mo', 'Outdoor'],
  },
  {
    id: 'work-3',
    title: 'Autodesk Flame Relighting Series',
    category: 'Film Restoration',
    description: 'Digitally restored and relit archival 16mm/35mm footage frame-by-frame using our on-set Flame finishing workstation.',
    thumbnailUrl: '/archive/img-f4160e31-3212-4c8c-8f53-b5649439f7b7.jpg',
    videoUrl: '/archive/vid-203960.mp4',
    year: '2023',
    client: 'Archive Film Preservation',
    tags: ['Restoration', 'VFX', 'Flame'],
  },
  {
    id: 'work-4',
    title: '3.5-Second Music Video Shoot',
    category: 'Music Video',
    description: 'A full 3.5-minute music video shot in only 3.5 seconds of real time using the Phantom Flex 4K at 1000 fps.',
    thumbnailUrl: '/archive/img-bd1cb60d-90ca-4f8f-89e9-f4c6e5e3b0fc.jpg',
    videoUrl: '/archive/vid-171360.mp4',
    year: '2023',
    client: 'Music Video Production',
    tags: ['Music Video', 'High-Speed', 'Creative'],
  },
  {
    id: 'work-5',
    title: '16/35mm Scanning & Ultrasonic Cleaning',
    category: 'Film Restoration',
    description: 'End-to-end SMPTE film restoration workflow using Spirit 4K telecine and Phoenix digital grading.',
    thumbnailUrl: '/archive/img-02da0c35-8c89-4e16-9d31-24f6e883260f.jpg',
    videoUrl: '/archive/vid-190171.mp4',
    year: '2023',
    client: 'Heritage Reel Vault',
    tags: ['16mm', '35mm', 'Scanning'],
  },
  {
    id: 'work-6',
    title: '360° 3D VR Virtual Backdrop',
    category: '360 VR',
    description: '8K-12K high resolution 360-degree immersive capture for virtual stage LED backgrounds and medical VR productions.',
    thumbnailUrl: '/archive/img-bbc5aead-6b5c-409f-85bc-37201a26fec4.jpg',
    videoUrl: '/archive/vid-306188.mp4',
    year: '2024',
    client: 'Virtual Stage Backdrops',
    tags: ['360 VR', 'Unreal Engine', 'HDR'],
  },
];

/* ─── Work Card ─── */
const WorkCard = ({ work, onOpenLightbox }) => {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const startPlay = (e) => {
    e.stopPropagation();
    setPlaying(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const stopPlay = (e) => {
    e.stopPropagation();
    setPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div className="group flex flex-col overflow-hidden border border-border bg-card transition-all hover:border-primary/60">
      {/* Media thumbnail / inline video */}
      <div className="relative aspect-video overflow-hidden bg-black cursor-pointer" onClick={() => onOpenLightbox(work)}>
        <img
          src={work.thumbnailUrl || '/archive/img-bd65e40b-73f6-4edf-b025-6c32b11b1186.jpg'}
          alt={work.title}
          className={`h-full w-full object-cover transition-transform duration-500 ${playing ? 'opacity-0 scale-95 pointer-events-none' : 'group-hover:scale-105'}`}
          loading="lazy"
        />

        {work.videoUrl && (
          <video
            ref={videoRef}
            src={work.videoUrl}
            loop
            muted
            playsInline
            className={`absolute inset-0 h-full w-full object-cover bg-black transition-opacity duration-300 ${playing ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          />
        )}

        <span className="absolute left-3 top-3 border border-border bg-black/80 px-2 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-accent z-10">
          {work.category}
        </span>

        {work.videoUrl && !playing && (
          <span className="absolute right-3 top-3 z-10 flex items-center gap-1 border border-border bg-black/80 px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wider text-primary">
            <Play size={9} fill="currentColor" /> Video
          </span>
        )}

        {/* Hover play button */}
        {!playing && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110"
              onClick={work.videoUrl ? startPlay : () => onOpenLightbox(work)}
              aria-label="Play video"
            >
              {work.videoUrl ? <Play size={18} fill="currentColor" className="ml-0.5" /> : <ExternalLink size={18} />}
            </button>
          </div>
        )}

        {/* Close button when playing */}
        {playing && (
          <button
            type="button"
            className="absolute right-3 top-3 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-black/80 text-white border border-border hover:bg-black"
            onClick={stopPlay}
            aria-label="Stop video"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Info body */}
      <div className="flex flex-1 flex-col p-5 cursor-pointer" onClick={() => onOpenLightbox(work)}>
        <p className="text-[0.6875rem] font-medium uppercase tracking-widest text-accent mb-1">
          {work.client || 'United Films'} {work.year ? `· ${work.year}` : ''}
        </p>
        <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2 leading-snug">
          {work.title}
        </h3>
        <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3 mb-4 flex-1">
          {work.description}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3 mt-auto">
          <div className="flex flex-wrap gap-1.5">
            {(work.tags || []).map((t) => (
              <span key={t} className="border border-border bg-secondary/50 px-2 py-0.5 text-[0.625rem] text-muted-foreground uppercase">
                {t}
              </span>
            ))}
          </div>
          <span className="inline-flex items-center gap-1 text-[0.6875rem] font-semibold uppercase tracking-wider text-primary">
            Details <ArrowRight size={12} />
          </span>
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl border border-border bg-card overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/80 text-white border border-border hover:bg-black"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div className="aspect-video bg-black flex items-center justify-center overflow-hidden">
          {work.videoUrl ? (
            <video
              ref={videoRef}
              src={work.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            <img src={work.thumbnailUrl} alt={work.title} className="h-full w-full object-cover" />
          )}
        </div>

        <div className="p-6 md:p-8">
          <span className="text-[0.6875rem] font-semibold uppercase tracking-widest text-accent border border-border px-2.5 py-1 inline-block mb-3">
            {work.category}
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
            {work.title}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground mb-6">
            {work.description}
          </p>

          <div className="flex flex-wrap gap-6 border-t border-border pt-4 text-xs text-muted-foreground">
            {work.client && <div><span className="uppercase tracking-wider font-semibold text-foreground">Client:</span> {work.client}</div>}
            {work.year && <div><span className="uppercase tracking-wider font-semibold text-foreground">Year:</span> {work.year}</div>}
            <div className="ml-auto">
              <a href="/contact" className="text-primary font-semibold uppercase tracking-wider hover:underline">
                Contact For Similar Production →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function OurWorkPage() {
  const [works, setWorks] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeLightbox, setActiveLightbox] = useState(null);

  useEffect(() => {
    getAllWorks()
      .then((data) => {
        if (data && data.length > 0) setWorks(data);
      })
      .catch(() => {});
  }, []);

  const workList = useMemo(() => {
    if (works.length === 0) return FALLBACK_WORKS;
    const dbTitles = new Set(works.map((w) => w.title?.toLowerCase()));
    const remainingFallback = FALLBACK_WORKS.filter((f) => !dbTitles.has(f.title?.toLowerCase()));
    return [...works, ...remainingFallback];
  }, [works]);

  const categories = useMemo(() => {
    const set = new Set(workList.map((w) => w.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [workList]);

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return workList;
    return workList.filter((w) => w.category === activeCategory);
  }, [workList, activeCategory]);

  return (
    <SiteShell>
      <PageTitle
        kicker="Cinematic Portfolio & Showreels"
        title="Our Work"
        lead="Explore motion picture productions, high-speed Phantom Flex captures, extreme sports films, and digital film restorations created by United Films."
      />

      <Section>
        {/* Category Filters */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`border px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeCategory === cat
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-muted-foreground hover:border-primary hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Works Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((work) => (
            <WorkCard key={work.id} work={work} onOpenLightbox={setActiveLightbox} />
          ))}
        </div>
      </Section>

      <Section>
        <ContactStrip />
      </Section>

      {/* Lightbox Modal */}
      {activeLightbox && (
        <Lightbox work={activeLightbox} onClose={() => setActiveLightbox(null)} />
      )}
    </SiteShell>
  );
}
