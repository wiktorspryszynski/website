import type { Lang } from '../context/LanguageContext'
import nomNomIcon from '../assets/proj-icons/nomnom-icon.png'
import flightScopeIcon from '../assets/proj-icons/flightscope-icon.png'
import spotifyIcon from '../assets/proj-icons/spotify-icon.png'
// import githubIcon from '../assets/proj-icons/github-icon.svg'
import nomnom1 from '../assets/screenshots/nomnom_screenshot_1.png'
import nomnom2 from '../assets/screenshots/nomnom_screenshot_2.png'
import flightscope1 from '../assets/screenshots/flightscope_screenshot_1.png'
import flightscope2 from '../assets/screenshots/flightscope_screenshot_2.png'
import spotify1 from '../assets/screenshots/spotify_screenshot_1.png'
import spotify2 from '../assets/screenshots/spotify_screenshot_2.png'
import spotify3 from '../assets/screenshots/spotify_screenshot_3.png'

export function t(lang: Lang, en: string, pl: string): string {
  return lang === 'pl' ? pl : en
}

export type ProjectStatus = 'live' | 'wip' | 'dead' | 'quiet'

export interface Screenshot {
  src: string
  width: number
  height: number
}

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
  screenshots?: Screenshot[]
  modelUrl?: string
}

