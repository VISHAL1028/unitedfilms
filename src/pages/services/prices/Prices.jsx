// Prices — exact port of film-essence-archive prices.tsx
import { ContactStrip, PageTitle, Section, SiteShell } from '@/components/site/SiteSection';
import { ImageGrid, SpecList } from '@/components/site/MediaBlocks';
import { images } from '@/lib/site-media';

const SYSTEMS = ['Nucoda color grading system','Phoenix film restoration system','Christie Laser DCP, DCI compliant projector','4K DCI compliant Sony projector','NEC DCI compliant projectors','Northlight 2 film scanner','Arri Scanner','Arri Film Recorder','Spirit 4K Telecine'];
const LAB = ['35mm Cinevator','35mm Model C, Bell and Howell printer','16mm Model C, Schmitzer liquid gate equipped','Bell and Howell printer 35/16/8mm','Allen Products ECN-2 processing, 18 fpm at 35mm','35/16/8mm Houston Fearless E-6 processing machine, 14 fpm at 35mm','35/16mm black and white spray machine','Densitometers, Moviola and Nu-made rewinds, split reels 16mm and 35mm'];

export default function Prices() {
  return (
    <SiteShell>
      <PageTitle kicker="Yes, our prices are negotiable." title="Digital intermediate & film scanning" lead="Professional film scanning at the highest level plus wet gate scanning and recording. Simplified 8K/6K/4K workflow from A to Z, including world-class D.I. for the most demanding applications and projects." />
      <Section>
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-sm uppercase tracking-[0.16em] text-accent">Scanning, grading & projection</h2>
            <SpecList items={SYSTEMS} />
          </div>
          <div>
            <h2 className="mb-4 text-sm uppercase tracking-[0.16em] text-accent">Photochemical lab</h2>
            <SpecList items={LAB} />
          </div>
        </div>
      </Section>
      <Section title="Rate card highlights">
        <div className="grid gap-6 sm:grid-cols-3">
          {[['Phantom Flex 4K + technician','$900 / day'],['Phantom Flex 4K weekly','$3,400 / week'],['Nucoda Phoenix on-set dailies','$4,500 / week']].map(([label, price]) => (
            <div key={label} className="border border-border bg-card p-6">
              <p className="text-sm uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
              <p className="mt-3 font-display text-3xl font-bold text-primary">{price}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-muted-foreground">Ask for our best monthly rate for an entire production — rent the Phantom for the price of an Arri.</p>
      </Section>
      <Section title="Our facility">
        <ImageGrid images={images.post} alt="Digital intermediate suite" columns={3} />
      </Section>
      <Section><ContactStrip /></Section>
    </SiteShell>
  );
}
