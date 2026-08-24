// About page — exact port of film-essence-archive about.tsx
import { ContactStrip, PageTitle, Section, SiteShell } from '@/components/site/SiteSection';
import { SpecList } from '@/components/site/MediaBlocks';
import { contactInfo } from '@/lib/site-media';

const ACCESS = ['Live sporting events','Behind-the-scenes production','Press conferences','Exclusive interviews','On-field / on-site recording'];
const CREDITS = ['X Games — high-speed specialty camera operator','ESPN — super slow motion and aerial coverage','National Geographic — expedition cinematographer (360° VR and underwater)'];
const GEAR = ['Phantom Flex 4K','Canon 8K (Netflix approved)','360° 3D VR camera','Underwater cinematic housing','Professional audio and projection equipment'];

export default function AboutPage() {
  return (
    <SiteShell>
      <PageTitle kicker="Media pass" title="About me" lead="United Films" />
      <Section>
        <div className="grid gap-10 md:grid-cols-[minmax(0,380px)_1fr]">
          <div className="rule-band bg-card p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-accent">United Films</p>
            <p className="mt-4 font-display text-2xl font-bold">Vit Kobliha</p>
            <p className="mt-1 text-muted-foreground">Director of Photography / Producer</p>
            <dl className="mt-6 space-y-2 text-sm text-muted-foreground">
              <div><dt className="inline uppercase tracking-[0.1em]">Badge no.: </dt><dd className="inline text-foreground">3536</dd></div>
              <div><dt className="inline uppercase tracking-[0.1em]">Valid through: </dt><dd className="inline text-foreground">12/31/2028</dd></div>
              <div>
                <dt className="inline uppercase tracking-[0.1em]">Phone: </dt>
                <dd className="inline"><a className="text-foreground hover:text-primary" href={contactInfo.phoneHref}>{contactInfo.phone}</a></dd>
              </div>
              <div>
                <dt className="inline uppercase tracking-[0.1em]">Email: </dt>
                <dd className="inline"><a className="text-foreground hover:text-primary" href={contactInfo.emailHref}>{contactInfo.email}</a></dd>
              </div>
              <div><dt className="inline uppercase tracking-[0.1em]">Website: </dt><dd className="inline text-foreground">www.unitedfilms.com</dd></div>
            </dl>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h2 className="mb-4 text-sm uppercase tracking-[0.16em] text-accent">Authorized access to</h2>
              <SpecList items={ACCESS} />
            </div>
            <div>
              <h2 className="mb-4 text-sm uppercase tracking-[0.16em] text-accent">Credits</h2>
              <SpecList items={CREDITS} />
              <h2 className="mt-8 mb-4 text-sm uppercase tracking-[0.16em] text-accent">Equipment credentials</h2>
              <SpecList items={GEAR} />
            </div>
          </div>
        </div>
      </Section>
      <Section><ContactStrip /></Section>
    </SiteShell>
  );
}
