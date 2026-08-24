import React from 'react';

type Reveal = () => void;
const deferredSections = new Map<Element, Reveal>();
let sectionObserver: IntersectionObserver | null = null;

function observeSection(element: Element, reveal: Reveal) {
  if (!('IntersectionObserver' in window)) {
    reveal();
    return () => undefined;
  }
  if (!sectionObserver) {
    sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const callback = deferredSections.get(entry.target);
          deferredSections.delete(entry.target);
          sectionObserver?.unobserve(entry.target);
          callback?.();
        }
        if (deferredSections.size === 0) {
          sectionObserver?.disconnect();
          sectionObserver = null;
        }
      },
      { rootMargin: '720px 0px' },
    );
  }
  deferredSections.set(element, reveal);
  sectionObserver.observe(element);
  return () => {
    deferredSections.delete(element);
    sectionObserver?.unobserve(element);
    if (deferredSections.size === 0) {
      sectionObserver?.disconnect();
      sectionObserver = null;
    }
  };
}

export interface SectionDef {
  id: string;
  title: string;
  description?: string;
  render: () => React.ReactNode;
  /** Keep catalogue metadata discoverable while mounting expensive examples
   * only when they approach the viewport. */
  defer?: boolean;
}

export const Section = React.memo(function Section({ def }: { def: SectionDef }) {
  const rootRef = React.useRef<HTMLElement>(null);
  const [mounted, setMounted] = React.useState(!def.defer);

  React.useEffect(() => {
    if (mounted || !def.defer) return;
    const root = rootRef.current;
    if (!root) return;
    return observeSection(root, () => setMounted(true));
  }, [def.defer, mounted]);

  return (
    <section className="pg-section" id={def.id} ref={rootRef}>
      <h3 className="pg-section__title">{def.title}</h3>
      {def.description && (
        <p className="pg-section__desc">{def.description}</p>
      )}
      <div className="pg-section__body" aria-busy={!mounted || undefined}>
        {mounted ? def.render() : (
          <button className="pg-section__load" type="button" onClick={() => setMounted(true)}>
            Load {def.title} examples
          </button>
        )}
      </div>
    </section>
  );
});
