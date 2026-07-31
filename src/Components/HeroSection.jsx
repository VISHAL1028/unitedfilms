import { Play, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState, useCallback } from 'react';

// Import all playable videos as URL references (Vite serves them as separate files – no bundle issue)
import vid2 from '@/assets/Video/Untitled 2.mov?url';
import vid3 from '@/assets/Video/Untitled 3.mov?url';
import vid4 from '@/assets/Video/Untitled 4.mov?url';
import vid5 from '@/assets/Video/Untitled 3 copy.mov?url';
import vid6 from '@/assets/Video/water.mov?url';
import vid7 from '@/assets/Video/CLIP0000014_000.mov?url';
import vid8 from '@/assets/Video/CLIP0000167_000.mov?url';

const VIDEOS = [vid2, vid3, vid4, vid5, vid6, vid7, vid8];

const SLIDE_DURATION = 9000; // ms per video

export const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const currentVideoRef = useRef(null);
  const nextVideoRef = useRef(null);
  const timerRef = useRef(null);

  const advanceSlide = useCallback(() => {
    if (transitioning) return;
    const nextIndex = (current + 1) % VIDEOS.length;
    setNext(nextIndex);
    setTransitioning(true);
  }, [current, transitioning]);

  // Auto-advance timer
  useEffect(() => {
    timerRef.current = setTimeout(advanceSlide, SLIDE_DURATION);
    return () => clearTimeout(timerRef.current);
  }, [current, advanceSlide]);

  // When next video is loaded + playing, complete the transition
  const handleNextReady = () => {
    setTimeout(() => {
      setCurrent(next);
      setNext(null);
      setTransitioning(false);
    }, 100);
  };

  // Autoplay current video
  useEffect(() => {
    const vid = currentVideoRef.current;
    if (!vid) return;
    vid.currentTime = 0;
    vid.play().catch(() => {});
  }, [current]);

  return (
    <section
      id="home"
      className="relative flex items-center justify-center overflow-hidden"
      style={{
        /* 100svh = viewport minus mobile browser chrome (iOS Safari, Chrome mobile) */
        minHeight: 'min(100svh, 100vh)',
        height: 'min(100svh, 100vh)',
      }}
    >

      {/* ── Current video (always visible) ── */}
      <video
        key={`current-${current}`}
        ref={currentVideoRef}
        src={VIDEOS[current]}
        autoPlay
        muted
        playsInline
        loop
        className={`hero-video hero-video--current ${transitioning ? 'hero-video--fade-out' : ''}`}
      />

      {/* ── Next video (fades in during transition) ── */}
      {next !== null && (
        <video
          key={`next-${next}`}
          ref={nextVideoRef}
          src={VIDEOS[next]}
          autoPlay
          muted
          playsInline
          loop
          className="hero-video hero-video--next hero-video--fade-in"
          onCanPlay={handleNextReady}
        />
      )}

      {/* Dark overlay — always on, ensures text legibility */}
      <div className="hero-video-overlay absolute inset-0 z-[2]" />

      {/* Grain texture */}
      <div className="absolute inset-0 z-[3] hero-grain-overlay pointer-events-none" />

      {/* Slide indicators */}
      <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {VIDEOS.map((_, i) => (
          <button
            key={i}
            onClick={() => { if (!transitioning) { setNext(i); setTransitioning(true); } }}
            className={`hero-dot ${i === current ? 'hero-dot--active' : ''}`}
            aria-label={`Go to video ${i + 1}`}
          />
        ))}
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 animate-fade-in-up">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-sm font-medium text-white/80 tracking-wide">Professional Film Production</span>
          </div>

          {/* Main Heading — Playfair Display, editorial style */}
          <h1 className="font-display leading-none mb-6 animate-slide-up text-white"
            style={{ fontSize: 'clamp(2.8rem, 8vw, 7rem)' }}>
            <span className="block font-light tracking-tight">CAPTURE YOUR</span>
            <span className="block italic text-gradient" style={{ fontStyle: 'italic' }}>Vision.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-white/70 max-w-xl mx-auto mb-10 animate-fade-in-up delay-200 font-light leading-relaxed">
            World-class film production, high-speed camera rentals, and professional
            post-production services — cinematic excellence in every frame.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up delay-300">
            <Link to="/our-work">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-6 text-base glow-primary group tracking-wide">
                <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" fill="currentColor" />
                View Our Work
              </Button>
            </Link>
            <a href="#services">
              <Button
                size="lg"
                variant="outline"
                className="border-white/25 hover:bg-white/10 text-white px-8 py-6 text-base tracking-wide backdrop-blur-sm"
              >
                Explore Services
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 sm:gap-10 mt-16 animate-fade-in-up delay-400">
            {[
              { value: '20+', label: 'Years Experience' },
              { value: '500+', label: 'Projects' },
              { value: '4K', label: 'Ultra HD' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-2xl sm:text-4xl lg:text-5xl text-primary" style={{ fontStyle: 'normal' }}>
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-white/60 mt-1 tracking-widest uppercase font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-20">
        <a href="#services" className="flex flex-col items-center gap-1 text-white/50 hover:text-white/80 transition-colors">
          <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
};
