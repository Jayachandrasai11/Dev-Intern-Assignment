# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Prism UI is used by designers and frontend engineers who need to inspect,
theme, compose, and export multiple product-specific interface libraries from
one workbench. The Atlas Charge library ultimately serves EV drivers using a
mobile charging product in discovery, charging, payment, recovery, account,
and support situations.

## Product Purpose

Prism UI keeps component implementations, design tokens, playground coverage,
screen composition, JSX output, and Figma-ready token exports aligned. A UI
library is successful when its visual language and operational states can be
reviewed and rethemed without bypassing the token model.

## Positioning

Each switchable UI-library pack supplies its complete component catalogue,
three-layer token model, theme presets, showcases, and composer behavior while
the shared workbench remains library-agnostic.

## Operating Context

The workbench runs in a desktop browser. Library previews may model mobile or
desktop products; Atlas Charge uses a phone-first 375–390px operating context
and must remain clear during high-anxiety charging and payment uncertainty.

## Capabilities and Constraints

- React 18, TypeScript, Vite, CSS custom properties, and Puck compose the app.
- Tokens follow global → semantic → component aliasing.
- Atlas Charge covers all 61 PRD-aligned catalogue families through reusable
  components and variants, including failure, delay, stale, and recovery states.
- Atlas Charge does not add composed-screen Figma mapping in its first phase.
- Figma references supply layout and anatomy evidence only.

## Brand Commitments

Atlas Charge follows “The Calm Charging Instrument”: warm quiet surfaces,
near-black decisive controls, generous geometry, sparse semantic status color,
and one dominant action. Its supplied DESIGN.md and design.json are visual
authority. The Prism UI accent control changes Charging Ink only.

## Evidence on Hand

- `src/libraries/atlas-charge/DESIGN.md` — the Atlas Charge visual language.
- The 61-family component catalogue, encoded in
  `src/libraries/atlas-charge/showcase/catalogue.tsx`.
- Two competitor Figma files supplied as structural references.

## Product Principles

- Operational confidence outranks decorative novelty.
- Status always carries words or structure in addition to color.
- Uncertain commands expose their named stage and a safe recovery path.
- Shared anatomy becomes variants; distinct user jobs remain findable.
- Components consume component or semantic tokens, never raw color scales.

## Accessibility & Inclusion

Interactive targets are at least 44px where the mobile pattern requires it;
keyboard focus is visible; reduced motion is respected; and status is never
communicated by color alone.