export const projects: Project[] = [
  {
    title: 'nom nom',
    status: 'wip',
    icon: nomNomIcon,
    desc: {
      en: 'PWA for meal and water tracking. Claude Vision API estimates calories and macros from a meal photo, calories burned from an exercise and generates meal ideas for up to a week at a time with your preferences.',
      pl: 'PWA do śledzenia posiłków i wody. API wizyjne Claude szacuje kalorie i makroskładniki ze zdjęcia posiłku, kalorie spalone z ćwiczeń i generuje pomysły na posiłki dla tygodnia z Twoimi preferencjami.',
    },
    stack: ['React', 'TypeScript', 'Python', 'FastAPI', 'Postgres', 'Docker', 'PWA', 'OAuth', 'Claude API'],
    sourceUrl: 'https://github.com/wiktorspryszynski/nom-nom',
    demoUrl: 'https://fit.spryszynski.pl',
    longDesc: {
      en: 'Uses GitHub OAuth for signup and to pull basic profile info. You can calculate your present and target TDEE calories. There\'s also a water intake tracker to keep you hydrated. Designed to keep on your homescreen and check in throughout the day.',
      pl: 'Używa GitHub OAuth do rejestracji i pobierania podstawowych informacji o profilu. Możesz obliczyć swoje obecne i docelowe kalorie TDEE. Jest też tracker spożycia wody, żebyś pozostał nawodoniony. Zaprojektowany, by trzymać go na ekranie głównym i zaglądać w ciągu dnia.',
    },
    features: {
      en: ['Photo scan → calorie + macro estimate (AI)', 'Exercise burned calorie estimate (AI)', 'Meal ideas (AI)', 'Water intake tracker', 'Shareable grocery list (coming soon)'],
      pl: ['Skan zdjęcia → kalorie + makroskładniki (AI)', 'Szacowanie kalorii spalonych podczas ćwiczeń (AI)', 'Propozycje posiłków (AI)', 'Śledzenie wypitej wody' , 'Dzielona lista zakupów (wkrótce)'],
    },
    screenshots: [
      { src: nomnom1, width: 500, height: 828 },
      { src: nomnom2, width: 602, height: 1194 },
    ],
  },
  {
    title: 'flight scope',
    status: 'live',
    icon: flightScopeIcon,
    desc: {
      en: 'A live flight tracker. Click any plane to fly alongside a 3D model. You can also view positions from up to 2 weeks in the past.',
      pl: 'Tracker lotów na żywo. Kliknij samolot i lecisz obok modelu 3D. Możesz również zobaczyć pozycje z ostatnich 2 tygodni.',
    },
    stack: ['React', 'TypeScript', 'Python', 'FastAPI', 'Postgres', 'Redis', 'Docker', 'Deck.gl'],
    sourceUrl: 'https://github.com/wiktorspryszynski/flight-scope',
    demoUrl: 'https://flights.spryszynski.pl',
    longDesc: {
      en: 'Live ADS-B positions from OpenSky API land in Redis pub/sub and fan out over SSE to every connected browser. Positions are persisted to Postgres for historic playback. Click any aircraft and a 3D model locks to its heading and altitude. ML anomaly detection is currently in progress.',
      pl: 'Dane ADS-B z OpenSky API trafiają do Redis pub/sub i są rozsyłane przez SSE. Pozycje zapisywane w Postgresie do odtwarzania historii. Kliknij samolot, a model 3D śledzi jego kurs i wysokość. ML do anomalii w trakcie dodawania.',
    },
    features: {
      en: ['Real-time ADS-B via OpenSky + Redis pub/sub', 'SSE fan-out to all connected clients', 'Click-to-follow with 3D model (Deck.gl)', 'ML anomaly detection (in progress)', 'Historic data'],
      pl: ['ADS-B na żywo przez OpenSky + Redis pub/sub', 'SSE do wszystkich klientów', 'Śledzenie 3D modelu samolotu (Deck.gl)', 'Wykrywanie anomalii ML (w trakcie)', 'Dane historyczne'],
    },
    screenshots: [
      { src: flightscope1, width: 1311, height: 1229 },
      { src: flightscope2, width: 845, height: 860 },
    ],
  },
  {
    title: 'spotify recommender',
    status: 'dead',
    icon: spotifyIcon,
    desc: {
      en: 'Sign in with Spotify, pull your top tracks, get a recommended playlist back. Saves to your library in one click. Retired when Spotify killed the audio-features endpoint.',
      pl: 'Logowanie przez Spotify, pobranie topki, zwrot rekomendowanej playlisty. Zapis do biblioteki jednym kliknięciem. Zamknięte, gdy Spotify wyłączył endpoint audio-features.',
    },
    stack: ['Python', 'Django', 'scikit-learn', 'joblib', 'kNN', 'Docker', 'OAuth'],
    sourceUrl: 'https://github.com/wiktorspryszynski/spotify_music_recommender',
    demoUrl: 'https://spotify.spryszynski.pl',
    modelUrl: 'https://github.com/wiktorspryszynski/music_recommender_model/blob/main/music_recommender_engine.ipynb',
    longDesc: {
      en: 'Pulls your Spotify top 100 (50 liked + 50 most played) tracks and their audio features, then a cosine-similarity model trained on a bigger dataset (100k songs with audio features) generates a playlist. It picks one most similar track per one fetched song (equals 100 recommended songs). One click saves it straight to your Spotify library. Retired in 2024 when Spotify removed the audio-features endpoint that the model depended on. Demo works only on saved songs data.',
      pl: 'Pobiera 100 topowych utworów Spotify (50 polubionych + 50 najczęściej odtwarzanych) i ich cechy audio, a model kosinusowy wytrenowany na większym zbiorze danych (100 tys. piosenek z cechami audio) generuje playlistę. Wybiera on jeden najbardziej podobny utwór na każdy pobrany utwór (co daje 100 rekomendowanych piosenek). Jedno kliknięcie zapisuje ją w bibliotece. Zamknięte w 2024, gdy Spotify usunął endpoint audio-features. Demo działa tylko na zapisanych danych piosenek.',
    },
    features: {
      en: ['Spotify OAuth sign-in', 'Top-100 track analysis via audio features', 'Cosine-similarity model (scikit-learn)', 'One-click playlist save to library', 'Demo only works on saved songs data'],
      pl: ['Logowanie OAuth przez Spotify', 'Analiza 100 topowych przez cechy audio', 'Model kosinusowy (scikit-learn)', 'Zapis playlisty jednym kliknięciem', 'Demo działa tylko na zapisanych piosenkach'],
    },
    screenshots: [
      { src: spotify1, width: 1224, height: 772 },
      { src: spotify2, width: 1243, height: 790 },
      { src: spotify3, width: 1719, height: 1042 },
    ],
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
