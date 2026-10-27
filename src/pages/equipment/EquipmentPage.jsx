import { useState, useEffect, useMemo } from 'react';
import { Search, X, ArrowRight, ShieldCheck, Send, Camera, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { ContactStrip, PageTitle, Section, SiteShell } from '@/components/site/SiteSection';
import { ImageGrid, SpecList } from '@/components/site/MediaBlocks';
import { images } from '@/lib/site-media';
import { getAllEquipment, saveEquipmentRequest } from '@/lib/db';



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

  // Submission form state
  const SUBMIT_CATEGORIES = [
    'Cameras', 'Lenses', 'Color Grading & VFX', 'Film Scanners & Restoration',
    'Film Processing & Lab', 'Projectors', 'Support Equipment', 'Storage & Systems', 'Other',
  ];
  const emptySubmit = {
    submitterName: '', submitterEmail: '', submitterPhone: '',
    equipmentName: '', category: 'Cameras', description: '',
    askingPrice: '', condition: 'Excellent', photoUrl: '',
  };
  const [submitForm, setSubmitForm] = useState(emptySubmit);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const updateSubmit = (field, value) => setSubmitForm((f) => ({ ...f, [field]: value }));

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!submitForm.submitterName || !submitForm.submitterEmail || !submitForm.equipmentName) {
      setSubmitError('Please fill in your name, email, and equipment name.');
      return;
    }
    setSubmitLoading(true);
    try {
      await saveEquipmentRequest(submitForm);
      setSubmitSuccess(true);
      setSubmitForm(emptySubmit);
    } catch {
      setSubmitError('Failed to submit. Please try again or contact us directly.');
    } finally {
      setSubmitLoading(false);
    }
  };

  useEffect(() => {
    getAllEquipment()
      .then((data) => { setDbEquipment(data || []); })
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

  const scrollToForm = () => {
    document.getElementById('submit-equipment-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <SiteShell>
      <PageTitle
        kicker="Buy — trade — sale — rent"
        title="Equipment"
        lead="We have professional cinema equipment for rent and sale. Browse available inventory below, make your best offer, or contact us with your custom production package."
      />

      {/* Available Equipment Cards Section */}
      <Section title="Available Equipment Inventory">
        {/* ── List Your Equipment CTA ── */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 border border-border bg-card p-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-primary/40 bg-primary/10 text-primary">
              <Camera size={18} />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.08em] text-foreground">Have equipment to sell or rent?</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">Submit your gear — we review and list it on this page for free.</p>
            </div>
          </div>
          <button
            onClick={scrollToForm}
            className="inline-flex shrink-0 items-center gap-2 border border-primary bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-primary-foreground transition-opacity hover:opacity-90"
          >
            List My Equipment <ArrowRight size={13} />
          </button>
        </div>

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

      {/* ── Submit Your Equipment ── */}
      <div id="submit-equipment-form">
        <Section title="List Your Equipment With Us">
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">

            {/* Left — info panel */}
            <div className="flex flex-col gap-6 border border-border bg-card p-6">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center border border-primary/40 bg-primary/10 text-primary">
                  <Camera size={22} />
                </div>
                <h3 className="text-base font-bold uppercase tracking-[0.08em] text-foreground">Have Equipment to Sell or Rent?</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Submit your professional cinema equipment for listing on our marketplace. Our team reviews every submission — if approved, your item will appear on this page for productions worldwide.
                </p>
              </div>
              <ul className="flex flex-col gap-3 border-t border-border pt-5">
                {['Free to list — no commission', 'Reviewed within 48 hours', 'Reach professional film productions'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-accent">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center border border-accent/30 bg-accent/10 text-[10px]">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right — form */}
            <div className="border border-border bg-card">
              {submitSuccess ? (
                <div className="flex flex-col items-center justify-center gap-5 px-8 py-16 text-center">
                  <div className="flex h-16 w-16 items-center justify-center border border-accent/30 bg-accent/10 text-accent">
                    <CheckCircle size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-wider text-foreground">Request Submitted!</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground max-w-sm">
                      Thank you — our team will review your equipment and contact you within 48 hours.
                    </p>
                  </div>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="border border-primary bg-primary px-6 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Submit Another Item
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitRequest} className="flex flex-col gap-6 p-6">

                  {/* Section: Your Details */}
                  <div>
                    <p className="mb-4 border-b border-border pb-2 text-[0.625rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">Your Details</p>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[0.625rem] font-bold uppercase tracking-[0.1em] text-muted-foreground">Full Name *</label>
                        <input
                          type="text" required placeholder="e.g. James Anderson"
                          value={submitForm.submitterName}
                          onChange={(e) => updateSubmit('submitterName', e.target.value)}
                          className="border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[0.625rem] font-bold uppercase tracking-[0.1em] text-muted-foreground">Email *</label>
                        <input
                          type="email" required placeholder="you@example.com"
                          value={submitForm.submitterEmail}
                          onChange={(e) => updateSubmit('submitterEmail', e.target.value)}
                          className="border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[0.625rem] font-bold uppercase tracking-[0.1em] text-muted-foreground">Phone</label>
                        <input
                          type="tel" placeholder="+1 555 000 0000"
                          value={submitForm.submitterPhone}
                          onChange={(e) => updateSubmit('submitterPhone', e.target.value)}
                          className="border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section: Equipment Details */}
                  <div>
                    <p className="mb-4 border-b border-border pb-2 text-[0.625rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">Equipment Details</p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[0.625rem] font-bold uppercase tracking-[0.1em] text-muted-foreground">Equipment Name *</label>
                        <input
                          type="text" required placeholder="e.g. Arri Alexa Mini LF"
                          value={submitForm.equipmentName}
                          onChange={(e) => updateSubmit('equipmentName', e.target.value)}
                          className="border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[0.625rem] font-bold uppercase tracking-[0.1em] text-muted-foreground">Category</label>
                        <select
                          value={submitForm.category}
                          onChange={(e) => updateSubmit('category', e.target.value)}
                          className="border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                        >
                          {SUBMIT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[0.625rem] font-bold uppercase tracking-[0.1em] text-muted-foreground">Asking Price</label>
                        <input
                          type="text" placeholder="e.g. $4,500 or $200/day"
                          value={submitForm.askingPrice}
                          onChange={(e) => updateSubmit('askingPrice', e.target.value)}
                          className="border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[0.625rem] font-bold uppercase tracking-[0.1em] text-muted-foreground">Condition</label>
                        <select
                          value={submitForm.condition}
                          onChange={(e) => updateSubmit('condition', e.target.value)}
                          className="border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                        >
                          <option>Excellent</option>
                          <option>Good</option>
                          <option>Fair</option>
                          <option>For Parts</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Photo URL + Description */}
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[0.625rem] font-bold uppercase tracking-[0.1em] text-muted-foreground">Photo URL (Optional)</label>
                      <input
                        type="url" placeholder="https://your-image-link.com/photo.jpg"
                        value={submitForm.photoUrl}
                        onChange={(e) => updateSubmit('photoUrl', e.target.value)}
                        className="border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[0.625rem] font-bold uppercase tracking-[0.1em] text-muted-foreground">Description</label>
                      <textarea
                        rows={3}
                        placeholder="Specs, included accessories, reason for selling, any defects..."
                        value={submitForm.description}
                        onChange={(e) => updateSubmit('description', e.target.value)}
                        className="resize-none border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  {submitError && (
                    <div className="flex items-center gap-2 border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs text-destructive">
                      <AlertCircle size={13} />
                      {submitError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="inline-flex items-center justify-center gap-2 border border-primary bg-primary px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitLoading
                      ? <><Loader2 size={14} className="animate-spin" /> Submitting...</>
                      : <><Send size={13} /> Submit for Review</>
                    }
                  </button>
                </form>
              )}
            </div>

          </div>
        </Section>
      </div>

      {/* ── Floating "List Equipment" button ── */}
      <button onClick={scrollToForm} className="equip-float-btn" aria-label="List your equipment">
        <Camera size={18} />
        <span>List Your Equipment</span>
      </button>

    </SiteShell>
  );
}
