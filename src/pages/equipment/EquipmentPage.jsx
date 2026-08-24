import { useState, useEffect, useMemo } from 'react';
import { Search, X, SlidersHorizontal, ArrowRight, ShieldCheck } from 'lucide-react';
import { ContactStrip, PageTitle, Section, SiteShell } from '@/components/site/SiteSection';
import { ImageGrid, SpecList } from '@/components/site/MediaBlocks';
import { images } from '@/lib/site-media';
import { getAllEquipment } from '@/lib/db';



const GRADING = [
  'DFT Scanity film scanner 16/35',
  'Nucoda color grading system',
  'Phoenix film restoration system',
  'Truelight Baselight 2, Baselight 1, Baselight HD',
  'Spirit 4K Telecine / Spirit 2K with Bones',
  'Lasergraphics Director film scanner',
  'Northlight and Northlight 2 scanners',
  'Arri Scanner XT, 16/35mm wet gate, 65/70mm',
  'Arri Laser Recorder / Arri Film Recorder',
  '2x Imagica scanner',
  'Facilis 48TB Terrablock system',
  'Cinevation Cinevator',
  'Autodesk Flame Premium 2015 / 2014, Flame 2015, Luster, Smoke, Inferno',
  'Lipsner Smith film cleaner',
  'Color Master analyser',
  'Digital Vision Nucoda HD',
  'Avid Unity 5.1.4 media engine w/ 8TB, 26 fiber client connections',
  'SAN MP server, 4 seats with dongles',
];

const LAB = [
  '35mm Cinevator',
  '35mm Model C Bell and Howell printer',
  '16mm Model C, Schmitzer liquid gate equipped',
  'Bell and Howell printer 35/16/8mm',
  'Allen Products ECN-2 processing, 18 fpm at 35mm',
  'Houston Fearless E-6 processing machine 35/16/8mm, 14 fpm at 35mm',
  '35/16mm black and white spray machine',
  'Densitometers, Moviola and Nu-made rewinds, split reels 16mm and 35mm',
  '16/35 film developing machine — installation and warranty available',
];

const PROJECTORS = [
  'Barco 2K DP90 projector with anamorphic lens',
  'Sony SRX 350 4K',
  'Christie CP 2220 with 4K upgrade light engine',
  'Christie CP 2220',
  'Christie CP 2000i',
];

const CAMERAS = [
  'Phantom Flex 4K 1000 fps camera',
  'Arri Master Primes, set of 6',
  'Arri Ultra Primes, set of 6',
  'Angenieux Optimo zoom 24-290mm',
  'Arri Alura zoom 45-250mm',
  'Zeiss 2.1 lenses, 4 sets available',
  'RED lenses, 6 lens set',
  'Angenieux HR 25-250mm zooms',
  'Arri 435 film cameras',
];

const LENSES = [
  'Angenieux Optimo 17-120, almost brand new — $Call',
  'Angenieux Optimo 15-40 & 45-120, 2x extender, case',
  'Angenieux Optimo 28-340',
  'Angenieux Optimo 17-80 — $33,500',
  'Angenieux Optimo 17-102 / 56-152',
  'Angenieux Optimo 16-42 x2, 30-80 x3',
  'Angenieux 25-250 HR, several available — $16,990 each',
  'Arri 18-80 Alura, mint with case — $21,500',
  'Arri 30-80 Alura',
  'Arri 15.5-45 & 30-80 Alura lightweight zoom pair — $26,500',
  'Cooke 18-100 T3',
  'Canon CN-E 30-105 Duclos PL & EF mounts — $14,990',
  'Canon CN-E 15.5-4.7',
  'Fujinon 19-90 Cabrio v2, mint with case — $28,500',
  'Fujinon 19-90 Cabrio v1, 2 available',
  'Fujinon 19-90 Cabrio & 85-300 pair',
  'Fujinon HAS18x7.6BRM HD x6, HA13x4.5BERM',
  'Fuji HA22x7.8BERM, HA22x7.3BERM, HA23x7.6BERD, HA14x4.5BERD',
  'Canon HJ22x7.6B IASE, XJ95x HD box lens, HJ40x10B IASD',
];

