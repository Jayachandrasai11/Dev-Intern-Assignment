import React, { useRef } from 'react';
import { Render } from '@puckeditor/core';
import type { Config } from '@puckeditor/core';
import type { ComposerScreen } from './schema';
import { VIEWPORT_SIZES } from './schema';

export interface FrameProps {
  /** The active UI library's Puck config. */
  config: Config;
  screen: ComposerScreen;
  scale: () => number;
  onMove: (id: string, x: number, y: number) => void;
  onOpen: (id: string) => void;
  onRename: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

/** A screen on the board: header chrome + live non-interactive preview. */
export function Frame({
  config,
  screen,
  scale,
  onMove,
  onOpen,
  onRename,
  onDuplicate,
  onDelete,
}: FrameProps) {
  const size = VIEWPORT_SIZES[screen.viewport];
  const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(
    null,
  );

  const onPointerDown = (e: React.PointerEvent) => {
    // Frame drag owns this gesture — keep the board from panning.
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { px: e.clientX, py: e.clientY, x: screen.x, y: screen.y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const s = scale() || 1;
    onMove(
      screen.id,
      Math.round(drag.current.x + (e.clientX - drag.current.px) / s),
      Math.round(drag.current.y + (e.clientY - drag.current.py) / s),
    );
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  return (
    <div
      className="cmp-frame"
      style={{ left: screen.x, top: screen.y, width: size.width }}
    >
      <div
        className="cmp-frame__header"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onDoubleClick={() => onRename(screen.id)}
        title="Drag to move · double-click to rename"
      >
        <span className="cmp-frame__name">{screen.name}</span>
        <span className="cmp-frame__actions">
          <button onClick={() => onOpen(screen.id)} title="Edit screen">
            ✏️
          </button>
          <button onClick={() => onDuplicate(screen.id)} title="Duplicate">
            ⧉
          </button>
          <button onClick={() => onDelete(screen.id)} title="Delete">
            ✕
          </button>
        </span>
      </div>
      <div
        className="cmp-frame__body"
        style={{ width: size.width, height: size.height }}
        onDoubleClick={() => onOpen(screen.id)}
        title="Double-click to edit"
      >
        <div className="cmp-frame__content">
          <Render config={config} data={screen.puckData} />
        </div>
        {screen.puckData.content.length === 0 && (
          <div className="cmp-frame__empty">Double-click to compose</div>
        )}
      </div>
    </div>
  );
}
