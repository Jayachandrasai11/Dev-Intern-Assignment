import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'motion/react';
import { cssMotionTransition } from '../../theme/motion';
import { Button, PowerText, StatusBadge, Tag } from '../atoms';
import type { StationData } from '../data';
import { SAMPLE_PRICE_BANDS } from '../data';
import { ConnectorChip, PricingTable } from '../molecules';

export interface StationDetailSheetProps {
  station: StationData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StationDetailSheet({
  station,
  open,
  onOpenChange,
}: StationDetailSheetProps) {
  const s = station;
  // motion.dev/docs/radix pattern: hoisted open state + AnimatePresence +
  // forceMount so the exit animation plays before Radix unmounts the portal.
  const enter = cssMotionTransition('entrance');
  const exitT = cssMotionTransition('exit');
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="ev-sheet__overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: exitT }}
                transition={enter}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount aria-describedby={undefined}>
              <motion.div
                className="ev-sheet"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%', transition: exitT }}
                transition={enter}
              >
          <header className="ev-sheet__header">
            <div>
              <Dialog.Title className="ev-sheet__title">{s.name}</Dialog.Title>
              <p className="ev-sheet__meta">
                {s.network} · {s.distanceKm.toFixed(1)} km · {s.address}
              </p>
            </div>
            <Dialog.Close asChild>
              <button className="ev-sheet__close" aria-label="Close">
                <svg viewBox="0 0 24 24" aria-hidden>
                  <path d="M6 6 L18 18 M18 6 L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </Dialog.Close>
          </header>

          <div className="ev-sheet__status-row">
            <StatusBadge
              status={s.status}
              form="count"
              count={{ free: s.free, total: s.total }}
            />
            <PowerText kw={s.maxKw} tier={s.tier} />
          </div>

          <section className="ev-sheet__section">
            <h4>Chargers</h4>
            <div className="ev-sheet__connectors">
              {s.connectors.map((c) => (
                <ConnectorChip
                  key={c.stallId}
                  form="row"
                  type={c.type}
                  status={c.status}
                  kw={c.kw}
                  pricePerKwh={c.pricePerKwh}
                  stallId={c.stallId}
                />
              ))}
            </div>
          </section>

          <section className="ev-sheet__section">
            <h4>Pricing</h4>
            <PricingTable
              bands={SAMPLE_PRICE_BANDS}
              showMember
              idleFeePerMin={0.4}
            />
          </section>

          <section className="ev-sheet__section">
            <h4>Amenities</h4>
            <div className="ev-sheet__amenities">
              {s.amenities.map((a) => (
                <Tag key={a}>{a}</Tag>
              ))}
            </div>
          </section>

          <footer className="ev-sheet__footer">
            <Button variant="solid" size="lg">
              Navigate
            </Button>
            <Button variant="ghost" size="lg">
              Report issue
            </Button>
          </footer>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
