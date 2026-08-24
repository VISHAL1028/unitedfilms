import { useEffect, useState, useRef } from 'react';
import { Check, Zap, Gauge, Film, Play, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getFeaturedEquipment } from '@/lib/db';
import phantomCamera from '@/assets/phantom-camera.jpg';

const fallbackEquipment = {
  name: 'Phantom Flex 4K',
  description:
    'Give your production the edge with our Phantom Flex camera. Capture both high-speed and standard-speed movements with precision and clarity in two formats at the same time.',
  image: phantomCamera,
  rentalPrice: '1500',
  oldPrice: '3000',
  rentalUnit: 'day',
  featureBullets: [
    'Phantom Flex 4K camera',
    'Recorder + Preview monitor',
    'Tripod + Remote control',
    'Lenses: 50mm, 100mm, 300mm',
    'Vintage lens set available',
    'Underwater housing available',
    'Splash bag camera protection',
    'Flame relighting workstation',
  ],
};

const specs = [
  { icon: Zap, label: 'Fast Setup', desc: 'Production-ready' },
  { icon: Gauge, label: 'Pro Support', desc: 'Crew assistance' },
  { icon: Film, label: 'Cinema Quality', desc: 'Rental inventory' },
];

const formatPrice = (value) => {
  if (!value) return null;
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return value;
  return new Intl.NumberFormat('en-IN').format(numeric);
};

export const EquipmentSection = () => {
  const [featured, setFeatured] = useState(fallbackEquipment);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    getFeaturedEquipment()
      .then((data) => {
        if (!mounted || !data) return;
        setFeatured({
          ...fallbackEquipment,
          ...data,
          image: data.imageUrl || data.image || fallbackEquipment.image,
          videoUrl: data.videoUrl || null,
          featureBullets: data.featureBullets?.length
            ? data.featureBullets
            : [
                data.category,
                'Available for rental',
                'Maintained for production use',
                'On-set technician available on request',
              ].filter(Boolean),
        });
      })
      .catch(() => {
        if (mounted) setFeatured(fallbackEquipment);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handlePlay = () => {
    setPlaying(true);
    setTimeout(() => {
      videoRef.current?.play().catch(() => {});
    }, 100);
  };

  const handleClose = () => {
    videoRef.current?.pause();
    setPlaying(false);
  };

  const currentPrice = formatPrice(featured.rentalPrice);
  const oldPrice = formatPrice(featured.oldPrice);
  const unit = featured.rentalUnit || 'day';
  const hasVideo = Boolean(featured.videoUrl);

  return (
    <section id="equipment" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card to-background" />

      <div className="relative container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* ── Media panel (left) ── */}
          <div className="relative order-2 lg:order-1">
            <div className="featured-media-panel shadow-2xl">
              {/* Thumbnail */}
              <img
                src={featured.image}
                alt={featured.name}
                className={`featured-media-panel__img ${playing ? 'featured-media-panel__img--hidden' : ''}`}
              />

              {/* Video player */}
              {hasVideo && (
                <video
                  ref={videoRef}
                  src={featured.videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className={`featured-media-panel__video ${playing ? 'featured-media-panel__video--visible' : ''}`}
                />
              )}

              {/* Play button (only when not playing) */}
              {hasVideo && !playing && (
                <button className="featured-play-btn" onClick={handlePlay} aria-label="Play video">
                  <span className="featured-play-btn__circle">
                    <Play style={{ width: 28, height: 28, marginLeft: 4 }} fill="currentColor" />
                  </span>
                </button>
              )}

              {/* Close / back to thumbnail */}
              {hasVideo && playing && (
                <button className="featured-close-btn" onClick={handleClose} aria-label="Close video">
                  <X style={{ width: 16, height: 16 }} />
                </button>
              )}

              {/* Featured label badge */}
              {featured.featuredLabel && (
                <div className="absolute -top-4 -right-4 sm:top-6 sm:right-6 glass-card rounded-xl px-4 py-3 animate-float z-30">
                  <div className="text-xs text-muted-foreground">Featured</div>
                  <div className="font-display text-2xl text-primary">{featured.featuredLabel}</div>
                </div>
              )}
            </div>

            {/* Video indicator badge */}
            {hasVideo && (
              <div className="absolute -bottom-4 left-6 flex items-center gap-2 px-4 py-2 rounded-full glass-card text-xs text-purple-300 border border-purple-400/20 z-20">
                <Play style={{ width: 10, height: 10 }} fill="currentColor" />
                Demo video available
              </div>
            )}

            <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-3xl -z-10" />
          </div>

          {/* ── Info panel (right) ── */}
          <div className="order-1 lg:order-2">
            <span className="inline-block px-4 py-1 rounded-full text-sm font-medium text-primary border border-primary/30 mb-4">
              Featured Equipment
            </span>

            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl mb-6">
              {featured.name}
            </h2>

            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              {featured.description}
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {specs.map((spec) => (
                <div key={spec.label} className="glass-card rounded-xl p-4 text-center">
                  <spec.icon className="w-6 h-6 text-secondary mx-auto mb-2" />
                  <div className="font-semibold text-sm">{spec.label}</div>
                  <div className="text-xs text-muted-foreground">{spec.desc}</div>
                </div>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {featured.featureBullets.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>

            {(currentPrice || oldPrice) && (
              <div className="glass-card rounded-xl p-6 mb-8">
                <div className="flex items-end gap-4 mb-3">
                  {oldPrice && (
                    <span className="text-muted-foreground line-through text-lg">Rs. {oldPrice}/{unit}</span>
                  )}
                  {currentPrice && <span className="font-display text-4xl text-primary">Rs. {currentPrice}</span>}
                  {currentPrice && <span className="text-muted-foreground">/{unit}</span>}
                </div>
                <p className="text-sm text-muted-foreground">
                  Rental details can be updated from the admin equipment manager.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/#contact">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold glow-primary">
                  Book Now
                </Button>
              </Link>
              <Link to="/equipment">
                <Button size="lg" variant="outline" className="border-border hover:bg-muted">
                  View All Equipment
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
