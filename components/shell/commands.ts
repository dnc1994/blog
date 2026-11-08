// Pure command interpreter for the hidden shell. No React in here, so it is
// easy to extend: add a case to `run` and a line to HELP.

export type ShellPost = {
  n: number // 1 = newest, matches `ls` numbering
  slug: string
  title: string
  date: string
  tags: string[]
}

export type ShellProject = { name: string; url: string }

export type Tone = 'out' | 'dim' | 'hi' | 'warn' | 'ok'
export type Line = { text: string; tone: Tone }

export type Action =
  | { type: 'navigate'; href: string; external?: boolean }
  | { type: 'theme'; theme: 'dark' | 'light' }
  | { type: 'clear' }
  | { type: 'close' }

export type Result = { lines: Line[]; action?: Action }

export type Context = {
  posts: ShellPost[]
  projects: ShellProject[]
  history: string[]
  pathname: string
}

export const COMMANDS = [
  'help', 'ls', 'open', 'cd', 'grep', 'tags', 'whoami', 'cat', 'dive',
  'magi', 'theme', 'fortune', 'history', 'pwd', 'date', 'echo', 'clear',
  'exit', 'sudo', 'rm',
]

const HELP = `navigation
  ls [-a]            latest posts (-a: all of them)
  ls projects        things I built
  open <n|words>     open post n from ls, or the best title match
  grep <words>       search titles and tags
  tags [tag]         topics, or filter posts by one
  cd <page>          about · posts · projects · gallery · curation
  dive               fly through a 3D map of everything I've written

misc
  whoami · cat <file> · fortune · theme [dark|light]
  magi <question>    put it to a vote
  history · clear · exit (or press \` / Esc)`

const PAGES: Record<string, string> = {
  '~': '/', '/': '/', about: '/', home: '/',
  posts: '/posts', writing: '/posts',
  projects: '/projects',
  gallery: '/gallery', photos: '/gallery',
  curation: '/lists', lists: '/lists',
}

const FILES: Record<string, string> = {
  'about.md': "Hey, I'm Linghao. My mission is to synthesize knowledge and share it freely with all.",
  'mottos.md': 'Stay Informed. Stay Authentic.\nConsume to Survive, Create to Thrive.',
  'readme.md': 'Synthesist in the Shell. A memory dump since 2016.\nTry `ls`, `grep memory`, or `dive`.',
}

const FORTUNES = [
  'Stay informed. Stay authentic.',
  'Consume to survive, create to thrive.',
  'A taxonomy is a theory of what differences matter.',
  'Memory should notice what you forgot to do.',
  'Lossy is not always a loss.',
]

function hash(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function postLine(p: ShellPost) {
  return `[${String(p.n).padStart(2, ' ')}] ${p.date}  ${p.title}`
}

function search(posts: ShellPost[], query: string) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  return posts
    .map((p) => {
      const hay = (p.title + ' ' + p.tags.join(' ') + ' ' + p.slug).toLowerCase()
      const score = words.reduce((s, w) => s + (hay.includes(w) ? 1 : 0), 0)
      return { p, score }
    })
    .filter((x) => x.score === words.length)
    .map((x) => x.p)
}

const out = (text: string, tone: Tone = 'out'): Line => ({ text, tone })

