import type { Lang } from '../context/LanguageContext'
import nomNomIcon from '../assets/proj-icons/nomnom-icon.png'
import flightScopeIcon from '../assets/proj-icons/flightscope-icon.png'
import spotifyIcon from '../assets/proj-icons/spotify-icon.png'
import githubIcon from '../assets/proj-icons/github-icon.svg'

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
  icon?: string
  small?: boolean
  longDesc?: Record<Lang, string>
  features?: Record<Lang, string[]>
  screenshot?: string
}

export const projects: Project[] = [
  {
    title: 'nom nom',
    status: 'wip',
    icon: nomNomIcon,
    desc: {
      en: 'A small PWA for tracking calories and water. Photo-scan a plate for an estimate, generate meal ideas with a shareable grocery list. Started because no free calorie app respected my time.',
      pl: 'Mała PWA do liczenia kalorii i wody. Skanuj zdjęcie posiłku, generuj pomysły na posiłki z listą zakupów. Powstaje, bo żadna darmowa apka do liczenia kalorii nie szanowała mojego czasu.',
    },
    stack: ['React', 'TypeScript', 'Python', 'FastAPI', 'Postgres', 'Docker', 'PWA'],
    sourceUrl: 'https://github.com/wiktorspryszynski/nom-nom',
    demoUrl: 'https://fit.spryszynski.pl',
    longDesc: {
      en: 'Vision API scans the photo and estimates calories, macros, and portion size. A generator then suggests meal ideas and produces a shareable grocery list. Built offline-first so the tracker keeps working without a connection. No ads, no paywall, no dark patterns.',
      pl: 'API wizyjne skanuje zdjęcie i szacuje kalorie, makroskładniki oraz porcję. Generator proponuje posiłki i tworzy listę zakupów do udostępnienia. PWA działa offline. Żadnych reklam, paywalla ani ciemnych wzorców.',
    },
    features: {
      en: ['Photo scan → calorie + macro estimate', 'AI meal ideas + shareable grocery list', 'Offline-first PWA', 'Water intake tracker'],
      pl: ['Skan zdjęcia → kalorie + makroskładniki', 'Propozycje posiłków AI + lista zakupów', 'PWA działające offline', 'Śledzenie wypitej wody'],
    },
  },
  {
    title: 'flight scope',
    status: 'live',
    icon: flightScopeIcon,
    desc: {
      en: 'A live flight tracker. OpenSky into Redis, fanned out to clients, persisted to Postgres. Click a plane and ride along beside a 3D model. Currently adding ML and historic playback.',
      pl: 'Tracker lotów na żywo. OpenSky do Redisa, rozsyłany do klientów, zapisany w Postgresie. Klikasz samolot i lecisz obok modelu 3D. Dokładam ML i odtwarzanie historii.',
    },
    stack: ['React', 'TypeScript', 'Python', 'FastAPI', 'Postgres', 'Redis', 'Docker', 'Deck.gl'],
    sourceUrl: 'https://github.com/wiktorspryszynski/flight-scope',
    demoUrl: 'https://flights.spryszynski.pl',
    longDesc: {
      en: 'Live ADS-B positions from OpenSky land in Redis pub/sub and fan out over WebSockets to every connected browser. Positions are persisted to Postgres for historic playback. Click any aircraft and a 3D model locks to its heading and altitude. ML anomaly detection and a route scrubber are currently in progress.',
      pl: 'Dane ADS-B z OpenSky trafiają do Redis pub/sub i są rozsyłane przez WebSockety. Pozycje zapisywane w Postgresie do odtwarzania historii. Kliknij samolot, a model 3D śledzi jego kurs i wysokość. ML do anomalii i scrubber historyczny w trakcie.',
    },
    features: {
      en: ['Real-time ADS-B via OpenSky + Redis pub/sub', 'WebSocket fan-out to all connected clients', 'Click-to-follow with 3D model (Deck.gl)', 'ML anomaly detection (in progress)', 'Historic route playback (in progress)'],
      pl: ['ADS-B na żywo przez OpenSky + Redis pub/sub', 'WebSocket do wszystkich klientów', 'Śledzenie 3D modelu samolotu (Deck.gl)', 'Wykrywanie anomalii ML (w trakcie)', 'Odtwarzanie historii trasy (w trakcie)'],
    },
  },
  {
    title: 'spotify recommender',
    status: 'dead',
    icon: spotifyIcon,
    desc: {
      en: 'Sign in with Spotify, pull your top tracks, get a recommended playlist back. Saves to your library in one click. Retired when Spotify killed the audio-features endpoint.',
      pl: 'Logowanie przez Spotify, pobranie topki, zwrot rekomendowanej playlisty. Zapis do biblioteki jednym kliknięciem. Zamknięte, gdy Spotify wyłączył endpoint audio-features.',
    },
    stack: ['Python', 'Django', 'scikit-learn', 'joblib', 'Docker', 'OAuth'],
    sourceUrl: 'https://github.com/wiktorspryszynski/spotify_music_recommender',
    demoUrl: 'https://spotify.spryszynski.pl',
    longDesc: {
      en: 'OAuth sign-in pulls your top 50 tracks and their audio features, then a cosine-similarity model trained on genre clusters generates a playlist tuned to your taste. One click saves it straight to your Spotify library. Retired in 2024 when Spotify removed the audio-features endpoint that the model depended on.',
      pl: 'OAuth pobiera 50 topowych utworów i ich cechy audio, a model kosinusowy wytrenowany na klastrach gatunków generuje playlistę. Jedno kliknięcie zapisuje ją w bibliotece. Zamknięte w 2024, gdy Spotify usunął endpoint audio-features.',
    },
    features: {
      en: ['Spotify OAuth sign-in', 'Top-50 track analysis via audio features', 'Cosine-similarity model (scikit-learn)', 'One-click playlist save to library'],
      pl: ['Logowanie OAuth przez Spotify', 'Analiza 50 topowych przez cechy audio', 'Model kosinusowy (scikit-learn)', 'Zapis playlisty jednym kliknięciem'],
    },
  },
  // {
  //   title: 'self updating github profile',
  //   status: 'quiet',
  //   icon: githubIcon,
  //   desc: {
  //     en: 'A nightly Action that scrapes my own stats and regenerates the PNG embedded in my profile README.',
  //     pl: 'Nocna akcja GitHub, która pobiera moje statystyki i regeneruje PNG osadzony w README profilu.',
  //   },
  //   stack: ['Python', 'GitHub Actions'],
  //   sourceUrl: 'https://github.com/wiktorspryszynski/wiktorspryszynski',
  //   small: true,
  // },
]

export const statusLabel: Record<ProjectStatus, Record<Lang, string>> = {
  live: { en: 'live', pl: 'live' },
  wip: { en: 'in progress', pl: 'w trakcie' },
  dead: { en: 'deprecated', pl: 'przestarzałe' },
  quiet: { en: 'nightly', pl: 'nocne' },
}
