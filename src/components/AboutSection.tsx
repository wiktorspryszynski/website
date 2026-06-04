import { useLang } from '../context/LanguageContext'
import { t } from '../data/homeContent'

export default function AboutSection() {
  const { lang } = useLang()

  return (
    <section id="about" className="about">
      <h2 className="h2">{t(lang, 'About', 'O mnie')}</h2>
      <div className="about-body">
        <p>{t(lang,
          "I'm based in Gdańsk. For about a year and a half I worked on a SaaS in a three-person team where everyone shipped everything — backend in PHP, frontend in JavaScript and React, the database, the copy.",
          'Mieszkam w Gdańsku. Przez około półtora roku pracowałem nad SaaS w trzyosobowym zespole, w którym każdy robił wszystko — backend w PHP, frontend w JS i React, baza, copy.'
        )}</p>
        <p>{t(lang,
          'Before that, three months on an indoor-navigation app for a hospital. React Native, a 3D model of the building, Dijkstra for pathfinding.',
          'Wcześniej trzy miesiące przy aplikacji nawigacji wewnątrz szpitala. React Native, model 3D budynku, algorytm Dijkstry.'
        )}</p>
        <p>{t(lang,
          "I like work where one person owns a feature from the schema to the last hover state, and products that respect the user's time.",
          'Lubię pracę, w której jedna osoba prowadzi feature od schematu bazy po ostatni stan hover, i produkty, które szanują czas użytkownika.'
        )}</p>
      </div>
      <aside className="about-side">
        <dl>
          <dt>{t(lang, 'Shipped', 'Produkcja')}</dt>
          <dd>PHP · JavaScript · React · SQL · HTML/CSS</dd>
          <dt>{t(lang, 'Side', 'Po godzinach')}</dt>
          <dd>TypeScript · Python · FastAPI · PostgreSQL · Redis · Deck.gl</dd>
          <dt>{t(lang, 'Mobile', 'Mobile')}</dt>
          <dd>React Native, Expo</dd>
          <dt>{t(lang, 'Languages', 'Języki')}</dt>
          <dd>Polish, English</dd>
        </dl>
      </aside>
    </section>
  )
}
