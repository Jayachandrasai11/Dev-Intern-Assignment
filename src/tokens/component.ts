import type { TokenAlias, TokenDef, TokenLayerDef } from './types';

/**
 * Layer 3 — component tokens. Every themeable slot of every component is a
 * token here, back-referencing the brand layer (component → brand →
 * primitive):
 *
 *   - color slots alias semantic tokens (accent/gray/status/color roles)
 *   - radius and type sizes alias the brand-tier roles (radius.interactive,
 *     text.body, …), which themselves alias global primitives
 *   - raw numbers appear only for component-intrinsic dimensions (heights,
 *     paddings, icon sizes) that have no meaningful brand-tier role; they
 *     still scale with the brand via the emitted --ev-scaling calc
 *
 * Component CSS consumes these vars (plus the semantic status/color roles
 * and structural primitives like spacing and weights) — never raw color
 * scales. `css-contract.test.ts` enforces that.
 */

const s = (path: string): TokenAlias => ({ layer: 'semantic', path });
const g = (path: string): TokenAlias => ({ layer: 'global', path });

const color = (path: string, alias: TokenAlias): TokenDef => ({
  path,
  type: 'color',
  alias,
});
const dim = (path: string, value: number): TokenDef => ({
  path,
  type: 'dimension',
  value,
});
const dimAlias = (path: string, alias: TokenAlias): TokenDef => ({
  path,
  type: 'dimension',
  alias,
});

