import DiveExperience from '@/components/dive/dive-experience'
import { buildDiveMap } from '@/lib/dive-map'

export const metadata = {
  title: 'Dive',
  description: 'A 3D map of everything on this blog. Posts that share ideas drift together.',
}

export default async function DivePage() {
  const map = await buildDiveMap()
  return <DiveExperience map={map} />
}
