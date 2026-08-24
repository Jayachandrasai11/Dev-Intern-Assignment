# Figma sync — agent-run flow

Pushes composed screens from Prism UI Composer (Volt library) into the Figma library file as
frames of component instances. In-product plugin sync is post-MVP; this flow
runs through Claude Code with the Figma MCP connected.

## 1. Export the sync JSON

In the composer (`/composer`), the Export dialog downloads
`volt-composer-doc.json`. The sync payload is derived from it with
`docToFigmaSync()` (`src/composer/figmaMap.ts`), which translates every
component to the Figma library vocabulary:

- `component` — component-set name on its page (e.g. `StatusBadge`)
- `variant` — exact `Prop=Value` pairs (`Form=Pill, Status=In use`)
- `textProps` / `booleanProps` — component properties (`Label`, `Loading`)
- `frame` nodes — Stack/Row/Spacer become auto-layout frames (gap/padding)
- `notes` — lossy mappings (e.g. chip statuses missing from the Figma set)

## 2. Ask Claude to sync

Prompt, with the JSON attached or pasted:

> Sync these composed screens into the Volt DS Figma file
> (2iFEHdVzaAcYO1RhNS44Ne) using the figma-use skill. Create or reuse a page
> named "🧩 Composed Screens". For each screen: a vertical auto-layout frame
> (width from the payload, fill bound to semantic color/bg), then append
> children in order — `instance` nodes as instances of the named local
> component set with `setProperties` from variant/textProps/booleanProps,
> `frame` nodes as nested auto-layout frames, `text` header nodes as
> Volt/Title text. Surface any `notes` back to me.

Component sets live one per page (state ledger
`scratchpad/dsb-state-volt-001.json` has node IDs; name lookup also works).

## 3. Known gaps

- ConnectorChip in Figma covers 4 statuses; MapPin has no Coming-soon (nor
  Maintenance/Unknown) — the mapper substitutes and records a `notes` entry.
- PricingTable/StationListCard fixtures are static in Figma; text overrides
  beyond registered component properties are not synced.
- StartChargeStepper's parameterized rail (handshake labels, failed state)
  is code-only — the Figma set keeps the default Step=1–4 vocabulary and the
  mapper records a `notes` entry.
- SegmentedControl in Figma covers Options=2–4; other counts are clamped
  with a `notes` entry.

2026-07-13 sync (Atlas R1): StatusBadge extended to the 9-status vocabulary
(Under maintenance, Status unknown), Alert gained Tone=Guidance, and 17 new
component sets were built (FreshnessIndicator, PaymentStatusTag, Skeleton,
CodeInput, AppHeader, ListRow, SegmentedControl, LocationStatusCard,
ChargerStatusRow, EmptyState, ActiveSessionCard, DurationSelector,
WalletBalanceCard, LineItemList, SupportContextCard, BottomNavBar,
ScannerFrame) — one page per component with doc cards, ~121 new variables
(8 semantic status slots + 113 component tokens), all bound through the
component → semantic → primitive chain. ScreenHeader entries now sync as
AppHeader instances.

## Motion re-sync

Figma's animation API does not support binding keyframe timings to
variables (probed 2026-07-09: keyframe values reject VARIABLE_ALIAS). The
wiring contract instead: motion variables are the source of truth, and a
sync step reads them and re-applies keyframe timings. Animated nodes carry
sharedPluginData (`dsb/motionToken`, `dsb/motionSyncedMs`) recording which
Component-collection variable drives them:

- Spinner arcs (13:7, 13:10, 13:13) ← `spinner/spin-duration`
- Charging StatusBadge dots (15:8, 15:23, 15:45) ← `badge/pulse-duration`
- SOC ring progress (31:16) ← `ring/pulse-duration`
- Toast content layers (108:3/7/13/19) ← `motion/swap/duration`
- BottomSheet sheet layers (in set 109:44) ← `motion/entrance/duration`
  (iOS curve cubic-bezier(0.32, 0.72, 0, 1) baked into the keyframe easing)

To re-sync after changing a motion variable, ask Claude: "re-sync Figma
motion keyframes from the motion variables" — the script in this repo's
history (or the tagged nodes) makes it a one-call operation.

## Native Easing/Timing variable types (pending API support)

