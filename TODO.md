# TODO

## Planned

- [ ] Wire up a backend - some things are BACKEND_DEPENDENT (bool variable), e.g.: API endpoint showcase, WWW easter egg
- [ ] `flight-scope` demo link — `demoUrl` is set to `'#'` in `homeContent.ts`
- [ ] Add ML and historic playback to flight-scope (noted in project description)
- [ ] SEO / OG meta tags via React Helmet
- [ ] Better project showcase divs (expand to show more, show a GIF, add icons, color code languages listed in project's stack)

-  Easter eggs
  - [ ] Terminal: add `sudo` command — respond with "Wiktor is not in the sudoers file. This incident will be reported."
  - [ ] Terminal: add `matrix` command — green falling chars overlay for a few seconds
  - [ ] Terminal: add `party` command — confetti burst for 3s
  - [ ] Terminal: add `links`, `cv`, `neofetch` (show stack as if it's system info) commands
  - [ ] Clicking "Wiktor" shows retro 90s WWW div: "You are visitor number X" — use real counter via backend endpoint, not hardcoded number
  - [X] Clicking "Spryszyński" shows pronunciation guide
  - [X] Backtick (`` ` ``) opens Linux-style terminal with preset commands
  - [ ] ASCII art of name/surname printed in browser console on load

## Nice to have

- [ ] Footer: show short git SHA of current build (inject via GitHub Actions: `VITE_COMMIT_SHA=${{ github.sha }}`, display first 7 chars)
- [ ] Footer: "built with" icon tooltips — hover shows a one-liner or fun fact about that tool
- [ ] `/now` page — short "what I'm working on right now" subpage, link subtly from footer
- [ ] `/humans.txt` — authors, stack, tools used; link subtly from footer
- [ ] `<meta name="author">` with a recruiter-friendly message, e.g. "Wiktor Spryszyński – reach out if you're hiring"
- [ ] Persist terminal history across opens (sessionStorage)
- [ ] Cursor follower with spring physics (subtle, small dot with slight lag)
- [ ] Dark/light theme toggle
- [ ] Konami code → move to terminal as a hidden command or trigger for `party`

## Broken / needs attention

- [ ] `flight-scope` demo URL is a placeholder `#` — either add a real URL or hide the demo button

## Ideas (not committed)

- Spring-physics cursor follower
- Generative visual tied to personal data, not just decorative — examples:
  - **GitHub commits → 3D bar chart**: fetch contribution data via GitHub API, render as rotatable grid in Three.js (reuse existing setup). Each column = one week, height = commit count. Shows activity, not just aesthetics.
  - **Stack DNA**: force-directed graph (D3) where nodes are technologies, edges connect them to shared projects. Click a node → highlights relevant projects. Replaces bullet list with something explorable.
  - **Kula already in Three.js**: tie a parameter to something real — e.g. rotation speed = commits this week, number of faces = days since last deploy. Small change, big difference in meaning.
- V3 ideas:
  - Geometric art - [LINK](https://themeforest.net/item/azurio-digital-agency-personal-portfolio-nextjs-template/63087539)