import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { cssMotionTransition } from '../../theme/motion';
import { Button, Input, Spinner } from '../atoms';
import { SAMPLE_STATIONS } from '../data';
import { ConnectorChip } from '../molecules';

export interface StartChargeStepperProps {
  step: number;
  /** Rail labels — override for other vocabularies, e.g. the start
   *  handshake: Start initiated → Command sent → Session started → Charging. */
  steps?: string[];
  /** Marks the current step as failed (interruption communication). */
  failed?: boolean;
  /** Custom body for the current step. The built-in demo body renders only
   *  for the default vocabulary. */
  children?: ReactNode;
}

const STEPS = ['Station', 'Connector', 'Authorize', 'Start'];

export function StartChargeStepper({
  step,
  steps,
  failed,
  children,
}: StartChargeStepperProps) {
  const labels = steps ?? STEPS;
  const showBuiltinBody = steps === undefined && children === undefined;
  return (
    <div className="ev-stepper">
      <ol className="ev-stepper__rail">
        {labels.map((label, i) => {
          const n = i + 1;
          const s =
            n === step && failed
              ? 'failed'
              : n < step
                ? 'done'
                : n === step
                  ? 'current'
                  : 'upcoming';
          return (
            <li key={label} className={`ev-stepper__step ev-stepper__step--${s}`}>
              <span className="ev-stepper__dot">
                {s === 'done' ? (
                  <svg viewBox="0 0 24 24" aria-hidden>
                    <path d="M5 12.5 L10 17.5 L19 7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                ) : s === 'failed' ? (
                  <svg viewBox="0 0 24 24" aria-hidden>
                    <path d="M7 7 L17 17 M17 7 L7 17" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                ) : (
                  n
                )}
              </span>
              <span className="ev-stepper__label">{label}</span>
            </li>
          );
        })}
      </ol>

      {!showBuiltinBody ? (
        children !== undefined ? (
          <div className="ev-stepper__body">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step}
                className="ev-stepper__step-content"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8, transition: cssMotionTransition('exit') }}
                transition={cssMotionTransition('swap')}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        ) : null
      ) : (
      <div className="ev-stepper__body">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            className="ev-stepper__step-content"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: cssMotionTransition('exit') }}
            transition={cssMotionTransition('swap')}
          >
        {step === 1 && (
          <>
            <p className="ev-stepper__hint">
              Scan the QR code on the charger or enter the station ID.
            </p>
            <Input kind="search" placeholder="Station ID, e.g. 44244H-2" />
          </>
        )}
        {step === 2 && (
          <>
            <p className="ev-stepper__hint">Pick your connector.</p>
            <div className="ev-stepper__connectors">
              {SAMPLE_STATIONS[0].connectors.slice(0, 3).map((c, i) => (
                <ConnectorChip
                  key={c.stallId}
                  form="row"
                  type={c.type}
                  status={c.status}
                  kw={c.kw}
                  stallId={c.stallId}
                  selected={i === 0}
                />
              ))}
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <p className="ev-stepper__hint">
              A $30.00 hold will be placed on your default payment method.
            </p>
            <Button variant="solid" size="lg">
              Authorize &amp; start
            </Button>
          </>
        )}
        {step === 4 && (
          <div className="ev-stepper__starting">
            <Spinner size="lg" />
            <p>Starting session — plug in now.</p>
          </div>
        )}
          </motion.div>
        </AnimatePresence>
      </div>
      )}
    </div>
  );
}
