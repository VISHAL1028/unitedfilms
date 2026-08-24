// Vr360 — exact port of film-essence-archive vr-360-3d.tsx
import { ContactStrip, PageTitle, Section, SiteShell } from '@/components/site/SiteSection';
import { ImageGrid, SpecList } from '@/components/site/MediaBlocks';
import { images } from '@/lib/site-media';

const STEPS = [
  { title: '1. Pre-production planning', items: ['Concept development — define the virtual environment and how it will be used','Location scouting worldwide for optimal light and minimal obstructions','Permits and logistics, including remote or challenging environments'] },
  { title: '2. Capturing 360° content', items: ['Professional 360° 3D cameras: Insta360 Titan, Kandao Obsidian, custom RED/VR rigs','Stabilization and rigging with drones, gimbals or robotic arms','HDR and high resolution capture at 8K-12K for realistic depth','Lighting planned for seamless blending with virtual elements'] },
  { title: '3. Post-production & processing', items: ['Stitching and rendering with Mistika VR, Kolor Autopano or Premiere VR tools','Color grading, cleanup, rig and shadow removal','Optimized for real-time engines — Unreal Engine, Unity'] },
  { title: '4. Quick turnaround & global deployment', items: ['Remote cloud editing for fast, global collaboration','AI-assisted stitching and object removal','High-speed delivery via cloud storage or VR content delivery networks'] },
];

export default function Vr360() {
  return (
    <SiteShell>
      <PageTitle kicker="Bubble of your universe" title="VR 360 3D production and post" lead="With our expertise we bring your content to life like never before. Our team makes your project visually stunning and immersive, turning your ideas into a virtual reality experience that leaves your audience amazed." />
      <Section><ImageGrid images={images.vr} alt="360 3D VR production" columns={3} /></Section>
      <Section title="Workflow for virtual stage backgrounds">
        <div className="grid gap-10 md:grid-cols-2">
          {STEPS.map((step) => (
            <div key={step.title}>
              <h3 className="mb-4 text-sm uppercase tracking-[0.16em] text-accent">{step.title}</h3>
              <SpecList items={step.items} />
            </div>
          ))}
        </div>
      </Section>
      <Section title="Industries">
        <p className="max-w-3xl text-muted-foreground">360° virtual reality 3D productions for the pharmaceutical and medical device industries, plus 3D 360° filming for virtual reality studio backdrops. Immersive experiences are the future of marketing, and our 360° video technology is at the forefront of this revolution.</p>
        <div className="mt-8"><ContactStrip /></div>
      </Section>
    </SiteShell>
  );
}
