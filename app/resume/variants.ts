// Resolves the per-audience variants declared in source.ts.
// Shared by page.tsx (web) and scripts/resume-latex.mjs (PDF).

export type Audience = 'web' | 'pdf'

type WithVariants = { pdf?: object | false; web?: object | false }

type Resolved<T> = Omit<T, 'pdf' | 'web'>

/** Returns the item as seen by `audience`, or null if it is hidden there. */
export function resolve<T extends WithVariants>(item: T, audience: Audience): Resolved<T> | null {
  const override = item[audience]
  if (override === false) return null
  const { pdf: _pdf, web: _web, ...shared } = item
  return { ...shared, ...(override ?? {}) } as Resolved<T>
}

/** Resolves every item in a list and drops the hidden ones. */
export function resolveAll<T extends WithVariants>(items: T[], audience: Audience): Resolved<T>[] {
  return items.map((item) => resolve(item, audience)).filter((item): item is Resolved<T> => item !== null)
}
