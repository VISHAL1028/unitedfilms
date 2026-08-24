// Production — exact port of film-essence-archive production.tsx
import { ContactStrip, PageTitle, Section, SiteShell } from '@/components/site/SiteSection';
import { ImageGrid, SpecList, VideoBlock, VideoGrid } from '@/components/site/MediaBlocks';
import { clips, images } from '@/lib/site-media';

const PACKAGE = ['Phantom Flex 4K camera','Recorder + preview monitor','Tripod','Lenses 50mm, 100mm, 300mm (vintage lens set available)','Remote control','Underwater housing for the Phantom camera (in making)','Splash bag camera protection','Flame relighting workstation — save time and money on set'];

export default function Production() {
  return (
    <SiteShell>
      <PageTitle kicker="2 formats at the same time" title="Production" lead="Phantom Flex 4K super slow motion camera shoots two formats — high speed and regular speed — at the same time. Film production, live sports, expeditions, commercials and research." />
      <Section><VideoBlock clip={clips.hero} /></Section>
      <Section>
        <div className="grid items-center gap-10 md:grid-cols-2">
          <img src={images.phantomHero} alt="Phantom Flex 4K camera" className="w-full border border-border object-cover" />
          <div>
            <h2 className="text-2xl uppercase leading-tight sm:text-4xl">Phantom Flex 4K for hire</h2>
            <p className="mt-5 text-muted-foreground">Give your production edge. You get the same price as an Arri Alexa but with the versatility of a universal high-speed camera. Our rental includes a skilled camera technician.</p>
            <ul className="mt-6 space-y-2 text-muted-foreground">
              <li>— Standard motion: one channel at 24-30 fps</li>
              <li>— High-speed action: a second channel up to 2000 fps</li>
              <li>— Camera + lens set + tripod + c-stands + 3 ton lights, electric and grip</li>
              <li>— Available on set: Nucoda / Flame</li>
            </ul>
            <div className="mt-8"><ContactStrip /></div>
          </div>
        </div>
      </Section>
      <Section title="Included in the package">
        <SpecList items={PACKAGE} />
      </Section>
      <Section title="On set">
        <ImageGrid images={[images.phantomHero, ...images.phantom]} alt="Phantom Flex 4K on set" columns={3} />
      </Section>
      <Section title="Footage">
        <VideoGrid clips={clips.showcase} />
      </Section>
    </SiteShell>
  );
}
