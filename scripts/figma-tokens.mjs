// Builds Figma-variable payloads (per collection) from the DTCG exports +
// @radix-ui/colors dark scales. Output: compact JSON files in the out dir,
// ready to embed into use_figma scripts.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import * as RC from '@radix-ui/colors';

const outDir = process.argv[2] ?? '.';
const read = (f) => JSON.parse(readFileSync(join(outDir, f), 'utf8'));

const prim = read('primitives.value.tokens.json');
const semLight = read('semantic.light.tokens.json');
const semDark = read('semantic.dark.tokens.json');
const comp = read('component.default.tokens.json');

// ---------- color parsing → {r,g,b,a} floats ----------
function rgba(str) {
  const s = str.trim();
  let m = /^#([0-9a-f]{6})([0-9a-f]{2})?$/i.exec(s);
  if (m) {
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255);
    const a = m[2] ? parseInt(m[2], 16) / 255 : 1;
    return round({ r, g, b, a });
  }
  m = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/i.exec(s);
  if (m) {
    return round({ r: +m[1] / 255, g: +m[2] / 255, b: +m[3] / 255, a: m[4] !== undefined ? +m[4] : 1 });
  }
  throw new Error(`unparseable color: ${str}`);
}
const round = (c) => Object.fromEntries(Object.entries(c).map(([k, v]) => [k, Math.round(v * 10000) / 10000]));

// ---------- collection A: primitive colors (Light/Dark) ----------
const scaleDefs = [
  ['gray', RC.gray, RC.grayDark], ['green', RC.green, RC.greenDark],
  ['blue', RC.blue, RC.blueDark], ['amber', RC.amber, RC.amberDark],
  ['red', RC.red, RC.redDark],
];
const primColor = [];
for (const [name, light, dark] of scaleDefs) {
  const L = Object.values(light), D = Object.values(dark);
  for (let i = 0; i < 12; i++) {
    primColor.push({ name: `${name}/${i + 1}`, type: 'COLOR', scopes: [],
      code: `var(--ev-${name}-${i + 1})`, light: rgba(L[i]), dark: rgba(D[i]) });
  }
}
const GA = Object.values(RC.grayA), GDA = Object.values(RC.grayDarkA);
for (let i = 0; i < 12; i++) {
  primColor.push({ name: `gray/a${i + 1}`, type: 'COLOR', scopes: [],
    code: `var(--ev-gray-a${i + 1})`, light: rgba(GA[i]), dark: rgba(GDA[i]) });
}

// ---------- walk DTCG tree → flat leaves ----------
function leaves(node, path = []) {
  if (node && typeof node === 'object' && '$value' in node) return [[path.join('/'), node]];
  return Object.entries(node ?? {}).flatMap(([k, v]) =>
    v && typeof v === 'object' ? leaves(v, [...path, k]) : []);
}

// ---------- collection B: primitive dimensions (Value) ----------
const dimScopes = (name) =>
  name.startsWith('radius/') ? ['CORNER_RADIUS']
  : name.startsWith('font-size/') ? ['FONT_SIZE']
  : name.startsWith('line-height/') ? ['LINE_HEIGHT']
  : name.startsWith('font-weight/') ? ['FONT_WEIGHT']
  : ['GAP', 'WIDTH_AND_HEIGHT'];
const primDim = [];
for (const [name, tok] of leaves(prim)) {
  if (tok.$type === 'dimension') primDim.push({ name, type: 'FLOAT', scopes: dimScopes(name),
    code: `var(--ev-${name.replaceAll('/', '-')})`, value: tok.$value.value });
  else if (tok.$type === 'number') primDim.push({ name, type: 'FLOAT', scopes: dimScopes(name),
    code: `var(--ev-${name.replaceAll('/', '-')})`, value: tok.$value });
  else if (tok.$type === 'duration') primDim.push({ name, type: 'FLOAT', scopes: [],
    code: `var(--ev-${name.replaceAll('/', '-')})`, value: tok.$value.value });
  else if (tok.$type === 'string' && name.startsWith('easing/')) primDim.push({ name, type: 'STRING', scopes: [],
    code: `var(--ev-${name.replaceAll('/', '-')})`, value: tok.$value });
}

// ---------- alias helpers ----------
const COLOR_SCALES = /^(gray|green|blue|amber|red)\//;
function aliasTarget(tok) {
  if (typeof tok.$value === 'string' && /^\{[^}]+\}$/.test(tok.$value)) {
    return { collection: 'SELF', name: tok.$value.slice(1, -1).replaceAll('.', '/') };
  }
  const ad = tok.$extensions?.['com.figma']?.aliasData;
  if (ad) {
    const name = ad.targetVariableName;
    const collection = ad.targetVariableSetName === 'Semantic' ? 'SEMANTIC'
      : COLOR_SCALES.test(name) ? 'PRIM_COLOR' : 'PRIM_DIM';
    return { collection, name };
  }
  return null;
}

