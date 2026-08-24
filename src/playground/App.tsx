import * as Tabs from '@radix-ui/react-tabs';
import { lazy, Suspense, useState } from 'react';
import { LibrarySwitcher } from '../libraries/LibrarySwitcher';
import { useLibrary } from '../libraries/useLibrary';
import { Section } from './Section';
import { ThemePanel } from './ThemePanel';
import { TokensView } from './TokensView';

const ExportDialog = lazy(() =>
  import('./ExportDialog').then((module) => ({ default: module.ExportDialog })),
);

export function App() {
  const { library } = useLibrary();
  const [exportOpen, setExportOpen] = useState(false);
  return (
    <div className="pg-app">
      <ThemePanel
        presets={library.presets}
        onExport={() => setExportOpen(true)}
      />
      {exportOpen && (
        <Suspense fallback={<span className="pg-visually-hidden" role="status">Preparing export…</span>}>
          <ExportDialog open onOpenChange={setExportOpen} />
        </Suspense>
      )}
      <header className="pg-header">
        <div className="pg-header__brand">
          <svg viewBox="0 0 24 24" className="pg-header__logo" aria-hidden>
            <path
              d="M13 2 L5.5 13.5 h4.5 L9 22 l7.5-11.5 H12 Z"
              fill="currentColor"
            />
          </svg>
          <div>
            <h1>Prism UI</h1>
            <p>{library.tagline}</p>
          </div>
        </div>
        <LibrarySwitcher />
      </header>

      <Tabs.Root defaultValue="components" className="pg-tabs">
        <Tabs.List className="pg-tabs__list" aria-label="Playground views">
          <Tabs.Trigger value="components" className="pg-tabs__trigger">
            Components
          </Tabs.Trigger>
          <Tabs.Trigger value="tokens" className="pg-tabs__trigger">
            Tokens
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="components" className="pg-tabs__content">
          {library.tiers.map((tier) => (
            <div key={tier.id} className="pg-tier" id={tier.id}>
              <h2 className="pg-tier__title">{tier.title}</h2>
              <p className="pg-tier__blurb">{tier.blurb}</p>
              {tier.sections.map((s) => (
                <Section key={s.id} def={s} />
              ))}
            </div>
          ))}
        </Tabs.Content>

        <Tabs.Content value="tokens" className="pg-tabs__content">
          <TokensView />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
