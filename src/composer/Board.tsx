import { useRef } from 'react';
import {
  TransformComponent,
  TransformWrapper,
  useControls,
} from 'react-zoom-pan-pinch';
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import type { Config } from '@puckeditor/core';
import { LibrarySwitcher } from '../libraries/LibrarySwitcher';
import { useLibrary } from '../libraries/useLibrary';
import type { ComposerDoc } from './schema';
import {
  addScreen,
  deleteScreen,
  duplicateScreen,
  patchScreen,
  renameScreen,
} from './schema';
import { Frame } from './Frame';

export interface BoardProps {
  /** The active UI library's Puck config (for frame previews). */
  config: Config;
  doc: ComposerDoc;
  update: (fn: (doc: ComposerDoc) => ComposerDoc) => void;
  onOpenScreen: (id: string) => void;
  onExport: () => void;
}

function ZoomControls() {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  return (
    <span className="cmp-toolbar__zoom">
      <button onClick={() => zoomOut()} title="Zoom out">−</button>
      <button onClick={() => resetTransform()} title="Reset view">⤢</button>
      <button onClick={() => zoomIn()} title="Zoom in">+</button>
    </span>
  );
}

export function Board({ config, doc, update, onOpenScreen, onExport }: BoardProps) {
  const { library } = useLibrary();
  const scaleRef = useRef(0.6);

  const rename = (id: string) => {
    const current = doc.screens.find((s) => s.id === id);
    const name = window.prompt('Screen name', current?.name ?? '');
    if (name) update((d) => renameScreen(d, id, name));
  };
  const remove = (id: string) => {
    const current = doc.screens.find((s) => s.id === id);
    if (window.confirm(`Delete screen “${current?.name}”?`)) {
      update((d) => deleteScreen(d, id));
    }
  };

  return (
    <div className="cmp-board">
      <TransformWrapper
        minScale={0.15}
        maxScale={2}
        initialScale={0.6}
        initialPositionX={40}
        initialPositionY={40}
        limitToBounds={false}
        doubleClick={{ disabled: true }}
        panning={{ velocityDisabled: true, excluded: ['cmp-no-pan'] }}
        onTransform={(_ref: ReactZoomPanPinchRef, state: { scale: number }) => {
          scaleRef.current = state.scale;
        }}
      >
        <div className="cmp-toolbar cmp-no-pan">
          <strong>⚡ Prism UI Composer</strong>
          <LibrarySwitcher />
          <button
            className="cmp-toolbar__primary"
            onClick={() =>
              update((d) =>
                addScreen(
                  d,
                  `Screen ${d.screens.length + 1}`,
                  library.defaultViewport,
                ),
              )
            }
          >
            + Add screen
          </button>
          <button onClick={onExport}>Export</button>
          <ZoomControls />
          <span className="cmp-toolbar__hint">
            drag header to move · double-click screen to edit · scroll to zoom
          </span>
        </div>
        <TransformComponent
          wrapperClass="cmp-board__viewport"
          contentClass="cmp-board__world"
        >
          <div className="cmp-board__surface">
            {doc.screens.map((screen) => (
              <Frame
                key={screen.id}
                config={config}
                screen={screen}
                scale={() => scaleRef.current}
                onMove={(id, x, y) => update((d) => patchScreen(d, id, { x, y }))}
                onOpen={onOpenScreen}
                onRename={rename}
                onDuplicate={(id) => update((d) => duplicateScreen(d, id))}
                onDelete={remove}
              />
            ))}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}
