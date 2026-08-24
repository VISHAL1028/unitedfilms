import { useState, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

export function VideoBlock({ clip, className = '', autoPlay = true }) {
  if (!clip) return null;
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <figure className={`group relative overflow-hidden border border-border bg-card ${className}`}>
      <div className="relative cursor-pointer" onClick={togglePlay}>
        <video
          ref={videoRef}
          className={`w-full bg-black ${clip.portrait ? 'aspect-[9/16]' : 'aspect-video'} object-cover`}
          src={clip.src}
          poster={clip.poster}
          autoPlay={autoPlay}
          muted={isMuted}
          loop
          playsInline
          preload="auto"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Sleek Minimal Overlay Controls (Hover or when Paused) */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-transform hover:scale-110"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
          </button>
        </div>

        {/* Mute/Unmute corner button */}
        <button
          type="button"
          onClick={toggleMute}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm transition-all hover:bg-black/90 group-hover:opacity-100 sm:opacity-80"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>
      </div>

      {clip.label ? (
        <figcaption className="px-4 py-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
          {clip.label}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function VideoGrid({ clips, columns = 2 }) {
  return (
    <div className={`grid gap-6 ${columns === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2'}`}>
      {clips.map((c) => (
        <VideoBlock key={c.src} clip={c} />
      ))}
    </div>
  );
}

export function ImageGrid({ images, alt, columns = 3 }) {
  const cols =
    columns === 4
      ? 'sm:grid-cols-2 lg:grid-cols-4'
      : columns === 3
        ? 'sm:grid-cols-2 lg:grid-cols-3'
        : 'sm:grid-cols-2';
  return (
    <div className={`grid gap-4 ${cols}`}>
      {images.map((src, i) => (
        <img
          key={src + i}
          src={src}
          alt={`${alt} ${i + 1}`}
          loading="lazy"
          className="aspect-4/3 w-full border border-border object-cover"
        />
      ))}
    </div>
  );
}

export function SpecList({ items }) {
  return (
    <ul className="spec-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