// ---------- collection C: semantic (Light/Dark) ----------
const SKIP = new Set(['scaling', 'radius-factor', 'radius-full', 'color/panel-blur']);
const semScopes = (name, type) => {
  if (type === 'FLOAT') {
    if (name.startsWith('motion/')) return [];
    return name.startsWith('radius/') ? ['CORNER_RADIUS'] : ['FONT_SIZE'];
  }
  if (type === 'STRING') return [];
  if (/(text|contrast)$|^text\/|^color\/text/.test(name)) return ['TEXT_FILL', 'SHAPE_FILL'];
  if (/border|focus-ring/.test(name)) return ['STROKE_COLOR'];
  if (/-bg$|^color\/(bg|surface|panel|overlay)$/.test(name)) return ['FRAME_FILL', 'SHAPE_FILL'];
  if (/^status\//.test(name)) return ['FRAME_FILL', 'SHAPE_FILL', 'STROKE_COLOR'];
  return ['FRAME_FILL', 'SHAPE_FILL', 'STROKE_COLOR', 'TEXT_FILL'];
};
const darkByName = new Map(leaves(semDark));
const semantic = [];
for (const [name, tok] of leaves(semLight)) {
  if (SKIP.has(name)) continue;
  const alias = aliasTarget(tok);
  const type = tok.$type === 'color' ? 'COLOR'
    : tok.$type === 'dimension' || tok.$type === 'number' || tok.$type === 'duration' ? 'FLOAT' : 'STRING';
  const entry = { name, type, scopes: semScopes(name, type),
    code: `var(--ev-${name.replaceAll('/', '-')})`, desc: tok.$description };
  if (alias) entry.alias = alias;
  else {
    const darkTok = darkByName.get(name);
    if (type === 'COLOR') { entry.light = rgba(colorStr(tok)); entry.dark = rgba(colorStr(darkTok)); }
    else if (type === 'FLOAT') { entry.light = numVal(tok); entry.dark = numVal(darkTok); }
    else { entry.light = String(tok.$value); entry.dark = String(darkTok.$value); }
  }
  semantic.push(entry);
}
function colorStr(tok) {
  return typeof tok.$value === 'string' ? tok.$value : tok.$value.hex && tok.$value.alpha === 1
    ? tok.$value.hex
    : `rgba(${tok.$value.components.map((c) => Math.round(c * 255)).join(', ')}, ${tok.$value.alpha})`;
}
const numVal = (tok) => (typeof tok.$value === 'object' ? tok.$value.value : tok.$value);

// ---------- collection D: component (Value) ----------
const compScopes = (name, type) => {
  if (type === 'FLOAT') {
    if (/-duration$/.test(name)) return [];
    if (/radius$/.test(name)) return ['CORNER_RADIUS'];
    if (/font(-sm|-md|-lg)?$/.test(name)) return ['FONT_SIZE'];
    return ['WIDTH_AND_HEIGHT', 'GAP'];
  }
  if (/border$/.test(name)) return ['STROKE_COLOR'];
  if (/(text|color|placeholder)$/.test(name)) return ['TEXT_FILL', 'SHAPE_FILL'];
  return ['FRAME_FILL', 'SHAPE_FILL', 'STROKE_COLOR'];
};
const component = [];
for (const [name, tok] of leaves(comp)) {
  const alias = aliasTarget(tok);
  const type = tok.$type === 'color' ? 'COLOR' : tok.$type === 'string' ? 'STRING' : 'FLOAT';
  const entry = { name, type, scopes: compScopes(name, type),
    code: `var(--ev-${name.replaceAll('/', '-')})`, desc: tok.$description };
  if (alias) entry.alias = alias;
  else entry.value = type === 'COLOR' ? rgba(colorStr(tok)) : numVal(tok);
  component.push(entry);
}

const out = { primColor, primDim, semantic, component };
for (const [k, v] of Object.entries(out)) {
  writeFileSync(join(outDir, `figma-${k}.json`), JSON.stringify(v));
  console.log(k, v.length, 'vars,', JSON.stringify(v).length, 'bytes');
}

// ---------- compact embeddable format ----------
const hex = (c) => '#' + [c.r, c.g, c.b, c.a].map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
const CODES = { SELF: 0, PRIM_COLOR: 1, PRIM_DIM: 2, SEMANTIC: 3 };
const compact = {
  pc: primColor.map((v) => [v.name, hex(v.light), hex(v.dark)]),
  pd: primDim.map((v) => [v.name, v.value]),
  se: semantic.map((v) => v.alias ? [v.name, 'a', CODES[v.alias.collection], v.alias.name]
    : v.type === 'COLOR' ? [v.name, 'c', hex(v.light), hex(v.dark)]
    : v.type === 'FLOAT' ? [v.name, 'f', v.light, v.dark]
    : [v.name, 's', v.light]),
  co: component.map((v) => v.alias ? [v.name, 'a', CODES[v.alias.collection], v.alias.name]
    : v.type === 'COLOR' ? [v.name, 'c', hex(v.value), hex(v.value)]
    : v.type === 'STRING' ? [v.name, 's', v.value]
    : [v.name, 'f', v.value, v.value]),
};
for (const [k, v] of Object.entries(compact)) {
  writeFileSync(join(outDir, `figma-c-${k}.json`), JSON.stringify(v));
  console.log('compact', k, JSON.stringify(v).length, 'bytes');
}
