import type { Config } from '@puckeditor/core';
import type { BrandDefinition } from '../tokens/brand';
import type { LeverSet } from '../tokens/levers';
import type { TokenLayerDef } from '../tokens/types';
import type { ComposerDoc, ViewportKind } from '../composer/schema';
import type { CodegenPack } from '../composer/codegen';
import type { FigmaPack } from '../composer/figmaMap';
import type { SectionDef } from '../playground/Section';

export type { CodegenPack, JsxEmitter } from '../composer/codegen';
export type { FigmaPack } from '../composer/figmaMap';

/**
 * A UI library is a complete, swappable design system: components, token
 * layers, brand presets, and the composer context (registry, codegen, figma
 * mapping, seed screens). Exactly one library is active at a time; the
 * LibraryProvider loads packs on demand via the manifest's dynamic imports.
 *
 * Libraries never import from each other, and shared code never imports from
 * a library — packs are leaves reached only through `LIBRARIES[n].load()`.
 */

export type LibraryId = 'volt' | 'atlas-web' | 'atlas-charge';

export interface LibraryTier {
  id: 'atoms' | 'molecules' | 'organisms';
  title: string;
  blurb: string;
  sections: SectionDef[];
}

export interface UiLibrary {
  id: LibraryId;
  /** Display name — header + switcher dropdown. */
  name: string;
  /** Header subtitle line. */
  tagline: string;
  // ---- tokens ----
  globalTokens: TokenLayerDef;
  componentTokens: TokenLayerDef;
  /** Shared semantic core plus this library's status/domain slots. */
  buildSemantic: (brand: BrandDefinition) => TokenLayerDef;
  presets: BrandDefinition[];
  defaultPreset: BrandDefinition;
  /** Curated Figma lever collections (accent/neutral/radius/typeface modes).
   *  null = library not yet lever-enabled; export shows no lever files. */
  levers: LeverSet | null;
  /** Repo-relative CSS paths for this pack's Vite side-effect imports. */
  cssFiles: string[];
  // ---- playground ----
  tiers: LibraryTier[];
  // ---- composer ----
  composerConfig: Config;
  codegen: CodegenPack;
  /** null = no Figma library mapped; export UI shows a clean empty state. */
  figma: FigmaPack | null;
  seed: () => ComposerDoc;
  defaultViewport: ViewportKind;
}

/** Manifest entry — static and tiny, safe to import eagerly everywhere. */
export interface UiLibraryMeta {
  id: LibraryId;
  name: string;
  load: () => Promise<UiLibrary>;
}
