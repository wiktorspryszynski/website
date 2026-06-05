import type { Lang } from '../context/LanguageContext'

export function t(lang: Lang, en: string, pl: string): string {
  return lang === 'pl' ? pl : en
}

export type ProjectStatus = 'live' | 'wip' | 'dead' | 'quiet'

export interface Project {
  title: string
  status: ProjectStatus
  desc: Record<Lang, string>
  stack: string[]
  sourceUrl: string
  demoUrl?: string
  small?: boolean
}

export const projects: Project[] = [
  {
    title: 'nom-nom',
    status: 'wip',
    desc: {
      en: 'A small PWA for tracking calories and water. Photo-scan a plate for an estimate, generate meal ideas with a shareable grocery list. Started because no free calorie app respected my time.',
      pl: 'Mała PWA do liczenia kalorii i wody. Skanuj zdjęcie posiłku, generuj pomysły na posiłki z listą zakupów. Powstaje, bo żadna darmowa apka do liczenia kalorii nie szanowała mojego czasu.',
    },
    stack: ['React', 'TypeScript', 'Python', 'FastAPI', 'Postgres', 'Docker', 'PWA'],
    sourceUrl: 'https://github.com/wiktorspryszynski/nom-nom',
  },
  {
    title: 'flight-scope',
    status: 'live',
    desc: {
      en: 'A live flight tracker. OpenSky into Redis, fanned out to clients, persisted to Postgres. Click a plane and ride along beside a 3D model. Currently adding ML and historic playback.',
      pl: 'Tracker lotów na żywo. OpenSky do Redisa, rozsyłany do klientów, zapisany w Postgresie. Klikasz samolot i lecisz obok modelu 3D. Dokładam ML i odtwarzanie historii.',
    },
    stack: ['React', 'TypeScript', 'Python', 'FastAPI', 'Postgres', 'Redis', 'Docker', 'Deck.gl'],
    sourceUrl: 'https://github.com/wiktorspryszynski/flight-scope',
    demoUrl: '#',
  },
  {
    title: 'spotify-recommender',
    status: 'dead',
    desc: {
      en: 'Sign in with Spotify, pull your top tracks, get a recommended playlist back. Saves to your library in one click. Retired when Spotify killed the audio-features endpoint.',
      pl: 'Logowanie przez Spotify, pobranie topki, zwrot rekomendowanej playlisty. Zapis do biblioteki jednym kliknięciem. Zamknięte, gdy Spotify wyłączył endpoint audio-features.',
    },
    stack: ['Python', 'Django', 'scikit-learn', 'joblib', 'Docker', 'OAuth'],
    sourceUrl: 'https://github.com/wiktorspryszynski/spotify_music_recommender',
  },
  {
    title: 'self-updating github profile',
    status: 'quiet',
    desc: {
      en: 'A nightly Action that scrapes my own stats and regenerates the PNG embedded in my profile README.',
      pl: 'Nocna akcja GitHub, która pobiera moje statystyki i regeneruje PNG osadzony w README profilu.',
    },
    stack: ['Python', 'GitHub Actions'],
    sourceUrl: 'https://github.com/wiktorspryszynski/wiktorspryszynski',
    small: true,
  },
]

export const statusLabel: Record<ProjectStatus, Record<Lang, string>> = {
  live: { en: 'live', pl: 'live' },
  wip: { en: 'in progress', pl: 'w trakcie' },
  dead: { en: 'archived', pl: 'archiwum' },
  quiet: { en: 'nightly', pl: 'nocne' },
}
