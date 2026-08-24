import { useState } from 'react';
import { Button } from '../../components/atoms';
import {
  SAMPLE_PHASES,
  SAMPLE_SESSION,
  SAMPLE_STATIONS,
} from '../../components/data';
import {
  ActiveChargingSession,
  BottomNavBar,
  BottomSheet,
  BottomSheetViews,
  ScannerFrame,
  StartChargeStepper,
  StationDetailSheet,
} from '../../components/organisms';
import type { SectionDef } from '../Section';

function BottomSheetDemo() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<'menu' | 'confirm'>('menu');
  return (
    <>
      <Button
        onClick={() => {
          setView('menu');
          setOpen(true);
        }}
      >
        Open bottom sheet
      </Button>
      <BottomSheet open={open} onOpenChange={setOpen}>
        <BottomSheetViews
          view={view}
          views={{
            menu: (
              <div className="pg-stack" style={{ gap: 8 }}>
                <strong style={{ fontSize: 'var(--ev-text-title)', color: 'var(--ev-color-text)' }}>
                  Charging options
                </strong>
                <Button variant="soft" size="lg">Set charge limit</Button>
                <Button variant="soft" size="lg">Schedule charging</Button>
                <Button variant="ghost" size="lg" onClick={() => setView('confirm')}>
                  Stop charging…
                </Button>
              </div>
            ),
            confirm: (
              <div className="pg-stack" style={{ gap: 10 }}>
                <strong style={{ fontSize: 'var(--ev-text-title)', color: 'var(--ev-color-text)' }}>
                  Stop charging?
                </strong>
                <p style={{ fontSize: 'var(--ev-text-body)', color: 'var(--ev-color-text-secondary)' }}>
                  Your vehicle is at 64%. Stopping now may leave you short for
                  the trip home.
                </p>
                <Button size="lg" className="ev-session__stop" onClick={() => setOpen(false)}>
                  Yes, stop charging
                </Button>
                <Button variant="ghost" size="lg" onClick={() => setView('menu')}>
                  Cancel
                </Button>
              </div>
            ),
          }}
        />
      </BottomSheet>
    </>
  );
}

function SheetDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open station sheet</Button>
      <StationDetailSheet
        station={SAMPLE_STATIONS[0]}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}

function BottomNavDemo() {
  const [active, setActive] = useState('home');
  return (
    <div className="pg-stack" style={{ maxWidth: 375 }}>
      <div style={{ border: '1px solid var(--ev-color-border)', borderRadius: 'var(--ev-card-radius)', overflow: 'hidden' }}>
        <div style={{ height: 56 }} />
        <BottomNavBar
          items={[
            { id: 'home', icon: 'home', label: 'Home' },
            { id: 'history', icon: 'receipt', label: 'Records', badge: true },
          ]}
          activeId={active}
          onSelect={setActive}
          centerAction={{ icon: 'qr-code', label: 'Scan' }}
        />
      </div>
      <div style={{ border: '1px solid var(--ev-color-border)', borderRadius: 'var(--ev-card-radius)', overflow: 'hidden' }}>
        <div style={{ height: 24 }} />
        <BottomNavBar
          items={[
            { id: 'home', icon: 'home', label: 'Home' },
            { id: 'map', icon: 'map-pin', label: 'Nearby' },
            { id: 'history', icon: 'receipt', label: 'Records' },
            { id: 'profile', icon: 'user', label: 'Profile' },
          ]}
          activeId={active}
          onSelect={setActive}
        />
      </div>
    </div>
  );
}

function StepperDemo() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(2);
  return (
    <div className="pg-stack">
      <div className="pg-row">
        {([1, 2, 3, 4] as const).map((n) => (
          <Button
            key={n}
            size="sm"
            variant={step === n ? 'solid' : 'outline'}
            onClick={() => setStep(n)}
          >
            Step {n}
          </Button>
        ))}
      </div>
      <StartChargeStepper step={step} />
    </div>
  );
}

export const ORGANISM_SECTIONS: SectionDef[] = [
  {
    id: 'bottom-nav',
    title: 'BottomNavBar',
    description:
      'Mobile bottom navigation. The docked center action keeps scan-to-charge one tap from anywhere; a plain tab row is available when the IA has no primary action.',
    render: () => <BottomNavDemo />,
  },
  {
    id: 'scanner-frame',
    title: 'ScannerFrame',
    description:
      'QR viewfinder for fresh charger identification — every new session starts from a scan. Presentational: the camera feed mounts into the children slot; the manual-code fallback is mandatory.',
    render: () => (
      <div className="pg-grid-2" style={{ maxWidth: 760 }}>
        <ScannerFrame onTorchToggle={() => {}} onManualCode={() => {}} />
        <ScannerFrame
          state="success"
          instruction="Charger LKV-B2 identified"
          torchOn
          onTorchToggle={() => {}}
          onManualCode={() => {}}
        />
      </div>
    ),
  },
  {
    id: 'active-session',
    title: 'ActiveChargingSession',
    description:
      'Both industry archetypes: the OEM-style radial ring and the network-style linear bar with target tick. States map 1:1 to OCPP session states, including the no-telemetry fallback.',
    render: () => (
      <div className="pg-grid-2">
        <ActiveChargingSession session={SAMPLE_SESSION} />
        <ActiveChargingSession
          archetype="linear"
          session={SAMPLE_SESSION}
          state="charging"
        />
        <ActiveChargingSession
          session={{ ...SAMPLE_SESSION, kw: 0 }}
          state="suspended"
        />
        <ActiveChargingSession
          session={{ ...SAMPLE_SESSION, soc: 80, kw: 2 }}
          state="finishing"
        />
        <ActiveChargingSession
          session={{ ...SAMPLE_SESSION, soc: undefined }}
          telemetry={false}
        />
      </div>
    ),
  },
  {
    id: 'start-charge',
    title: 'StartChargeStepper',
    description:
      'Default start flow, plus the parameterized rail expressing the start-handshake vocabulary — including the failed state for interruption communication.',
    render: () => (
      <div className="pg-stack">
        <StepperDemo />
        <StartChargeStepper step={3} steps={SAMPLE_PHASES} />
        <StartChargeStepper step={2} steps={SAMPLE_PHASES} failed />
      </div>
    ),
  },
  {
    id: 'bottom-sheet',
    title: 'BottomSheet',
    description:
      'Family-drawer pattern (animations.dev / Vaul lineage): iOS sheet curve entrance via motion.entrance, drag-to-dismiss with damped overdrag and velocity thresholds, and morphing view swaps (animated height + blur crossfade on the motion.swap role). Try dragging it down, and switch views.',
    render: () => <BottomSheetDemo />,
  },
  {
    id: 'station-sheet',
    title: 'StationDetailSheet',
    description:
      'Radix Dialog side sheet: per-stall charger rows, dual-price table, amenities.',
    render: () => <SheetDemo />,
  },
];