const SUPPORT = [
  "O'Connor 2575B with Ronford standard/baby",
  "O'Connor 2065 with Ronford standard/baby",
  'Vinten Vector 70 Osprey Lite pedestal',
  'Sony SRW-5500 5001, 5002, 5003 + 5001 board',
  'Sony SRW-5800 5802 & 5803sq',
  'Sony HDW-M2000/20 HDCam, 10x available',
  'Sony PDW-F1600, 3x available — $10,950 each',
  'Sony HDW-1800 / HDW-D1800',
  'Panasonic AJ-HD1700, 6x available',
  'Panasonic AJ-HD3700B',
];

export default function EquipmentPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dbEquipment, setDbEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllEquipment()
      .then((data) => {
        setDbEquipment(data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const equipmentList = dbEquipment;

  const categories = useMemo(() => {
    const set = new Set(equipmentList.map((i) => i.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [equipmentList]);

  const filtered = useMemo(() => {
    return equipmentList.filter((item) => {
      const matchCat = activeCategory === 'All' || item.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !searchQuery ||
        item.name?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [equipmentList, activeCategory, searchQuery]);

  return (
    <SiteShell>
      <PageTitle
        kicker="Buy — trade — sale — rent"
        title="Equipment"
        lead="We have professional cinema equipment for rent and sale. Browse available inventory below, make your best offer, or contact us with your custom production package."
      />

      {/* Available Equipment Cards Section */}
      <Section title="Available Equipment Inventory">
        {/* Search & Category Filter Bar */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  activeCategory === cat
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-muted-foreground hover:border-primary hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              placeholder="Search equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-border bg-card py-2 pl-9 pr-8 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Equipment Cards Grid */}
        {filtered.length === 0 ? (
          <div className="border border-border bg-card p-12 text-center text-muted-foreground">
            <p className="text-sm">No equipment found matching "{searchQuery}".</p>
            <button
              type="button"
              onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
              className="mt-4 inline-block border border-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col overflow-hidden border border-border bg-card transition-all hover:border-primary/60"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-black/40">
                  <img
                    src={item.imageUrl || item.image || images.phantomHero}
                    alt={item.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-2.5 top-2.5 bg-black/80 px-2 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-accent border border-border">
                    {item.category || 'Gear'}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-xs leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
                    <span className="text-[0.6875rem] font-medium text-accent flex items-center gap-1">
                      <ShieldCheck size={13} /> {item.status || 'Available'}
                    </span>
                    <a
                      href="/contact"
                      className="inline-flex items-center gap-1 text-[0.6875rem] font-semibold uppercase tracking-wider text-primary hover:underline"
                    >
                      Enquire <ArrowRight size={12} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section>
        <ContactStrip />
      </Section>

      {/* Comprehensive Archive Spec Lists */}
      <Section title="Color grading, special effects & scanning">
        <div className="grid gap-10 md:grid-cols-2">
          <SpecList items={GRADING} />
          <SpecList items={LAB} />
        </div>
      </Section>

      <Section title="Cameras & lenses">
        <div className="grid gap-10 md:grid-cols-2">
          <SpecList items={CAMERAS} />
          <SpecList items={LENSES} />
        </div>
      </Section>

      <Section title="Projectors, heads & decks">
        <div className="grid gap-10 md:grid-cols-2">
          <SpecList items={PROJECTORS} />
          <SpecList items={SUPPORT} />
        </div>
      </Section>

      {/* Archive Inventory Photos */}
      <Section title="Inventory photos">
        <ImageGrid images={images.equipment} alt="Equipment for sale" columns={4} />
      </Section>
    </SiteShell>
  );
}
