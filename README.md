# Prism UI — Design System Workbench

A multi-design-system workbench: switchable **UI libraries** (each a complete
pack of components + three-layer tokens + composer context), a live theming
playground (Radix Themes Playground pattern), a Puck-based screen composer,
and one-click export of any library's token set as Figma-ready W3C DTCG JSON.

Ships with three UI libraries — **Volt** (EV charging app design system),
**Atlas Web** (the atlasmotors.com website design system), and **Atlas Charge**
(a mobile-first Calm Utility charging system with 61 specified component
families). Switch with the
header dropdown: the playground catalog, tokens, brand presets, and the
composer's component tray, seed screens, and documents all follow the active
library (`src/libraries/`, one pack per library, code-split via dynamic
import).

```bash
npm install
npm run dev     # playground at http://localhost:5173
npm test        # token model, packs, composer, codegen, DTCG, and CSS contracts
npm run build   # typecheck + production build
```

## The three layers

```
┌─────────────────────────────────────────────────────────────┐
│ 03 · COMPONENT (~150 tokens — every themeable slot)         │
│   button.solid.bg → {semantic:accent.9}                     │
│   battery-bar.fill → {semantic:status.available}            │
│   button.radius → {semantic:radius.interactive}             │  aliases ↓
├─────────────────────────────────────────────────────────────┤
│ 02 · BRAND (semantic)                                       │
│   generated: --ev-accent-1..12 (+alpha, contrast, surface)  │
│              --ev-gray-1..12 (tinted per brand)             │
│   roles:     --ev-color-bg/surface/panel/text/border        │
│              --ev-status-available/charging/occupied/…      │
│              radius.small/interactive/container/overlay     │
│              text.caption/body/label/title/heading/display  │
│   geometry:  --ev-scaling, --ev-radius-factor, --ev-radius-full │  aliases ↓
├─────────────────────────────────────────────────────────────┤
│ 01 · GLOBAL (primitives)                                    │
│   fixed scales: gray/green/blue/amber/red 1..12 (light+dark)│
│   dimensions: space, radius, font-size, line-height         │
│   shadow / duration / easing / z                            │
└─────────────────────────────────────────────────────────────┘
```

