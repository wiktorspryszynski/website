export type TerminalLine = {
  text: string
  cls: 'cmd' | 'out' | 'err' | 'accent' | 'dim'
  html?: boolean
}

export type RunResult = {
  lines: TerminalLine[]
  special?: 'clear' | 'exit' | 'hire' | 'sudo-hire'
}

type CommandDef = {
  help?: string  // present = shown in `help` output
  run: () => RunResult
}

import { LOOKING_FOR_HIRE } from '../config/features'

function line(text: string, cls: TerminalLine['cls'] = 'out', html = false): TerminalLine {
  return { text, cls, html }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] ?? c))
}

const COMMANDS: Record<string, CommandDef> = {
  help: {
    help: 'this list',
    run: () => ({
      lines: Object.entries(COMMANDS)
        .filter(([, def]) => def.help)
        .map(([cmd, def]) =>
          line(`  <span style="color:var(--ok)">${cmd.padEnd(12)}</span><span style="color:var(--muted)">${def.help}</span>`, 'out', true)
        ),
    }),
  },

  whoami: {
    help: 'about me',
    run: () => ({ lines: [
      line('wiktor spryszynski'),
      line('full-stack engineer, gdansk, pl.', 'dim'),
      line(LOOKING_FOR_HIRE ? 'open to work.' : 'looking to collaborate.', 'dim'),
    ]}),
  },

  ls: {
    help: 'list projects',
    run: () => ({ lines: [
      line("  <span style='color:var(--ok)'>nom-nom/</span>              <a style='color:var(--accent)' target='_blank' href='https://github.com/wiktorspryszynski/nom-nom'>LINK</a> diet companion PWA", 'out', true),
      line("  <span style='color:var(--ok)'>flight-scope/</span>         <a style='color:var(--accent)' target='_blank' href='https://github.com/wiktorspryszynski/flight-scope'>LINK</a> live flight tracker", 'out', true),
      line("  <span style='color:var(--ok)'>spotify-recommender/</span>  <a style='color:var(--accent)' target='_blank' href='https://github.com/wiktorspryszynski/spotify-recommender'>LINK</a> playlist generator · archived", 'out', true),
      line("  <span style='color:var(--ok)'>wiktorspryszynski/</span>    <a style='color:var(--accent)' target='_blank' href='https://github.com/wiktorspryszynski/wiktorspryszynski'>LINK</a> readme bot", 'out', true),
    ]}),
  },

  'cat resume': {
    help: 'resume summary',
    run: () => ({ lines: [
      line('wiktor spryszynski / full-stack engineer / gdansk, pl'),
      line(''),
      line('experience', 'dim'),
      line('  saas startup, 3 people, ~1.5y - php, js, react'),
      line('  hospital indoor nav, 3 people, 3mo - react native, 3d, dijkstra'),
      line(''),
      line('now: building flight-scope and nom-nom.', 'dim'),
    ]}),
  },

  stack: {
    help: 'tech',
    run: () => ({ lines: [
      line('shipped: php, javascript, react, sql, html/css'),
      line('side: typescript, python, fastapi, postgres, redis, deck.gl'),
    ]}),
  },

  contact: {
    help: 'links',
    run: () => ({ lines: [
      line("github    <a style='color:var(--accent)' target='_blank' href='https://github.com/wiktorspryszynski'>github.com/wiktorspryszynski</a>", 'out', true),
      line("linkedin  <a style='color:var(--accent)' target='_blank' href='https://www.linkedin.com/in/wiktor-spryszynski/'>linkedin.com/in/wiktor-spryszynski</a>", 'out', true),
      line("email     <a style='color:var(--accent)' href='mailto:spryszynskiwiktor@gmail.com'>spryszynskiwiktor@gmail.com</a>", 'out', true),
    ]}),
  },

  hire: {
    help: 'the important one',
    run: () => ({ lines: [
      line('drafting email…', 'dim'),
      line('opening mail client.'),
    ], special: 'hire' }),
  },

  clear: {
    help: 'clear the terminal',
    run: () => ({ lines: [], special: 'clear' }),
  },

  exit: {
    help: 'close',
    run: () => ({ lines: [], special: 'exit' }),
  },

  // hidden aliases
  'ls projects': { run: () => COMMANDS.ls.run() },
  'sudo hire': { run: () => ({ lines: [
    line('[sudo] password for recruiter: ••••••••', 'dim'),
    line("<span style='color:var(--ok)'>permission granted.</span>", 'out', true),
    line('flagging as URGENT.', 'err'),
    line('opening mail client.'),
  ], special: 'sudo-hire' }) },
}

export function runCommand(raw: string): RunResult {
  const cmd = raw.trim().toLowerCase()
  if (!cmd) return { lines: [] }

  if (cmd === 'sudo')
    return { lines: [line('usage: sudo <command>', 'dim')] }

  if (cmd.startsWith('sudo ') && cmd !== 'sudo hire')
    return { lines: [line('You are not in the sudoers file. This incident will be reported.', 'err')] }

  if (cmd.startsWith('cd '))
    return { lines: [line("you can′t cd. this is a portfolio.", 'dim')] }

  if (cmd === 'rm -rf /')
    return { lines: [line('nice try.', 'err')] }

  const def = COMMANDS[cmd]
  if (def)
    return def.run()

  return {
    lines: [line(
      `<span style='color:var(--accent)'>command not found:</span> ${escapeHtml(cmd)} — try <span style='color:var(--ok)'>help</span>`,
      'out', true
    )],
  }
}