Figma's UI now offers native **Easing** (curve) and **Timing** (duration)
variable types, but as of 2026-07-10 the Plugin API cannot create, read, or
bind them: `createVariable` accepts only BOOLEAN|COLOR|FLOAT|STRING, and
UI-created native motion variables are invisible to
`getLocalVariablesAsync` (collection reports 49 while the UI shows 51 with
two manual samples). All 48 motion variables in the library therefore use
NUMBER-ms (durations) and STRING-cubic-bezier (easings), each annotated with
a migration note in its description. When the API exposes the native types:
create native twins, rebind the semantic/component alias chain (all motion
variables carry `dsb` provenance), and delete the legacy ones — mechanical,
one script.

## Atlas Web library (2026-07-15)

The atlas-web pack was synced to its own Figma file:
**Atlas design system — fileKey `3mcHdK5Px1O9D61Lr1cD8z`** (run `dsb-atlas-001`).

- 320 variables in the volt-style three-collection architecture: Primitives
  (131, Light/Dark — the literal production ramps; neutral mirrors in dark,
  fixed/* identity colors are mode-invariant), Semantic (102, Light/Dark —
  generated from the default Atlas preset #ff5310, incl. the 16 status slots),
  Component (87, Default — aliased through semantic/primitives). Every
  variable carries `var(--ev-*)` WEB code syntax and explicit scopes.
- 16 text styles (heading/2xs–5xl, body/xs–xl, label/m) and 5 shadow effect
  styles. PP Neue Montreal is not installed in the Figma environment — styles
  render in Inter and carry a migration note; swap the family once PPNM is
  installed.
- Pages: Cover · Getting Started · Foundations (Color with Light/Dark
  semantic panels, Typography, Spacing & Radius, Elevation, Icons) · 23
  component pages covering the full 30-block catalog (13 icon components +
  Button 12v, LinkCta 9v, Chip 12v, Field 7v, Checkbox/Radio/Toggle,
  Heading 10v, Text 15v, 9 molecules, 8 organisms incl. SiteHeader 2v,
  MastheadBanner 3v, CtaSection 2v).
- Known gaps: gradient fills (masthead/model-card/locator media) bake the token
  values — Figma cannot bind variables to gradient stops; color-mix literals
  (masthead/play-icon, footer/link-hover) are STRING variables applied as
  resolved values; component motion is CSS-only in atlas (no keyframe sync).
- Documentation (2026-07-15, second pass): every component page carries a
  "📖 Docs" card above the component set — white card/bg with card/border +
  shadow/2 so it reads against the canvas — description, the code props
  interface, the driving tokens with their alias chains, and usage notes
  (e.g. the radius-full pill opt-in, the CTA-band inverse button rationale,
  mode-invariant identity surfaces).
- The composer's atlas `figma` pack is still `null`: writing the per-component
  MAPPERS (atlas figmaMap) to enable composed-screen sync into this file is
  follow-up work.

## Lever collections (2026-07-16, P2 — ds-test-b4w)

Four lever collections were added during the original feasibility work; IDs in
`scripts/figma-atlas-levers.json`. Values come from the code-side lever model
(`src/libraries/atlas-web/tokens/levers.ts`, dumped via
`scripts/dump-levers.ts`) — regenerate + rewrite values there, never hand-edit.

- `10 Lever · Accent` (Atlas / Atlas Cyan / Atlas Ink) — 52 appearance-twin vars
  (`accent/light/*`, `accent/dark/*`); Ink twins split per `darkAccentHex`.
- `11 Lever · Neutral` (Gray / Slate / Sage / Sand) — 48 gray twin vars.
- `12 Lever · Radius` (Small* / None / Medium / Full) — 4 role vars, baked
  base×factor at 100% scaling; Full pills small+interactive to 9999.
- `13 Lever · Typeface` (Inter* / Poppins / DM Sans) — font/family +
  font/style/{regular,medium,semibold,bold}; 4th mode reserved for
  PP Neue Montreal (ds-test-ggi). Style spellings differ per family.

(*) = mode 0 / collection default, matching the shipped Atlas preset.
`saveVersionHistoryAsync` is not supported in the MCP sandbox — P2 was purely
additive (rollback = delete the four collections); a manual named version was
saved before P3.

## Semantic rewire (2026-07-16, P3 — ds-test-nb8)

All 55 semantic lever slots now hold **per-mode alias forks**: accent/gray
ramps → Light `*/light/N` / Dark `*/dark/N` twins in the lever collections;
radius roles + font/family → mode-independent lever aliases. Verified by an
atomic in-script invariant (189 semantic+component vars resolved in both
appearances before/after — any unexpected drift throws, which rolls the whole
script back; this fired once and caught the radius issue below) plus a live
smoke render of Button under default / Ink / Cyan+Full / Ink+Dark.

- **Radius fidelity fix (deliberate change):** the original sync baked
  UNfactored radius bases (4/8/12/16) — the pack's preset is radius='small'
  (factor 0.75), so code renders 3/6/9/12. The lever's Small default now
  makes the file match code: all radius-bound nodes tightened ×0.75
  (button 8→6, card 12→9, …). 14 resolutions changed, all with this exact
  signature.
- `font/family` resolved value changed from the PPNM CSS stack string to
  `Inter` (the file's actual rendered family; PPNM mode pending ds-test-ggi).
- Appearance flips still involve BOTH Primitives and Semantic Light/Dark
  modes (pre-existing structure — status/identity colors live in Primitives
  L/D). Designers flip two dropdowns for dark mode; consolidation is a
  possible P5+ cleanup.
- Levers are now LIVE for everything bound through semantic slots. P4 closes
  the gaps: unbound radii, unstyled text, text styles → Typeface lever.

## Audit + rebind sweep (2026-07-16, P4 — ds-test-zlf)

Full audit of all 23 component pages (parallel per-page fan-out; instances
excluded). Zero stray primitive color bindings found — color coverage was
already complete. Fixes applied:

- **Typeface reach**: all 16 text styles AND all 218 component text nodes now
  bind `fontFamily`/`fontStyle` to `13 Lever · Typeface`. Node-level binding
  (not style retrofit) was chosen deliberately: component type sizes
  (13/15/17/22/26/28/34px…) mirror production CSS and don't match the
  16-style ramp — binding preserves every size exactly.
- **Radius**: 5 new Component tokens (`checkbox/radius`,
  `advantage-card/icon-radius`, `carousel/slide-radius`, `spec-table/radius`,
  `locator/map-radius` — VariableID:50:2..50:6) aliasing semantic roles,
  bound on the 6 previously-unbound container corners.
- **Lever-inert provenance** (`sharedPluginData dsb/leverInert`): 5 gradient
  fills (masthead media, carousel slide, model-card media, locator map — Figma
  cannot bind gradient stops), 6 always-circles (radio dot, play disc,
  carousel nav, icon discs), 25 production pills (chips, toggles, status
  chips, eyebrows, social buttons — pill by Atlas design, radius-lever exempt
  like code's hardcoded 999s).
- Smoke-verified: DealerCard + Button retype under Poppins/DM Sans modes and
  compose with Ink accent + Full radius; status chip green stays pinned.

## Verification + docs (2026-07-16, P5 — ds-test-f3b) — migration COMPLETE

- **Value matrix check**: 61/61 semantic resolutions through the full fork
  chain match the code-generated lever values exactly (every accent ×
  appearance, neutral × appearance, radius mode, typeface mode).
- **🎛️ Lever Matrix page** (53:2, after Getting Started): persistent live
  grid — identical Button + Chip instances per cell, only frame modes differ.
  Rows: Accent ×3, Neutral ×4, Radius ×4, Typeface ×3, Appearance ×2. Cell
  chrome is bound to semantic surface/border/text so cells respond to the
  Neutral and Appearance levers too.
- **Getting Started**: new `card/levers` (54:2) documents the four
  collections, the preset-as-recipe limitation, inert nodes, and points to
  the matrix page; the modes/presets/typeface cards were rewritten for the
  post-lever reality. Gradient lever-inert notes appended to the MastheadBanner,
  BannerCarousel, ModelCard, DealerLocatorSection doc cards.
- **Publish is manual**: the Plugin API cannot publish libraries — publish
  the update from Figma (Assets → Library → Publish). Everything else is done.
- Remaining seam: PP Neue Montreal shared-font upload (ds-test-ggi) → add the
  4th Typeface mode, set as default.
