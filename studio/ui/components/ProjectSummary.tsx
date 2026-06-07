import type { PakeyStudioProjectModel } from '../../core';

export interface ProjectSummaryProps {
  project: PakeyStudioProjectModel;
}

export function ProjectSummary({ project }: ProjectSummaryProps) {
  const targetLabel =
    project.build.targets.length > 0
      ? project.build.targets.join(', ')
      : 'No targets selected';

  return (
    <section aria-label="Project summary">
      <h2>{project.identity.name}</h2>
      <dl>
        <div>
          <dt>URL</dt>
          <dd>{project.window.url}</dd>
        </div>
        <div>
          <dt>Identifier</dt>
          <dd>{project.identity.identifier}</dd>
        </div>
        <div>
          <dt>Window</dt>
          <dd>
            {project.window.width} x {project.window.height}
          </dd>
        </div>
        <div>
          <dt>Targets</dt>
          <dd>{targetLabel}</dd>
        </div>
      </dl>
    </section>
  );
}
