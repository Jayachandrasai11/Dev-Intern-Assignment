# Atlas Charge — Calm Utility

This file is the repository-local design authority for the Atlas Charge pack.
It distils the supplied `DESIGN.md` and `design.json`; those source files remain
the authority when a value is not repeated here. The two supplied Figma files
are anatomy and layout references only.

## Character

Atlas Charge is quiet, trustworthy, and operational. It favours warm neutral
surfaces, high-legibility near-black ink, restrained geometry, and explicit
state language. Charging and payment actions must look dependable rather than
promotional.

## Tokens

- Global primitives use the `calm.*` namespace and carry light/dark values.
- Semantic roles express intent and are the only bridge into components.
- Component slots use component/slot paths such as `button.primary.bg`,
  `field.radius`, and `sheet.gap`; CSS consumes only those emitted slots.
- The theme accent controls Charging Ink only. Operational success, warning,
  danger, and info colours remain fixed Calm Utility primitives.
- Default Charging Ink is `#111111` in light mode and `#f7f7f4` in dark mode.
- Light canvas is `#f7f7f4`; dark canvas is `#151513`.

## Type and geometry

Use the native system sans stack. Body copy is 15/21, labels 13/17, titles
17/22, headings 24/29, and display text 44/46. Controls retain a minimum 44px
target. Cards use moderate radii and clear borders; sheets may use restrained
shadow and larger corner radii.

## Iconography

Atlas Charge uses the free Stroke Rounded Hugeicons set through
`@hugeicons/react` and `@hugeicons/core-free-icons`. All product icons render
through the local `ChargeIcon` wrapper with `currentColor` and a consistent
1.8 stroke weight. Icons are decorative when adjacent text or the enclosing
control supplies the accessible name; standalone meaningful icons require an
explicit label. Character glyphs, emoji, and platform-dependent symbols are
not icon substitutes.

Atlas Charge is a mobile-only system. Supported product contexts are narrow
phone portrait and phone landscape with touch input, safe-area insets, dynamic
browser chrome, on-screen keyboards, and text zoom. Wider desktop layouts are
documentation previews only and must not introduce a separate product anatomy.

## Components and states

The implementation mirrors Volt's atomic hierarchy under `components/atoms`,
`components/molecules`, and `components/organisms`; the top-level component
barrel is the only public entry point. Interactive anatomy is headless: Radix
Dialog, Switch, Checkbox, Radio Group, Toggle, Slider, and Accordion own
keyboard behaviour, focus, and ARIA state, while Atlas component tokens own all
visual styling. Native buttons and inputs remain native where Radix does not
provide a corresponding primitive.

Shared anatomy is implemented through variants. Loading must preserve control
dimensions. Errors explain recovery. Pending or stale operational data must be
named in text, not communicated by colour alone. Destructive actions require
review, and duplicate charging/payment commands must be prevented while the
original request is unresolved.

Controlled values are identified by the presence of their value prop; callback
presence never changes state ownership. Modal sheets trap focus, restore the
invoker on close, and expose dialog semantics. Unknown telemetry is withheld;
stale or delayed telemetry is explicitly labelled as last reported. Interactive
targets retain a 44px minimum and layouts must tolerate long translations, RTL,
200% text sizing, forced colours, and narrow mobile viewports.

The playground exposes all 61 catalogue entries even where several entries
share a reusable implementation family. Dark mode is a first-class mode across
the same component hierarchy.
