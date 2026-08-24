import { useState, useEffect } from 'react';
import { ContactStrip, PageTitle, Section, SiteShell } from '@/components/site/SiteSection';
import { SpecList, VideoBlock } from '@/components/site/MediaBlocks';
import { clips } from '@/lib/site-media';
import { getSpecialRentalConfig } from '@/lib/db';

const DEFAULT_INCLUDED = [
  'Phantom Flex 4K camera + recorder + preview monitor',
  'Flame relighting workstation on set',
  'Miller fluid head camera tripod',
  'PL lens set — Canon 50mm and 300mm zoom',
  '3 tons grip, electric and set lighting: lights, cables, gels, green screen, board and more',
  'Camera technician / operator',
  'Underwater remote control housing and drone also available',
];

export default function SpecialRental() {
  const [config, setConfig] = useState({
    kicker: '!!! Special special special !!!',
    title: 'Special rental',
    lead: 'Give your production edge. Phantom Flex 4K universal camera: two formats, high speed up to 1000 fps and regular speed 24/30 fps at the same time. More than 60% off super deal.',
    dailyRate: '$900',
    dailyLabel: 'Daily rate',
    weeklyRate: '$3,400',
    weeklyLabel: 'Weekly rate',
    packageRate: '$4,200 / week',
    packageLabel: 'Phantom + recorder + Flame relighting',
    monthlyNote: 'Ask for the best monthly rate for an entire production — rent the Phantom for the price of an Arri.',
    includedItems: DEFAULT_INCLUDED,
  });

  useEffect(() => {
    getSpecialRentalConfig()
      .then((data) => {
        if (data) setConfig((prev) => ({ ...prev, ...data }));
      })
      .catch(() => {});
  }, []);

  const rateCards = [
    [config.dailyLabel || 'Daily rate', config.dailyRate || '$900'],
    [config.weeklyLabel || 'Weekly rate', config.weeklyRate || '$3,400'],
    [config.packageLabel || 'Phantom + recorder + Flame relighting', config.packageRate || '$4,200 / week'],
  ];

  return (
    <SiteShell>
      <PageTitle
        kicker={config.kicker}
        title={config.title}
        lead={config.lead}
      />
      <Section>
        <div className="grid gap-6 sm:grid-cols-3">
          {rateCards.map(([label, price]) => (
            <div key={label} className="border border-border bg-card p-6">
              <p className="text-sm uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
              <p className="mt-3 font-display text-3xl font-bold text-primary">{price}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-muted-foreground">{config.monthlyNote}</p>
      </Section>
      <Section>
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-sm uppercase tracking-[0.16em] text-accent">Included free of charge</h2>
            <SpecList items={config.includedItems || DEFAULT_INCLUDED} />
            <div className="mt-8"><ContactStrip /></div>
          </div>
          <VideoBlock clip={clips.relighting} />
        </div>
      </Section>
    </SiteShell>
  );
}
