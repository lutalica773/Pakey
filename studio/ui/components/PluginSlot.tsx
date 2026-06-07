import type { PakeyStudioUiContribution } from '../../core';

export interface PluginSlotProps {
  region: PakeyStudioUiContribution['region'];
  contributions: PakeyStudioUiContribution[];
}

export function PluginSlot({ region, contributions }: PluginSlotProps) {
  const visibleContributions = contributions.filter(
    (contribution) => contribution.region === region,
  );

  return (
    <section data-plugin-region={region} aria-label={`${region} plugins`}>
      {visibleContributions.map((contribution) => (
        <div key={contribution.id} data-plugin-contribution={contribution.id}>
          {contribution.title}
        </div>
      ))}
    </section>
  );
}
