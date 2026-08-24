// FilmRestoration — exact port of film-essence-archive film-restoration.tsx
import { ContactStrip, PageTitle, Section, SiteShell } from '@/components/site/SiteSection';
import { SpecList, VideoBlock } from '@/components/site/MediaBlocks';
import { clips } from '@/lib/site-media';

const WORKFLOW = ['Lipsner Smith ultrasonic film cleaning','Spirit 4K or Arriscan 4/6K scanning','Phoenix restoration into Nucoda grading','Optional Arri Laser back out to archival film or tape'];

export default function FilmRestoration() {
  return (
    <SiteShell>
      <PageTitle kicker="Free 1 min test" title="Film restoration" lead="16/35mm film scanning. SMPTE standards film restoration and preservation, end to end, on our own machines." />
      <Section><VideoBlock clip={clips.restoration} /></Section>
      <Section title="Workflow">
        <div className="grid gap-10 md:grid-cols-2">
          <SpecList items={WORKFLOW} />
          <div>
            <p className="text-muted-foreground">
              Send us a reel and we will scan and restore one minute free of charge so you can judge the result before committing to a full restoration.
            </p>
            <div className="mt-6"><ContactStrip /></div>
          </div>
        </div>
      </Section>
    </SiteShell>
  );
}