export function run(raw: string, ctx: Context): Result {
  const input = raw.trim()
  if (!input) return { lines: [] }
  const [cmd, ...rest] = input.split(/\s+/)
  const arg = rest.join(' ')
  const c = cmd.toLowerCase()

  switch (c) {
    case 'help':
    case '?':
      return { lines: [out(HELP, 'dim')] }

    case 'ls': {
      if (arg === 'projects' || arg === 'projects/') {
        return {
          lines: [out(ctx.projects.map((p) => `${p.name}/`).join('\n'), 'dim'),
            out("open one with `open <name>`", 'dim')],
        }
      }
      const all = arg === '-a' || arg === '-la' || arg === '-al'
      const list = all ? ctx.posts : ctx.posts.slice(0, 10)
      const lines = [out(list.map(postLine).join('\n'))]
      if (!all) lines.push(out(`… ${ctx.posts.length - list.length} more. \`ls -a\` for everything, \`open <n>\` to read.`, 'dim'))
      return { lines }
    }

    case 'open':
    case 'cat': {
      if (c === 'cat') {
        const f = FILES[arg.toLowerCase()]
        if (f) return { lines: [out(f, 'hi')] }
        if (!arg) return { lines: [out('usage: cat <file>   files: ' + Object.keys(FILES).join(' '), 'warn')] }
      }
      if (!arg) return { lines: [out('usage: open <n|words>', 'warn')] }
      const project = ctx.projects.find((p) => p.name.toLowerCase().startsWith(arg.toLowerCase()))
      if (project && isNaN(Number(arg))) {
        return { lines: [out(`→ launching ${project.name} …`, 'ok')], action: { type: 'navigate', href: project.url, external: true } }
      }
      const n = Number(arg)
      const post = Number.isInteger(n) ? ctx.posts.find((p) => p.n === n) : search(ctx.posts, arg)[0]
      if (!post) return { lines: [out(`${c}: ${arg}: no such entry`, 'warn')] }
      return { lines: [out(`→ decoding “${post.title}” …`, 'ok')], action: { type: 'navigate', href: `/posts/${post.slug}` } }
    }

    case 'grep': {
      if (!arg) return { lines: [out('usage: grep <words>', 'warn')] }
      const hits = search(ctx.posts, arg)
      if (!hits.length) return { lines: [out(`grep: no entries match “${arg}”`, 'warn')] }
      return { lines: [out(hits.map(postLine).join('\n')), out(`${hits.length} match${hits.length > 1 ? 'es' : ''}. \`open <n>\` to read.`, 'dim')] }
    }

    case 'tags': {
      const counts: Record<string, number> = {}
      for (const p of ctx.posts) for (const t of p.tags) counts[t] = (counts[t] ?? 0) + 1
      if (arg) {
        const tag = Object.keys(counts).find((t) => t.toLowerCase() === arg.toLowerCase())
        if (!tag) return { lines: [out(`tags: unknown tag “${arg}”`, 'warn')] }
        return { lines: [out(`→ filtering by ${tag} …`, 'ok')], action: { type: 'navigate', href: `/posts?tag=${encodeURIComponent(tag)}` } }
      }
      const line = Object.entries(counts)
        .sort(([, a], [, b]) => b - a)
        .map(([t, n]) => `${t.toLowerCase().replace(/\s+/g, '-')} ${n}`)
        .join(' · ')
      return { lines: [out(line, 'dim')] }
    }

    case 'cd': {
      const target = arg.toLowerCase().replace(/^\/|\/$/g, '') || '~'
      if (target === '..') return { lines: [out('→ ~', 'ok')], action: { type: 'navigate', href: '/' } }
      const href = PAGES[target]
      if (!href) return { lines: [out(`cd: no such directory: ${arg}`, 'warn')] }
      return { lines: [out(`→ ${href}`, 'ok')], action: { type: 'navigate', href } }
    }

    case 'dive':
      return { lines: [out('initiating dive … hold on to something.', 'ok')], action: { type: 'navigate', href: '/dive' } }

    case 'whoami':
      return { lines: [out("Linghao Zhang. I build memory systems for AI,\nand write about what they keep and what they forget.", 'hi')] }

    case 'pwd':
      return { lines: [out('/home/linghao' + (ctx.pathname === '/' ? '' : ctx.pathname))] }

    case 'date':
      return { lines: [out(new Date().toString())] }

    case 'echo':
      return { lines: [out(arg)] }

    case 'history':
      return { lines: [out(ctx.history.map((h, i) => `${String(i + 1).padStart(4, ' ')}  ${h}`).join('\n') || '(empty)', 'dim')] }

    case 'fortune':
      return { lines: [out(FORTUNES[Math.floor(Math.random() * FORTUNES.length)], 'hi')] }

    case 'theme': {
      const t = arg.toLowerCase()
      if (t !== 'dark' && t !== 'light') return { lines: [out('usage: theme dark|light', 'warn')] }
      return { lines: [out(`theme → ${t}`, 'ok')], action: { type: 'theme', theme: t } }
    }

    case 'magi': {
      if (!arg) return { lines: [out('usage: magi <question>', 'warn')] }
      const h = hash(arg.toLowerCase())
      const votes = [h & 1, (h >> 3) & 1, (h >> 7) & 1].map((v) => (v ? 'APPROVE' : 'REJECT '))
      const yes = votes.filter((v) => v.startsWith('A')).length
      return {
        lines: [
          out(`question: ${arg}`, 'dim'),
          out(`MELCHIOR-1   ▸ ${votes[0]}\nBALTHASAR-2  ▸ ${votes[1]}\nCASPAR-3     ▸ ${votes[2]}`, 'warn'),
          out(`consensus: ${yes} of 3 · ${yes >= 2 ? 'motion carried' : 'motion denied'}`, yes >= 2 ? 'ok' : 'warn'),
        ],
      }
    }

    case 'sudo':
      return { lines: [out('linghao is not in the sudoers file.\nThis incident will be reported to Section 9.', 'warn')] }

    case 'rm':
      if (/-\w*r/.test(arg) && /(\/|\*|~)/.test(arg)) {
        return {
          lines: [
            out(`removing /posts …\nremoving /projects …\nremoving /memories …`, 'warn'),
            out('just kidding. memory here is append-only.', 'hi'),
          ],
        }
      }
      return { lines: [out('rm: permission denied (this is a read-only memory)', 'warn')] }

    case 'clear':
      return { lines: [], action: { type: 'clear' } }

    case 'exit':
    case 'quit':
    case 'q':
      return { lines: [], action: { type: 'close' } }

    case 'vim':
    case 'emacs':
    case 'nano':
      return { lines: [out(`${c}: not installed. the editor wars ended in a draw.`, 'dim')] }

    default:
      return { lines: [out(`zsh: command not found: ${cmd}  (try \`help\`)`, 'warn')] }
  }
}

/** Complete the first word against the command list. */
export function complete(input: string): string {
  if (input.includes(' ')) return input
  const hits = COMMANDS.filter((c) => c.startsWith(input.toLowerCase()))
  return hits.length === 1 ? hits[0] + ' ' : input
}
