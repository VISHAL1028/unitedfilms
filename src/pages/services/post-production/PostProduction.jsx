// PostProduction — exact port of film-essence-archive post-production.tsx
import { ContactStrip, PageTitle, Section, SiteShell } from '@/components/site/SiteSection';
import { ImageGrid, SpecList, VideoBlock } from '@/components/site/MediaBlocks';
import { clips, images } from '@/lib/site-media';

const SUITE = ['Nucoda color grading system','Phoenix film restoration system','Autodesk Flame — finishing, special effects, on-set relighting','Nucoda Phoenix 2021 with 80TB on-set storage','DCI compliant post production projector available','Support and operator available'];

export default function PostProduction() {
  return (
    <SiteShell>
      <PageTitle kicker="Work flow" title="Post production" lead="On-set color correction and dailies, relighting with Autodesk Flame, and a simplified 8K/6K/4K digital intermediate workflow from A to Z." />
      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          <VideoBlock clip={clips.relighting} />
          <div>
            <h2 className="text-2xl uppercase leading-tight sm:text-4xl">Relighting with Flame</h2>
            <p className="mt-5 text-muted-foreground">We can include Flame finishing and special effects software for on-set relighting. This saves a lot of money — achieve the desired lighting without rebuilding the setup.</p>
            <p className="mt-4 text-muted-foreground">Post on-set color corrections and dailies: 2021 Nucoda Phoenix with 80 terabytes of storage, support and operator available — $4500 per week.</p>
            <div className="mt-6"><SpecList items={SUITE} /></div>
          </div>
        </div>
      </Section>
      <Section title="Our suites">
        <ImageGrid images={[...images.post, ...images.phantom]} alt="Post production suite" columns={3} />
      </Section>
      <Section><ContactStrip /></Section>
    </SiteShell>
  );
}
