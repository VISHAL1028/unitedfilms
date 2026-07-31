import { useState, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, X, ListFilter, Play, ArrowUpDown } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { equipment as staticEquipment, categories as staticCategories } from './equipmentData';
import { getAllEquipment } from '@/lib/db';

const sortOptions = [
  { value: 'name-asc', label: 'Name A-Z' },
  { value: 'name-desc', label: 'Name Z-A' },
  { value: 'category-asc', label: 'Category A-Z' },
  { value: 'featured-first', label: 'Featured First' },
];

/* ── Single equipment card with thumbnail + video toggle ── */
const EquipmentCard = ({ item }) => {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);
  const hasVideo = Boolean(item.videoUrl);

  const handlePlay = (e) => {
    e.stopPropagation();
    setPlaying(true);
    setTimeout(() => {
      videoRef.current?.play().catch(() => {});
    }, 80);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    videoRef.current?.pause();
    setPlaying(false);
  };

  return (
    <div className="group bg-card border border-border overflow-hidden flex flex-col transition-colors duration-200 hover:bg-muted/40">
      {/* Media area */}
      <div className="relative bg-muted border-b border-border flex items-center justify-center h-56 overflow-hidden">
        {/* Thumbnail */}
        <img
          src={item.imageUrl || item.image}
          alt={item.name}
          className={`w-full h-full object-contain p-6 transition-transform duration-300 ${playing ? 'opacity-0 scale-95 pointer-events-none' : 'group-hover:scale-105'}`}
        />

        {/* Video */}
        {hasVideo && (
          <video
            ref={videoRef}
            src={item.videoUrl}
            muted
            playsInline
            loop
            controls={playing}
            className={`absolute inset-0 w-full h-full object-cover bg-black transition-opacity duration-300 ${playing ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          />
        )}

        {/* Category badge */}
        <span className="absolute top-4 left-4 px-2.5 py-1 text-[0.625rem] font-medium uppercase tracking-wider bg-background/90 text-foreground border border-border z-10">
          {item.category}
        </span>

        {/* Featured badge */}
        {item.featured && (
          <span className="absolute top-4 right-4 px-2.5 py-1 text-[0.625rem] font-medium uppercase tracking-wider bg-primary text-primary-foreground z-10">
            Featured
          </span>
        )}

        {/* Play button overlay */}
        {hasVideo && !playing && (
          <button
            className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors z-10"
            onClick={handlePlay}
            aria-label="Play demo video"
          >
            <span className="w-10 h-10 rounded-full bg-background/90 text-foreground flex items-center justify-center border border-border shadow-md">
              <Play style={{ width: 16, height: 16, marginLeft: 2 }} fill="currentColor" />
            </span>
          </button>
        )}

        {/* Close button */}
        {hasVideo && playing && (
          <button
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/90 text-foreground border border-border flex items-center justify-center z-20"
            onClick={handleClose}
            aria-label="Back to thumbnail"
          >
            <X style={{ width: 14, height: 14 }} />
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-6 flex flex-col flex-1">
        <h3 style={{ fontFamily: "'Instrument Serif', Georgia, serif" }} className="text-xl font-normal mb-2 leading-tight text-foreground">
          {item.name}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed flex-1">
          {item.description}
        </p>

        {/* Video badge indicator */}
        {hasVideo && (
          <div className="mt-3 inline-flex items-center gap-1.5 text-[0.625rem] uppercase tracking-wider font-medium text-primary">
            <Play style={{ width: 9, height: 9 }} fill="currentColor" />
            Demo video available
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-border">
          <a
            href="/#contact"
            className="text-xs font-medium uppercase tracking-widest text-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
          >
            Enquire about rental <span>&rarr;</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export const EquipmentPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [firestoreEquipment, setFirestoreEquipment] = useState(null);

  useEffect(() => {
    getAllEquipment()
      .then((data) => {
        if (data.length > 0) setFirestoreEquipment(data);
      })
      .catch(() => {});
  }, []);

  const equipment = firestoreEquipment ?? staticEquipment;
  const categories = firestoreEquipment
    ? ['All', ...Array.from(new Set(firestoreEquipment.map((item) => item.category))).sort()]
    : staticCategories;

  const normalizedSearch = searchQuery.toLowerCase().trim();
  const filtered = equipment
    .filter((item) => {
      const matchCat = activeCategory === 'All' || item.category === activeCategory;
      const searchable = `${item.name} ${item.description} ${item.category}`.toLowerCase();
      const matchSearch = !normalizedSearch || searchable.includes(normalizedSearch);
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'category-asc') return a.category.localeCompare(b.category) || a.name.localeCompare(a.name);
      if (sortBy === 'featured-first') return Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || a.name.localeCompare(a.name);
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero header */}
      <section className="pt-28 pb-12 lg:pt-36 lg:pb-16 border-b border-border bg-background">
        <div className="container mx-auto px-6 lg:px-10 max-w-7xl">
          <p className="text-[0.625rem] uppercase tracking-widest text-primary mb-4 font-semibold">Equipment Catalogue</p>
          <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif" }} className="text-4xl md:text-6xl font-normal mb-4 tracking-tight text-foreground">
            Our Equipment
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
            Browse professional cinema cameras, lenses, film scanners, projectors, and post-production systems available for rental and production use.
          </p>
        </div>
      </section>

      {/* Sticky Search & Filter bar */}
      <section className="sticky top-[60px] z-40 bg-background/95 backdrop-blur-md border-b border-border py-4">
        <div className="container mx-auto px-6 lg:px-10 max-w-7xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search equipment..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full pl-11 pr-10 py-2.5 bg-muted border border-border text-xs text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-foreground"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Toggle + Item Count */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setFiltersOpen((open) => !open)}
                className={`inline-flex items-center gap-2 border px-4 py-2.5 text-xs font-medium uppercase tracking-widest transition-colors ${
                  filtersOpen
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border bg-card text-foreground hover:border-foreground'
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
                Filter & Sort
              </button>

              <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{filtered.length} item{filtered.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>

          {/* Expanded Filter Panel */}
          {filtersOpen && (
            <div className="mt-4 border border-border bg-card p-5">
              <div className="grid gap-5 lg:grid-cols-[1fr_200px] lg:items-end">
                <div>
                  <p className="text-[0.625rem] uppercase tracking-widest text-muted-foreground mb-3 font-semibold">Categories</p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                          activeCategory === cat
                            ? 'bg-foreground text-background border border-foreground'
                            : 'bg-muted text-muted-foreground border border-border hover:text-foreground hover:border-foreground'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[0.625rem] uppercase tracking-widest text-muted-foreground mb-2 font-semibold">Sort By</p>
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    className="w-full bg-muted border border-border p-2 text-xs text-foreground outline-none"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6 lg:px-10 max-w-7xl">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-gray-400 text-lg mb-4">No equipment found for your search.</p>
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-sm"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filtered.map((item) => (
                <EquipmentCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EquipmentPage;
