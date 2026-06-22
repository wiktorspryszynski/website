import T from './T'
import TechTag from './TechTag'
import Arrow from './Arrow'

const SHIPPED  = ['PHP', 'JavaScript', 'React', 'SQL', 'HTML/CSS']
const SIDE     = ['TypeScript', 'Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker', 'Deck.gl']
const MOBILE   = ['React Native', 'Expo']

export default function AboutSection() {
  return (
    <section id="about" className="about">
      <h2 className="h2"><T en="About" pl="O mnie" /></h2>
      <div className="about-body">
        <p><T
          en={<>I'm based in <a className="geo-link link" href="https://maps.google.com/?q=Gdańsk,+Poland" target="_blank" rel="noopener noreferrer">Gdańsk, Poland <Arrow /></a>.</>}
          pl="Mieszkam w Gdańsku."
        /></p>
        <p><T
          en="For about a year and a half I worked in a startup on a SaaS in a small team where everyone did everything."
          pl="Przez około półtora roku pracowałem w startupie nad SaaS w małym zespole, w którym każdy robił wszystko."
        /></p>
        <p><T
          en="I built the backend in PHP, the frontend in JavaScript & React. I designed the database schema and implemented many features (e.g. monitoring, event logging, signing up, JWT)."
          pl="Pisałem tam backend w PHP, a frontend w JavaScript i React. Projektowałem schemat bazy danych i zaimplementowałem wiele funkcji (np. monitoring, logowanie zdarzeń, rejestracja, JWT)."
        /></p>
        <p><T
          en="In the meantime, I also built a React Native mobile app for indoor navigation - a group project for a hospital, which was our Bachelor's thesis."
          pl="W międzyczasie stworzyłem również aplikację mobilną w React Native do nawigacji wewnątrz budynków - projekt grupowy dla Szpitala Specjalistycznego w Kościerzynie, była to nasza praca inżynierska."
        /></p>
        <p><T
          en="I like 3D renders (as you can see), simplicity in code and intuitive design."
          pl="Lubię renderowanie 3D (jak widać), prostotę w kodzie i intuicyjny design."
        /></p>
      </div>
      <aside className="about-side">
        <dl>
          <dt><T en="Commercially" pl="Zawodowo" /></dt><dd>{SHIPPED.map(t => <TechTag key={t} name={t} />)}</dd>
          <dt><T en="Personal projects" pl="Projekty własne" /></dt><dd>{SIDE.map(t => <TechTag key={t} name={t} />)}</dd>
          <dt><T en="Mobile" pl="Mobilne" /></dt><dd>{MOBILE.map(t => <TechTag key={t} name={t} />)}</dd>
          <dt><T en="Languages" pl="Języki" /></dt><dd className="about-langs"><T en="English (C1), Polish (native)" pl="Angielski (C1), Polski" /></dd>
        </dl>
      </aside>
    </section>
  )
}
