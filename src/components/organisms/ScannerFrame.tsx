import React from 'react';
import { Icon } from '../atoms';

export interface ScannerFrameProps {
  /** e.g. "Point at the QR code on the charger". */
  instruction?: string;
  state?: 'scanning' | 'success' | 'error';
  torchOn?: boolean;
  onTorchToggle?: () => void;
  /** Manual charger-code fallback — mandatory for every identification flow. */
  onManualCode?: () => void;
  /** Camera feed slot (the camera itself is a host concern). */
  children?: React.ReactNode;
}

/** Presentational QR viewfinder: dark backdrop, corner brackets, sweeping
 *  scan line, torch toggle, and the manual-code fallback entry. */
export function ScannerFrame({
  instruction = 'Point at the QR code on the charger',
  state = 'scanning',
  torchOn,
  onTorchToggle,
  onManualCode,
  children,
}: ScannerFrameProps) {
  return (
    <div className={`ev-scanner ev-scanner--${state}`}>
      <div className="ev-scanner__feed">{children}</div>
      <div className="ev-scanner__frame" aria-hidden>
        <span className="ev-scanner__corner ev-scanner__corner--tl" />
        <span className="ev-scanner__corner ev-scanner__corner--tr" />
        <span className="ev-scanner__corner ev-scanner__corner--bl" />
        <span className="ev-scanner__corner ev-scanner__corner--br" />
        {state === 'scanning' && <span className="ev-scanner__line" />}
      </div>
      <p className="ev-scanner__instruction" role="status">
        {instruction}
      </p>
      <div className="ev-scanner__controls">
        {onTorchToggle && (
          <button
            type="button"
            className={`ev-scanner__control${torchOn ? ' ev-scanner__control--on' : ''}`}
            onClick={onTorchToggle}
            aria-pressed={torchOn}
          >
            <Icon name="bolt" size={16} />
            {torchOn ? 'Torch on' : 'Torch'}
          </button>
        )}
        {onManualCode && (
          <button
            type="button"
            className="ev-scanner__control"
            onClick={onManualCode}
          >
            Enter charger code
          </button>
        )}
      </div>
    </div>
  );
}
