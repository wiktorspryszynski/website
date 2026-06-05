import type { IconType } from 'react-icons'
import {
  SiPhp, SiJavascript, SiTypescript, SiReact,
  SiPython, SiFastapi, SiPostgresql, SiRedis,
  SiDjango, SiExpo, SiGithubactions, SiHtml5,
  SiScikitlearn, SiDocker,
} from 'react-icons/si'

type TechConfig = { icon?: IconType; color: string }

const TECH: Record<string, TechConfig> = {
  'PHP':            { icon: SiPhp,            color: '#8892BF' },
  'JavaScript':     { icon: SiJavascript,     color: '#F7DF1E' },
  'TypeScript':     { icon: SiTypescript,     color: '#3178C6' },
  'React':          { icon: SiReact,          color: '#61DAFB' },
  'React Native':   { icon: SiReact,          color: '#61DAFB' },
  'Python':         { icon: SiPython,         color: '#4B8BBE' },
  'FastAPI':        { icon: SiFastapi,        color: '#009688' },
  'PostgreSQL':     { icon: SiPostgresql,     color: '#4169E1' },
  'Postgres':       { icon: SiPostgresql,     color: '#4169E1' },
  'SQL':            { icon: SiPostgresql,     color: '#4169E1' },
  'Redis':          { icon: SiRedis,          color: '#DC382D' },
  'Django':         { icon: SiDjango,         color: '#2BA977' },
  'Expo':           { icon: SiExpo,           color: '#ebe9e3' },
  'GitHub Actions': { icon: SiGithubactions,  color: '#2088FF' },
  'HTML/CSS':       { icon: SiHtml5,          color: '#E34F26' },
  'Deck.gl':        {                         color: '#FF6B6B' },
  'PWA':            {                         color: '#5A0FC8' },
  'Docker':         { icon: SiDocker,         color: '#2496ED' },
  'scikit-learn':   { icon: SiScikitlearn,    color: '#F7931E' },
  'joblib':         {                         color: '#888'    },
  'OAuth':          {                         color: '#888'    },
  'kNN':            {                         color: '#888'    },
}

export default function TechTag({ name }: { name: string }) {
  const cfg = TECH[name] ?? { color: '#888' }
  const Icon = cfg.icon
  return (
    <span className="tech-tag" style={{ '--tag-color': cfg.color } as React.CSSProperties}>
      {Icon && <Icon size={11} aria-hidden="true" />}
      {name}
    </span>
  )
}
