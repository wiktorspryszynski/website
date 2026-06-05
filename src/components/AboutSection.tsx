import T from './T'
import TechTag from './TechTag'

const SHIPPED  = ['PHP', 'JavaScript', 'React', 'SQL', 'HTML/CSS']
const SIDE     = ['TypeScript', 'Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker', 'Deck.gl']
const MOBILE   = ['React Native', 'Expo']

export default function AboutSection() {
  return (
    <section id="about" className="about">
      <h2 className="h2"><T en="About" pl="O mnie" /></h2>
      <div className="about-body">
        <p><T
          en="I'm based in Gdańsk. For about a year and a half I worked on a SaaS in a three-person team where everyone shipped everything — backend in PHP, frontend in JavaScript and React, the database, the copy."
          pl="Mieszkam w Gdańsku. Przez około półtora roku pracowałem nad SaaS w trzyosobowym zespole, w którym każdy robił wszystko — backend w PHP, frontend w JS i React, baza, copy."
        /></p>
        <p><T
          en="Before that, three months on an indoor-navigation app for a hospital. React Native, a 3D model of the building, Dijkstra for pathfinding."
          pl="Wcześniej trzy miesiące przy aplikacji nawigacji wewnątrz szpitala. React Native, model 3D budynku, algorytm Dijkstry."
        /></p>
        <p><T
          en="I like work where one person owns a feature from the schema to the last hover state, and products that respect the user's time."
          pl="Lubię pracę, w której jedna osoba prowadzi feature od schematu bazy po ostatni stan hover, i produkty, które szanują czas użytkownika."
        /></p>
      </div>
      <aside className="about-side">
        <dl>
          <dt><T en="Shipped" pl="Produkcja" /></dt>
          <dd>{SHIPPED.map(t => <TechTag key={t} name={t} />)}</dd>
          <dt><T en="Side" pl="Po godzinach" /></dt>
          <dd>{SIDE.map(t => <TechTag key={t} name={t} />)}</dd>
          <dt><T en="Mobile" pl="Mobile" /></dt>
          <dd>{MOBILE.map(t => <TechTag key={t} name={t} />)}</dd>
          <dt><T en="Languages" pl="Języki" /></dt>
          <dd className="about-langs">Polish, English</dd>
        </dl>
      </aside>
    </section>
  )
}
