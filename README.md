# Porftolio website
Personal portfolio site. React 19 + TypeScript + Vite + Three.js.
Live at https://spryszynski.pl.

## Features
- **Three.js orb** — interactive icosahedron with procedural noise, momentum drag, star field
- **EN/PL language switch** — persisted to localStorage
- **Terminal emulator** — press `` ` `` or `~`, or use the footer button

## Legacy
v1 lives at https://spryszynski.pl/legacy/v1 — served from `public/legacy/v1/` with a custom Vite middleware fallback (Apache `.htaccess` in production).

## Easter eggs
| Trigger | Feature |
|---|---|
| Click **Wiktor** in hero | 1990s Netscape Navigator window — marquee, visitor counter, flying packets |
| Click **Spryszyński** in hero | Polish pronunciation guide + Web Speech API playback |
| Press **`** or **~** | Interactive terminal emulator (see below) |

### Terminal commands
| Command | Result |
|---|---|
| `help` | List all commands |
| `whoami` | Bio |
| `ls` / `ls projects` | Project list |
| `cat resume` | Resume summary |
| `stack` | Tech stack |
| `contact` | Links |
| `hire` | Opens mailto |
| `sudo hire` | URGENT mailto |
| `coffee` | ASCII art |
| `clear` / `exit` | Clear / close |
| `cd <anything>` | "you can't cd. this is a portfolio." |
| `rm -rf /` | "nice try." |
