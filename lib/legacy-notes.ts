export const LEGACY_NOTE_SLUGS = [
  'a-philosophy-of-software-design',
  'alistair-croll-lean-analytics-growth-hacking',
  'blindsight-excerpts',
  'david-perell-writing-online',
  'how-technology-is-hijacking-your-mind',
  'permanent-record-excerpts',
  'programming-beyond-practices',
  'staff-engineer',
  'stay-gold',
  'steven-pinker-linguistics-style-writing',
  'the-effective-engineer',
] as const

export type LegacyNoteSlug = (typeof LEGACY_NOTE_SLUGS)[number]
