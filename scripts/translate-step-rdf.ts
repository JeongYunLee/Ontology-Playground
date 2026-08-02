/**
 * One-shot bulk translator for step-by-step RDF files.
 *
 * Reads every *.rdf file in the six master official ontology
 * directories (which already carry xml:lang="ko" labels/comments),
 * builds an (English → Korean) dictionary keyed on label text and
 * comment text, and then applies those Korean siblings to every
 * matching label/comment in the corresponding *-step-* RDF files.
 *
 * Behaviour is idempotent: if a label already has a ko sibling,
 * it is left untouched. Only labels/comments that appear verbatim
 * in the master dictionary are translated; anything else is left
 * for a manual pass.
 *
 * Usage: npx tsx scripts/translate-step-rdf.ts
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const OFFICIAL_DIR = join(ROOT, 'catalogue', 'official');

/** Master ontology directories whose labels drive the ko dictionary. */
const MASTERS = [
  'cosmic-coffee',
  'ecommerce',
  'finance',
  'healthcare',
  'manufacturing',
  'university',
];

/** Step-family prefixes that should be translated from each master. */
const STEP_PREFIXES = [
  'cosmic-coffee-step-',
  'ecommerce-step-',
  'finance-step-',
  'healthcare-step-',
  'manufacturing-step-',
  'university-step-',
];

interface Dict {
  label: Map<string, string>;
  comment: Map<string, string>;
}

const dict: Dict = { label: new Map(), comment: new Map() };

/**
 * Harvest (English → Korean) pairs from a master RDF file.
 *
 * Pattern: consecutive lines like
 *   <rdfs:label>Customer</rdfs:label>
 *   <rdfs:label xml:lang="ko">고객</rdfs:label>
 */
function harvestFromRdf(xml: string): void {
  const labelPair = /<rdfs:label>([^<]+)<\/rdfs:label>\s*\n\s*<rdfs:label xml:lang="ko">([^<]+)<\/rdfs:label>/g;
  const commentPair = /<rdfs:comment>([^<]+)<\/rdfs:comment>\s*\n\s*<rdfs:comment xml:lang="ko">([^<]+)<\/rdfs:comment>/g;

  let m: RegExpExecArray | null;
  while ((m = labelPair.exec(xml))) {
    dict.label.set(m[1], m[2]);
  }
  while ((m = commentPair.exec(xml))) {
    dict.comment.set(m[1], m[2]);
  }
}

/** Look up the ko translation for exact-match text. */
function translate(kind: 'label' | 'comment', text: string): string | null {
  return dict[kind].get(text) ?? null;
}

/**
 * Apply ko siblings to every rdfs:label / rdfs:comment we can translate,
 * skipping ones that already have a ko sibling.
 *
 * Preserves indentation on the newly inserted line.
 */
function applyKoSiblings(xml: string): { xml: string; labels: number; comments: number } {
  let labelsAdded = 0;
  let commentsAdded = 0;

  // rdfs:label: capture indent + text
  const labelRe = /( *)<rdfs:label>([^<]+)<\/rdfs:label>(\s*(?:<!--[^>]*-->\s*)?)(?!<rdfs:label xml:lang="ko">)/g;
  xml = xml.replace(labelRe, (full, indent: string, text: string, tail: string) => {
    // Already has a ko sibling on the very next line? Skip.
    const nextLineStart = tail.match(/\n(\s*)<rdfs:label xml:lang="ko">/);
    if (nextLineStart) return full;
    const ko = translate('label', text);
    if (!ko) return full;
    labelsAdded++;
    return `${indent}<rdfs:label>${text}</rdfs:label>\n${indent}<rdfs:label xml:lang="ko">${ko}</rdfs:label>${tail}`;
  });

  const commentRe = /( *)<rdfs:comment>([^<]+)<\/rdfs:comment>(\s*(?:<!--[^>]*-->\s*)?)(?!<rdfs:comment xml:lang="ko">)/g;
  xml = xml.replace(commentRe, (full, indent: string, text: string, tail: string) => {
    const nextLineStart = tail.match(/\n(\s*)<rdfs:comment xml:lang="ko">/);
    if (nextLineStart) return full;
    const ko = translate('comment', text);
    if (!ko) return full;
    commentsAdded++;
    return `${indent}<rdfs:comment>${text}</rdfs:comment>\n${indent}<rdfs:comment xml:lang="ko">${ko}</rdfs:comment>${tail}`;
  });

  return { xml, labels: labelsAdded, comments: commentsAdded };
}

// ─── Harvest phase ────────────────────────────────────────────────
for (const master of MASTERS) {
  const dir = join(OFFICIAL_DIR, master);
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.rdf')) continue;
    const xml = readFileSync(join(dir, f), 'utf-8');
    harvestFromRdf(xml);
  }
}
console.log(`Harvested ${dict.label.size} label pairs and ${dict.comment.size} comment pairs from master files.`);

// ─── Apply phase ──────────────────────────────────────────────────
const stepDirs = readdirSync(OFFICIAL_DIR).filter((d) => {
  const full = join(OFFICIAL_DIR, d);
  if (!statSync(full).isDirectory()) return false;
  return STEP_PREFIXES.some((p) => d.startsWith(p));
});

let filesTouched = 0;
let totalLabels = 0;
let totalComments = 0;

for (const stepDir of stepDirs) {
  const dir = join(OFFICIAL_DIR, stepDir);
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.rdf')) continue;
    const path = join(dir, f);
    const before = readFileSync(path, 'utf-8');
    const { xml: after, labels, comments } = applyKoSiblings(before);
    if (after !== before) {
      writeFileSync(path, after, 'utf-8');
      filesTouched++;
      totalLabels += labels;
      totalComments += comments;
      console.log(`  ✔ ${stepDir}/${f}  +${labels} labels  +${comments} comments`);
    } else {
      console.log(`  · ${stepDir}/${f}  no matches`);
    }
  }
}

console.log(
  `\nDone. Touched ${filesTouched} file(s), added ${totalLabels} ko labels and ${totalComments} ko comments.`,
);
