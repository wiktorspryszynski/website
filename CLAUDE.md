# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website (v2) for Wiktor Spryszyński — full-stack developer. Built with React 19, TypeScript, Vite, and Three.js. The previous version (v1) is preserved as a static SPA and served at `/legacy/v1` alongside the new app. The live site is at `https://spryszynski.pl`; the legacy v1 is accessible at `https://spryszynski.pl/legacy/v1`.

## Commands

```bash
npm run dev       # Vite dev server
npm run build     # tsc -b && vite build
npm run preview   # Preview production build locally
npm run lint      # ESLint
```

No test suite is configured.

## Stack

- **React 19** with React Router v7 (BrowserRouter, single wildcard route `/*` → `HomePage`)
- **TypeScript ~5.9** — strict mode, `noUnusedLocals`, `noUnusedParameters`
- **Vite 7** with `@vitejs/plugin-react`
- **Three.js 0.184** — interactive icosahedron orb with procedural noise, momentum drag, star field
- **Tippy.js** — popovers for eggs and tooltips
- **React Helmet** — head tag management

## Architecture

`App.tsx` is a thin BrowserRouter wrapper. All content lives in `HomePage.tsx`, which composes:

- `OrbCanvas` — full-viewport Three.js canvas, rendered behind everything. Excluded DOM zones (nav, terminal, popups) prevent drag conflicts. Geometry rebuilds every 3rd frame for perf.
- Section components: `HeroSection`, `AboutSection`, `WorkSection`, `ContactSection`, `SiteFooter`
- Overlay components: `TerminalOverlay`, `WwwEgg`, `PronunciationPop`, `Toast`

`LanguageContext` provides EN/PL switching (persisted to localStorage). Translations live in `src/data/homeContent.ts`.

Global styles are in a single file: `src/styles/home.css`.

Build injects four globals via `vite.config.ts` defines: `__APP_VERSION__` (from `package.json` version), `__GIT_SHA__`, `__BUILD_NUMBER__`, `__BUILD_DATE__`. `__GIT_SHA__`/`__BUILD_NUMBER__` come from `VITE_GIT_SHA`/`VITE_BUILD_NUMBER` (set by the deploy workflow); they fall back to `dev`/`local` for local builds. The footer surfaces `__APP_VERSION__` and `__GIT_SHA__`.

### Versioning

The app version lives in `package.json` (`version`) and is the single source of truth — `vite.config.ts` injects it as `__APP_VERSION__` and the footer displays it (linking to `/releases/tag/v<version>`).

To cut a release, just bump `version` in `package.json` and push to `main`. The `release` workflow (`.github/workflows/release.yml`) reads the new version and publishes a GitHub Release (tag `v<version>`) with auto-generated notes. It's idempotent — if a release for that version already exists (e.g. `package.json` changed for an unrelated reason), the run is a no-op. No manual tagging required.

### Legacy v1 routing

`vite.config.ts` includes a custom dev-server middleware that intercepts `/legacy/v1/*` requests: real files are served directly, everything else falls back to `public/legacy/v1/index.html`. In production, `public/legacy/v1/.htaccess` replicates the same logic for Apache.

## Easter Eggs

| Trigger | Feature |
|---|---|
| Click **"Wiktor"** in hero | `WwwEgg` — 1990s Netscape Navigator window with marquee, visitor counter, flying packets |
| Click **"Spryszyński"** in hero | `PronunciationPop` — IPA guide + Web Speech API playback (Polish voice) |
| Press **backtick/tilde** or footer button | `TerminalOverlay` — interactive terminal emulator |
Terminal commands of note: `sudo hire` (URGENT mailto), `rm -rf /` ("nice try."), `cd *` ("you can't cd. this is a portfolio."), `coffee` (ASCII art).
