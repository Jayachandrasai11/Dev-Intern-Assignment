import { useEffect } from 'react';
import { Puck } from '@puckeditor/core';
import type { Config, Data } from '@puckeditor/core';
import '@puckeditor/core/puck.css';
import { useTheme } from '../theme/useTheme';
import type { ComposerScreen } from './schema';
import { VIEWPORT_SIZES } from './schema';

/**
 * Full-viewport Puck editor for one screen. Theming spike outcome
 * (spec §4): Puck 0.22 injects host stylesheets into its preview iframe
 * automatically; our runtime CSS variables + light/dark class live on the
 * host <html> element's inline style, which is NOT copied — so the iframe
 * override below mirrors them on every brand/appearance change.
 */

function ThemeBridge({ frameDocument }: { frameDocument: Document | null }) {
  const { brand, appearance, emitted } = useTheme();
  useEffect(() => {
    if (!frameDocument) return;
    const host = document.documentElement;
    const target = frameDocument.documentElement;
    for (const prop of Array.from(host.style)) {
      if (prop.startsWith('--ev-')) {
        target.style.setProperty(prop, host.style.getPropertyValue(prop));
      }
    }
    target.classList.remove('light', 'dark');
    target.classList.add(appearance);
  }, [frameDocument, brand, appearance, emitted]);
  return null;
}

export interface EditorProps {
  /** The active UI library's Puck config. */
  config: Config;
  screen: ComposerScreen;
  onChange: (data: Data) => void;
  onClose: () => void;
}

export function Editor({ config, screen, onChange, onClose }: EditorProps) {
  return (
    <div className="cmp-editor">
      <Puck
        config={config}
        data={screen.puckData}
        onChange={onChange}
        onPublish={() => onClose()}
        headerTitle={screen.name}
        viewports={[
          { width: VIEWPORT_SIZES.phone.width, height: VIEWPORT_SIZES.phone.height, label: 'Phone', icon: 'Smartphone' },
          { width: VIEWPORT_SIZES.tablet.width, height: VIEWPORT_SIZES.tablet.height, label: 'Tablet', icon: 'Tablet' },
          { width: VIEWPORT_SIZES.desktop.width, height: VIEWPORT_SIZES.desktop.height, label: 'Desktop', icon: 'Monitor' },
        ]}
        overrides={{
          iframe: ({ children, document: frameDocument }) => (
            <>
              <ThemeBridge frameDocument={frameDocument ?? null} />
              {children}
            </>
          ),
        }}
      />
      <button className="cmp-editor__back" onClick={onClose}>
        ← Board
      </button>
    </div>
  );
}
