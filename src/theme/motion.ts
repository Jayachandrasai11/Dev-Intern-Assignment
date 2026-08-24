import type { Transition } from 'motion/react';
import { resolveTokenValue } from '../tokens/emit';
import type { TokenLayerDef } from '../tokens/types';

/**
 * Bridges the motion token tier to Motion for React: the same
 * duration/easing tokens that drive CSS transitions feed Motion's
 * `transition` objects, so JS-driven choreography (enter/exit/layout via
 * AnimatePresence) stays on-token. See motion.dev/docs/radix for the Radix
 * integration pattern (asChild + forceMount) used by the organisms.
 */

export type MotionRole = 'interaction' | 'entrance' | 'exit' | 'progress' | 'emphasis' | 'swap';

export function parseCubicBezier(value: string): [number, number, number, number] | undefined {
  const m = /cubic-bezier\(\s*([\d.-]+)\s*,\s*([\d.-]+)\s*,\s*([\d.-]+)\s*,\s*([\d.-]+)\s*\)/.exec(
    value,
  );
  if (!m) return undefined;
  return [Number(m[1]), Number(m[2]), Number(m[3]), Number(m[4])];
}

export function parseSeconds(value: string): number {
  const ms = /^([\d.]+)ms$/.exec(value.trim());
  if (ms) return Number(ms[1]) / 1000;
  const s = /^([\d.]+)s$/.exec(value.trim());
  if (s) return Number(s[1]);
  return 0.2;
}

/** Resolve a brand-tier motion role to a Motion transition. */
export function motionTransition(
  layers: TokenLayerDef[],
  role: MotionRole,
): Transition {
  const semantic = layers.find((l) => l.layer === 'semantic');
  const find = (path: string) => semantic?.tokens.find((t) => t.path === path);
  const durationDef = find(`motion.${role}.duration`);
  const easingDef = find(`motion.${role}.easing`);
  const duration = durationDef
    ? parseSeconds(String(resolveTokenValue(durationDef, layers, 'light')))
    : 0.2;
  const ease = easingDef
    ? parseCubicBezier(String(resolveTokenValue(easingDef, layers, 'light')))
    : undefined;
  return ease ? { duration, ease } : { duration };
}

/**
 * Context-free variant for components: reads the emitted CSS variables off
 * the document root, so it stays live-themed without requiring the
 * ThemeProvider context (and falls back safely under SSR).
 */
export function cssMotionTransition(role: MotionRole): Transition {
  if (typeof document === 'undefined') return { duration: 0.2 };
  const cs = getComputedStyle(document.documentElement);
  const d = cs.getPropertyValue(`--ev-motion-${role}-duration`).trim();
  const e = cs.getPropertyValue(`--ev-motion-${role}-easing`).trim();
  const duration = d ? parseSeconds(d) : 0.2;
  const ease = e ? parseCubicBezier(e) : undefined;
  return ease ? { duration, ease } : { duration };
}