Back-referencing is strict: component color tokens alias **only** the brand
layer (`status.available → global:green.9` is the brand layer's own hop), and
component geometry chains through brand-tier roles
(`button.radius → radius.interactive → radius.3`). The consumption contract —
component CSS takes colors only from component tokens or semantic roles,
never raw scales — is enforced by `src/tokens/css-contract.test.ts`, which
also fails on any CSS variable that no token emits.

- **Source of truth** is a typed token model (`src/tokens/types.ts`): each
  token has a path, a DTCG type, literal or per-mode values, and optionally an
  alias into another layer. The same model feeds both the CSS emitter and the
  Figma serializer.
- **CSS emission** (`src/tokens/emit.ts`): tokens become `--ev-*` custom
  properties on `<html>`. Aliases emit `var()` references, so cross-layer
  indirection is native CSS. Dimensions emit
  `calc(base × --ev-scaling [× --ev-radius-factor])` — two brand knobs
  retheme the entire geometry (the Radix Themes multiplier pattern).
- **Brand generation** (`src/tokens/brand.ts`): one accent hex →
  full 12-step light+dark scales via the vendored MIT
  [Radix custom-palette generator](https://github.com/radix-ui/website)
  (OKLCH interpolation between hand-tuned scales; step 9 is the exact brand
  color). Gray tint, radius, scaling, typeface and panel translucency are the
  other brand-layer inputs.
- **Motion is a first-class tier**: 5 duration primitives + 4 easing curves
  (`src/tokens/global.ts`), five brand-tier intent roles
  (`motion.interaction/entrance/exit/progress/emphasis`), and component
  motion tokens (`button.transition-*`, `ring.pulse-duration`, …) that every
  CSS transition/keyframe consumes. Synced to Figma as variables plus
  keyframe animation on Spinner, charging StatusBadge, and the SOC ring.
- **Motion is a first-class tier**: 5 duration primitives + 4 easing curves,
  five brand-tier intent roles (`motion.interaction/entrance/exit/progress/
  emphasis`), and component motion tokens that every CSS transition and
  keyframe consumes. JS choreography uses **Motion for React** fed by the
  same tokens (`src/theme/motion.ts`): AnimatePresence exit animations on the
  station sheet and step transitions on the stepper follow the
  motion.dev/docs/radix pattern (asChild + forceMount), with
  `MotionConfig reducedMotion="user"` for accessibility. Synced to Figma as
  41 variables plus native keyframe animation on Spinner, charging
  StatusBadge, and the SOC ring.
- **Status semantics are pinned in the global layer** (industry convention:
  green=available, blue=in-use, amber=occupied, red=faulted, gray=offline).
  Only `status.charging` follows the brand accent. Power tier is encoded as
  bolt count, never with status colors.

## Components (15 atoms · 21 molecules · 6 organisms)

The inventory below describes Volt. Atlas Web and Atlas Charge are independent,
code-split packs with their own tiered catalogues. Atlas Charge preserves every
one of the 61 catalogue families in its playground while consolidating shared
anatomy into reusable variants; its token architecture and visual rules are in
`src/libraries/atlas-charge/DESIGN.md`.

| Tier | Components |
|---|---|
| Atoms | Button, StatusBadge, Tag, ConnectorIcon (CCS1/CCS2/CHAdeMO/J1772/Type 2/NACS/GB-T), PowerText, PriceText, BatteryGlyph, Input, CodeInput (segmented OTP / charger code), Switch, Spinner, Icon (curated Hugeicons set), FreshnessIndicator, PaymentStatusTag, Skeleton |
| Molecules | ConnectorChip, StationListCard, MapPin, FilterChip, SessionStat, BatteryProgressBar (charge-limit tick), PricingTable (time bands, member/guest, idle fee), PaymentMethodRow, Alert (incl. guidance tone + action), Toast, AppHeader, ListRow/ListGroup, SegmentedControl, LocationStatusCard, ChargerStatusRow, EmptyState, ActiveSessionCard, DurationSelector, WalletBalanceCard, LineItemList, SupportContextCard |
| Organisms | StationDetailSheet, ActiveChargingSession (ring + linear archetypes, OCPP session states, no-telemetry fallback), StartChargeStepper (parameterizable rail + failed state), BottomSheet, BottomNavBar (docked center scan action), ScannerFrame |

Components consume **only** semantic/component variables — never raw values —
so every brand edit rethemes them live with zero React re-renders. Statuses
follow the OCPP/OCPI vocabulary (`src/components/status.ts`) — 9 states
including `maintenance` (≈INOPERATIVE) and `unknown` (≈UNKNOWN, paired with
FreshnessIndicator for status-trust communication).

## Playground

The playground (`src/playground/`) shows every component as a variant × state
matrix, with a floating **Brand layer** panel: presets (Volt / Polar / Amp),
accent hex + generated scale preview, gray tint, radius, scaling, typeface,
panel style, light/dark. A **Tokens** tab shows all three layers resolved with
alias provenance. State persists in `localStorage`.

## Figma export

**Export for Figma** produces one DTCG (2025.10) file per collection + mode:

| File | Figma collection | Mode |
|---|---|---|
| `primitives.value.tokens.json` | Primitives | Value |
| `semantic.light.tokens.json` | Semantic | Light |
| `semantic.dark.tokens.json` | Semantic | Dark |
| `component.default.tokens.json` | Component | Default |

Import (Figma Professional+, native variables import): drag
`primitives.value.tokens.json` into the Variables panel → rename the
collection **Primitives** → drag both semantic files into one collection
(two modes) → rename **Semantic** → drag the component file → rename
**Component**. Renames matter: cross-collection aliases resolve by collection
name via Figma's `$extensions["com.figma"].aliasData`, with resolved literal
fallbacks so the import never breaks.

Notes: dimensions are exported pre-multiplied by the brand's scaling/radius
factor (Figma variables can't `calc()`); shadows are excluded (effect styles,
not variables); values reflect the brand active at export time.

## Composer (`/composer`)

A hybrid composition surface for prototyping screens from the active live
component library: a pan/zoom **board** (react-zoom-pan-pinch, MIT) holds
responsive screen frames; double-click opens a structured **Puck** editor
(`@puckeditor/core`, pinned) where components drop into real CSS flow with
typed prop fields. Screens re-theme live with the brand panel — including
inside Puck's preview iframe (ThemeBridge mirrors the runtime CSS variables).

- Document model: `ComposerDoc` (canvas-agnostic envelope; localStorage
  autosave + JSON import/export)
- Exports: per-screen **JSX** (`src/composer/codegen.ts`), whole-doc JSON,
  and, where configured, a **Figma-sync mapping** keyed to that UI library
  (`src/composer/figmaMap.ts`, flow in `scripts/figma-sync.md`)
