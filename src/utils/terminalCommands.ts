export type TerminalLine = {
  text: string
  cls: 'cmd' | 'out' | 'err' | 'accent' | 'dim'
  html?: boolean
}

type CommandFn = () => TerminalLine[]

function line(text: string, cls: TerminalLine['cls'] = 'out', html = false): TerminalLine {
  return { text, cls, html }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] ?? c))
}

export const commands: Record<string, CommandFn> = {
  help: () => ([
    ['help', 'this list'],
    ['whoami', 'about me'],
    ['ls', 'list projects'],
    ['cat resume', 'resume summary'],
    ['stack', 'tech'],
    ['contact', 'links'],
    ['hire', 'the important one'],
    ['coffee', 'pour me one'],
    ['clear', 'clear the terminal'],
    ['exit', 'close'],
  ] as [string, string][]).map(([c, d]) =>
    line(`  <span style="color:var(--ok)">${c.padEnd(12)}</span><span style="color:var(--muted)">${d}</span>`, 'out', true)
  ),

  whoami: () => [
    line('wiktor spryszynski'),
    line('full-stack engineer, gdansk, pl.', 'dim'),
    line('open to work, may 2026.', 'dim'),
  ],

  ls: () => [
    line("  <span style='color:var(--ok)'>nom-nom/</span>            pwa · in progress", 'out', true),
    line("  <span style='color:var(--ok)'>flight-scope/</span>       live tracker · ~80%", 'out', true),
    line("  <span style='color:var(--ok)'>spotify-recommender/</span> archived", 'out', true),
    line("  <span style='color:var(--ok)'>wiktorspryszynski/</span>   readme bot", 'out', true),
  ],

  'ls projects': () => commands.ls(),

  stack: () => [
    line('shipped: php, javascript, react, sql, html/css'),
    line('side: typescript, python, fastapi, postgres, redis, deck.gl'),
  ],

  contact: () => [
    line("github   <a style='color:var(--accent)' target='_blank' href='https://github.com/wiktorspryszynski'>github.com/wiktorspryszynski</a>", 'out', true),
    line("linkedin <a style='color:var(--accent)' target='_blank' href='https://www.linkedin.com/in/wiktor-spryszynski/'>linkedin.com/in/wiktor-spryszynski</a>", 'out', true),
    line("email    <a style='color:var(--accent)' href='mailto:spryszynskiwiktor@gmail.com'>spryszynskiwiktor@gmail.com</a>", 'out', true),
  ],

  'cat resume': () => [
    line('wiktor spryszynski / full-stack engineer / gdansk, pl'),
    line(''),
    line('experience', 'dim'),
    line('  saas startup, 3 people, ~1.5y — php, js, react'),
    line('  hospital indoor nav, 3 people, 3mo — react native, 3d, dijkstra'),
    line(''),
    line('now: building flight-scope and nom-nom.', 'dim'),
  ],

  coffee: () => [
    '    ( (',
    '     ) )',
    '  .-----.',
    '  |     |]',
    "  `-----'",
  ].map(l => line(l)).concat([line('on it.', 'dim')]),
}

export type RunResult = {
  lines: TerminalLine[]
  special?: 'clear' | 'exit' | 'hire' | 'sudo-hire'
}

export function runCommand(raw: string): RunResult {
  const cmd = raw.trim().toLowerCase()
  if (!cmd) return { lines: [] }
  if (cmd === 'clear') return { lines: [], special: 'clear' }
  if (cmd === 'exit') return { lines: [], special: 'exit' }
  if (cmd === 'hire') return { lines: [line('opening mail…')], special: 'hire' }
  if (cmd === 'sudo hire') return {
    lines: [line("<span style='color:var(--accent)'>permission granted.</span>", 'out', true)],
    special: 'sudo-hire',
  }
  if (cmd.startsWith('cd ')) return { lines: [line("you can′t cd. this is a portfolio.", 'dim')] }
  if (cmd === 'rm -rf /') return { lines: [line('nice try.', 'err')] }

  const handler = commands[cmd]
  if (handler) return { lines: handler() }

  return {
    lines: [line(
      `<span style='color:var(--accent)'>command not found:</span> ${escapeHtml(cmd)} — try <span style='color:var(--ok)'>help</span>`,
      'out', true
    )],
  }
}