export const COMPONENT_TOKENS: TokenLayerDef = {
  layer: 'component',
  tokens: [
    // ============ Button ============
    dimAlias('button.radius', s('radius.interactive')),
    dim('button.height-sm', 28),
    dim('button.height-md', 36),
    dim('button.height-lg', 44),
    dim('button.px-sm', 10),
    dim('button.px-md', 14),
    dim('button.px-lg', 18),
    dimAlias('button.font-sm', s('text.caption')),
    dimAlias('button.font-md', s('text.label')),
    dimAlias('button.font-lg', s('text.title')),
    color('button.solid.bg', s('accent.9')),
    color('button.solid.bg-hover', s('accent.10')),
    color('button.solid.text', s('accent.contrast')),
    color('button.soft.bg', s('accent.a3')),
    color('button.soft.bg-hover', s('accent.a4')),
    color('button.soft.text', s('accent.11')),
    color('button.outline.border', s('accent.8')),
    color('button.outline.text', s('accent.11')),
    color('button.outline.bg-hover', s('accent.a2')),
    color('button.ghost.text', s('accent.11')),
    color('button.ghost.bg-hover', s('accent.a3')),

    // ============ Motion (transitions alias brand motion roles; loop
    // durations are component-intrinsic literals, like heights) ============
    {
      path: 'button.transition-duration',
      type: 'duration',
      alias: s('motion.interaction.duration'),
    },
    {
      path: 'button.transition-easing',
      type: 'string',
      alias: s('motion.interaction.easing'),
    },
    {
      path: 'switch.transition-duration',
      type: 'duration',
      alias: s('motion.interaction.duration'),
    },
    {
      path: 'switch.transition-easing',
      type: 'string',
      alias: s('motion.interaction.easing'),
    },
    {
      path: 'input.transition-duration',
      type: 'duration',
      alias: s('motion.interaction.duration'),
    },
    {
      path: 'input.transition-easing',
      type: 'string',
      alias: s('motion.interaction.easing'),
    },
    {
      path: 'chip.transition-duration',
      type: 'duration',
      alias: s('motion.interaction.duration'),
    },
    {
      path: 'chip.transition-easing',
      type: 'string',
      alias: s('motion.interaction.easing'),
    },
    {
      path: 'card.transition-duration',
      type: 'duration',
      alias: s('motion.interaction.duration'),
    },
    {
      path: 'card.transition-easing',
      type: 'string',
      alias: s('motion.interaction.easing'),
    },
    {
      path: 'pin.transition-duration',
      type: 'duration',
      alias: s('motion.emphasis.duration'),
    },
    {
      path: 'pin.transition-easing',
      type: 'string',
      alias: s('motion.emphasis.easing'),
    },
    {
      path: 'battery-bar.transition-duration',
      type: 'duration',
      alias: s('motion.progress.duration'),
    },
    {
      path: 'battery-bar.transition-easing',
      type: 'string',
      alias: s('motion.progress.easing'),
    },
    {
      path: 'ring.transition-duration',
      type: 'duration',
      alias: s('motion.progress.duration'),
    },
    {
      path: 'ring.transition-easing',
      type: 'string',
      alias: s('motion.progress.easing'),
    },
    {
      path: 'sheet.enter-duration',
      type: 'duration',
      alias: s('motion.entrance.duration'),
    },
    {
      path: 'sheet.enter-easing',
      type: 'string',
      alias: s('motion.entrance.easing'),
    },
    {
      path: 'spinner.spin-duration',
      type: 'duration',
      description: 'Loop period — component-intrinsic',
      value: '700ms',
    },
    {
      path: 'badge.pulse-duration',
      type: 'duration',
      description: 'Charging dot pulse loop',
      value: '1600ms',
    },
    {
      path: 'battery-bar.stripe-duration',
      type: 'duration',
      description: 'Charging stripe loop',
      value: '1200ms',
    },
    {
      path: 'ring.pulse-duration',
      type: 'duration',
      description: 'Live SOC ring pulse loop',
      value: '2000ms',
    },

    // ============ Alert ============
    dimAlias('alert.radius', s('radius.interactive')),
    dim('alert.padding', 12),
    dimAlias('alert.title-font', s('text.label')),
    dimAlias('alert.body-font', s('text.body')),

    // ============ Toast ============
    dimAlias('toast.radius', s('radius.interactive')),
    dimAlias('toast.font', s('text.body')),
    color('toast.bg', s('gray.12')),
    color('toast.text', s('gray.1')),
    color('toast.text-secondary', s('gray.8')),
    {
      path: 'toast.enter-duration',
      type: 'duration',
      alias: s('motion.swap.duration'),
    },
    {
      path: 'toast.enter-easing',
      type: 'string',
      alias: s('motion.swap.easing'),
    },

    // ============ BottomSheet ============
    dimAlias('bottom-sheet.radius', s('radius.overlay')),
    color('bottom-sheet.bg', s('color.bg')),
    color('bottom-sheet.handle', s('gray.6')),
    {
      path: 'bottom-sheet.enter-duration',
      type: 'duration',
      alias: s('motion.entrance.duration'),
    },
    {
      path: 'bottom-sheet.enter-easing',
      type: 'string',
      alias: s('motion.entrance.easing'),
    },

    // ============ StatusBadge ============
    dimAlias('badge.radius', s('radius.small')),
    dimAlias('badge.font', s('text.caption')),
    dim('badge.dot-size', 8),

    // ============ Tag ============
    dimAlias('tag.radius', s('radius.small')),
    dimAlias('tag.font', s('text.caption')),
    color('tag.neutral.bg', s('gray.a3')),
    color('tag.neutral.text', s('gray.11')),
    color('tag.accent.bg', s('accent.a3')),
    color('tag.accent.text', s('accent.11')),

    // ============ ConnectorIcon ============
    color('connector.color', s('gray.12')),
    color('connector.muted-color', s('gray.8')),

    // ============ PowerText ============
    dimAlias('power.font', s('text.body')),
    color('power.bolt-color', s('accent.9')),
    color('power.value-color', s('gray.12')),
    color('power.unit-color', s('gray.11')),

    // ============ PriceText ============
    dimAlias('price.font', s('text.body')),
    color('price.color', s('gray.12')),
    color('price.unit-color', s('gray.11')),
    color('price.free-color', s('status.available-text')),

    // ============ BatteryGlyph ============
    color('battery.ok-color', s('status.available')),
    color('battery.low-color', s('status.faulted')),
    color('battery.charging-color', s('status.charging')),
    color('battery.shell-color', s('gray.8')),

    // ============ Input ============
    dim('input.height', 36),
    dimAlias('input.radius', s('radius.small')),
    dimAlias('input.font', s('text.body')),
    color('input.bg', s('color.surface')),
    color('input.border', s('color.border')),
    color('input.border-focus', s('accent.8')),
    color('input.ring-focus', s('accent.a4')),
    color('input.error-border', s('status.faulted')),
    color('input.error-ring', s('status.faulted-bg')),
    color('input.text', s('color.text')),
    color('input.placeholder', s('gray.9')),

    // ============ Switch ============
    dim('switch.width', 38),
    dim('switch.height', 22),
    dim('switch.thumb-size', 18),
    color('switch.track-bg', s('gray.5')),
    color('switch.track-bg-checked', s('accent.9')),
    {
      path: 'switch.thumb-bg',
      type: 'color',
      description: 'Deliberate constant: thumb stays white in both modes',
      value: '#ffffff',
    },

    // ============ Spinner ============
    color('spinner.track-color', s('gray.a5')),

    // ============ ConnectorChip ============
    dim('chip.gap', 6),
    dimAlias('chip.radius', s('radius.interactive')),
    dimAlias('chip.font', s('text.caption')),
    color('chip.bg', s('color.surface')),
    color('chip.border', s('color.border')),
    color('chip.selected-border', s('accent.9')),
    color('chip.selected-bg', s('accent.a2')),
    color('chip.row-bg', s('color.panel')),

    // ============ Card (StationListCard + shared card surfaces) ============
    dimAlias('card.padding', g('space.4')),
    dimAlias('card.radius', s('radius.container')),
    dimAlias('card.name-font', s('text.title')),
    dimAlias('card.meta-font', s('text.caption')),
    color('card.bg', s('color.panel')),
    color('card.border', s('gray.a4')),
    color('card.selected-border', s('accent.9')),

    // ============ MapPin ============
    dim('pin.size', 36),
    color('pin.stroke', s('color.bg')),
    color('pin.count-bg', s('color.bg')),
    color('pin.cluster.bg', s('accent.9')),
    color('pin.cluster.text', s('accent.contrast')),
    color('pin.cluster.halo', s('accent.a4')),

    // ============ FilterChip ============
    dim('filter-chip.height', 32),
    dimAlias('filter-chip.radius', s('radius.interactive')),
    dimAlias('filter-chip.font', s('text.body')),
    color('filter-chip.bg', s('color.surface')),
    color('filter-chip.bg-hover', s('gray.a3')),
    color('filter-chip.border', s('color.border')),
    color('filter-chip.text', s('gray.12')),
    color('filter-chip.active.bg', s('gray.12')),
    color('filter-chip.active.text', s('gray.1')),
    color('filter-chip.count.bg', s('accent.9')),
    color('filter-chip.count.text', s('accent.contrast')),

    // ============ SessionStat ============
    color('stat.label-color', s('gray.11')),
    color('stat.value-color', s('gray.12')),
    color('stat.row-border', s('gray.a4')),
    color('stat.tile.bg', s('color.surface')),
    dimAlias('stat.tile.radius', s('radius.container')),
    dimAlias('stat.tile.value-font', s('text.heading')),

    // ============ BatteryProgressBar ============
    dim('battery-bar.height', 10),
    color('battery-bar.track-bg', s('gray.4')),
    color('battery-bar.fill', s('status.available')),
    color('battery-bar.fill-charging', s('status.charging')),
    color('battery-bar.limit-color', s('gray.12')),

    // ============ PricingTable ============
    dim('table.cell-py', 10),
    dim('table.cell-px', 12),
    dimAlias('table.radius', s('radius.container')),
    color('table.bg', s('color.panel')),
    color('table.header-bg', s('color.surface')),
    color('table.header-text', s('gray.11')),
    color('table.border', s('color.border')),
    color('table.row-border', s('gray.a4')),
    color('table.member-text', s('accent.11')),
    color('table.idle-bg', s('status.occupied-bg')),
    color('table.idle-text', s('status.occupied-text')),

    // ============ PaymentMethodRow ============
    dimAlias('payment.radius', s('radius.container')),
    color('payment.bg', s('color.panel')),
    color('payment.border', s('gray.a4')),
    color('payment.mark-bg', s('gray.12')),
    color('payment.mark-text', s('gray.1')),
    color('payment.add-border', s('color.border-strong')),
    color('payment.add-icon-bg', s('accent.a3')),
    color('payment.add-icon-text', s('accent.11')),

    // ============ StationDetailSheet ============
    dim('sheet.width', 420),
    dimAlias('sheet.title-font', s('text.heading')),
    color('sheet.bg', s('color.bg')),
    color('sheet.overlay', s('color.overlay')),
    color('sheet.section-title-color', s('gray.11')),
    color('sheet.close-bg', s('gray.a3')),
    color('sheet.close-bg-hover', s('gray.a4')),
    color('sheet.close-text', s('gray.11')),

    // ============ ActiveChargingSession ring ============
    dim('ring.size', 200),
    dim('ring.thickness', 12),
    dimAlias('ring.soc-font', s('text.display')),
    color('ring.track', s('gray.4')),
    color('ring.progress', s('status.charging')),
    color('ring.suspended', s('status.occupied')),
    color('ring.finishing', s('status.available')),
    color('ring.kw-color', s('accent.11')),

    // ============ ActiveChargingSession chrome ============
    color('session.warn-bg', s('status.occupied-bg')),
    color('session.warn-text', s('status.occupied-text')),
    color('session.note-bg', s('color.surface')),

    // ============ StartChargeStepper ============
    dim('stepper.dot-size', 26),
    dimAlias('stepper.label-font', s('text.caption')),
    color('stepper.dot-bg', s('gray.4')),
    color('stepper.dot-text', s('gray.11')),
    color('stepper.dot-active-bg', s('accent.9')),
    color('stepper.dot-active-text', s('accent.contrast')),
    color('stepper.dot-halo', s('accent.a4')),
    color('stepper.rail', s('gray.5')),
    color('stepper.rail-done', s('accent.9')),
    color('stepper.dot-failed-bg', s('status.faulted')),
    color('stepper.dot-failed-text', s('status.faulted-contrast')),

    // ============ AppHeader ============
    dim('header.py', 14),
    dim('header.px', 16),
    dimAlias('header.title-font', s('text.title')),
    dimAlias('header.subtitle-font', s('text.caption')),
    color('header.bg', s('color.bg')),
    color('header.border', s('gray.a4')),
    color('header.title-color', s('color.text')),
    color('header.subtitle-color', s('color.text-secondary')),
    color('header.back-color', s('color.text')),
    color('header.back-bg-hover', s('gray.a3')),

    // ============ BottomNavBar ============
    dim('nav.height', 60),
    dimAlias('nav.label-font', s('text.caption')),
    color('nav.bg', s('color.panel')),
    color('nav.border', s('gray.a4')),
    color('nav.item-color', s('gray.11')),
    color('nav.item-active-color', s('accent.11')),
    color('nav.badge-bg', s('status.faulted')),
    dim('nav.center-size', 52),
    color('nav.center.bg', s('accent.9')),
    color('nav.center.text', s('accent.contrast')),
    color('nav.center.halo', s('accent.a4')),
    {
      path: 'nav.transition-duration',
      type: 'duration',
      alias: s('motion.interaction.duration'),
    },
    {
      path: 'nav.transition-easing',
      type: 'string',
      alias: s('motion.interaction.easing'),
    },

    // ============ ListRow ============
    dim('list-row.min-height', 52),
    dimAlias('list-row.radius', s('radius.container')),
    dimAlias('list-row.label-font', s('text.label')),
    dimAlias('list-row.desc-font', s('text.caption')),
    color('list-row.bg', s('color.panel')),
    color('list-row.bg-hover', s('gray.a2')),
    color('list-row.border', s('gray.a4')),
    color('list-row.icon-color', s('gray.11')),
    color('list-row.icon-bg', s('gray.a3')),
    color('list-row.chevron-color', s('gray.9')),
    color('list-row.destructive-color', s('status.faulted-text')),

    // ============ SegmentedControl ============
    dim('segmented.height', 36),
    dimAlias('segmented.radius', s('radius.interactive')),
    dimAlias('segmented.font', s('text.body')),
    color('segmented.bg', s('gray.a3')),
    color('segmented.text', s('gray.11')),
    color('segmented.active-text', s('gray.12')),
    color('segmented.thumb-bg', s('color.panel')),
    {
      path: 'segmented.transition-duration',
      type: 'duration',
      alias: s('motion.swap.duration'),
    },
    {
      path: 'segmented.transition-easing',
      type: 'string',
      alias: s('motion.swap.easing'),
    },

    // ============ CodeInput (color slots reuse input.* vars) ============
    dim('code-input.cell-width', 42),
    dim('code-input.cell-height', 52),
    dimAlias('code-input.radius', s('radius.small')),
    dimAlias('code-input.font', s('text.heading')),

    // ============ FreshnessIndicator ============
    dimAlias('freshness.font', s('text.caption')),
    color('freshness.fresh-color', s('gray.11')),
    color('freshness.stale-color', s('status.occupied-text')),
    color('freshness.unknown-color', s('status.unknown-text')),

    // ============ Skeleton ============
    dimAlias('skeleton.radius', s('radius.small')),
    color('skeleton.base', s('gray.a3')),
    color('skeleton.highlight', s('gray.a2')),
    {
      path: 'skeleton.shimmer-duration',
      type: 'duration',
      description: 'Shimmer loop period — component-intrinsic',
      value: '1400ms',
    },

    // ============ EmptyState ============
    dimAlias('empty.title-font', s('text.title')),
    dimAlias('empty.body-font', s('text.body')),
    color('empty.icon-color', s('gray.8')),
    color('empty.icon-bg', s('gray.a3')),
    color('empty.title-color', s('color.text')),
    color('empty.body-color', s('color.text-secondary')),

    // ============ ChargerStatusRow ============
    color('charger-row.bg', s('color.panel')),
    color('charger-row.border', s('gray.a4')),
    dimAlias('charger-row.code-font', s('text.caption')),
    color('charger-row.code-bg', s('gray.a3')),
    color('charger-row.code-color', s('gray.12')),

    // ============ ActiveSessionCard ============
    dimAlias('session-card.radius', s('radius.container')),
    color('session-card.bg', s('accent.a2')),
    color('session-card.border', s('accent.a5')),
    color('session-card.title-color', s('color.text')),
    color('session-card.meta-color', s('color.text-secondary')),

    // ============ DurationSelector ============
    dim('duration.chip-height', 40),
    dimAlias('duration.radius', s('radius.interactive')),
    dimAlias('duration.font', s('text.body')),
    color('duration.bg', s('color.surface')),
    color('duration.border', s('color.border')),
    color('duration.text', s('gray.12')),
    color('duration.selected-bg', s('accent.9')),
    color('duration.selected-text', s('accent.contrast')),
    color('duration.helper-color', s('color.text-secondary')),

    // ============ WalletBalanceCard ============
    dimAlias('wallet.radius', s('radius.container')),
    dimAlias('wallet.balance-font', s('text.heading')),
    color('wallet.bg', s('color.panel')),
    color('wallet.border', s('gray.a4')),
    color('wallet.balance-color', s('color.text')),
    color('wallet.label-color', s('gray.11')),
    color('wallet.note-bg', s('color.surface')),
    color('wallet.note-color', s('color.text-secondary')),

    // ============ LineItemList ============
    dimAlias('line-item.font', s('text.body')),
    dimAlias('line-item.total-font', s('text.title')),
    dimAlias('line-item.meta-font', s('text.caption')),
    color('line-item.label-color', s('gray.11')),
    color('line-item.value-color', s('gray.12')),
    color('line-item.divider', s('gray.a4')),
    color('line-item.meta-color', s('gray.9')),

    // ============ SupportContextCard ============
    dimAlias('support.radius', s('radius.container')),
    color('support.bg', s('color.surface')),
    color('support.border', s('color.border')),
    color('support.title-color', s('color.text')),
    color('support.context-label-color', s('gray.11')),
    color('support.context-value-color', s('gray.12')),

    // ============ ScannerFrame ============
    dim('scanner.frame-size', 220),
    dimAlias('scanner.radius', s('radius.container')),
    {
      path: 'scanner.backdrop',
      type: 'color',
      description: 'Deliberate constant: camera backdrop stays dark in both modes',
      value: '#101012',
    },
    {
      path: 'scanner.on-backdrop',
      type: 'color',
      description: 'Deliberate constant: text/controls over the dark camera backdrop',
      value: '#f5f5f6',
    },
    {
      path: 'scanner.control-bg',
      type: 'color',
      description: 'Deliberate constant: translucent controls over the dark backdrop',
      value: 'rgba(255, 255, 255, 0.16)',
    },
    color('scanner.bracket-color', s('accent.9')),
    color('scanner.bracket-success', s('status.available')),
    color('scanner.bracket-error', s('status.faulted')),
    color('scanner.line-color', s('accent.a8')),
    {
      path: 'scanner.scan-duration',
      type: 'duration',
      description: 'Scan-line sweep loop — component-intrinsic',
      value: '2200ms',
    },
  ],
};
