import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import './styles/styles.css';
import Card from './components/Card';
import SocialButton from './components/SocialButton';
import contentPl from './content.json';
import contentEn from './english.json';
import LightsAnimation from './LightsAnimation';

function App() {
  const languages = [
    { code: 'pl' as const, name: 'Polski', display: 'PL' },
    { code: 'en' as const, name: 'English', display: 'EN' }
  ];

  const contents = {
    pl: contentPl,
    en: contentEn
  };

  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get('lang');
  const validLangs = languages.map(lang => lang.code);
	type LangCode = typeof languages[number]['code'];
	const defaultLang = languages[0].code;
	const initialLang = validLangs.includes(langParam as LangCode) ? langParam as LangCode : defaultLang;
	const [language, setLanguage] = useState<LangCode>(initialLang);
  const content = contents[language];

  useEffect(() => {
    const container = document.getElementById('lights');
    if (container) {
      const animation = new LightsAnimation(container);
      animation.start();
    }
  }, []);

  return (
    <>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0f1115" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <title>Wiktor Spryszyński - Portfolio</title>
        <meta name="description" content="Portfolio website of Wiktor Spryszyński, software developer." />
      </Helmet>
      <div id="lights" aria-hidden="true"></div>
      <header role="banner">
        <div className="container header-bar">
          <div className="brand" aria-label="Wiktor Spryszyński">
            <div className="name-and-surname">Wiktor Spryszyński</div>
          </div>
          <nav>
            <button
              onClick={() => {
                const otherLang = languages.find(lang => lang.code !== language);
                if (otherLang) {
                  setLanguage(otherLang.code);
                  const url = new URL(window.location.href);
                  url.searchParams.set('lang', otherLang.code);
                  window.history.pushState({}, '', url);
                }
              }}
              className="language-switch"
              aria-label={`Switch to ${languages.find(lang => lang.code !== language)?.name || 'other language'}`}
            >
              {languages.find(lang => lang.code !== language)?.display || 'EN'}
            </button>
          </nav>
        </div>
      </header>

      <main className="container" id="main" role="main">
        <section className="hero" aria-labelledby="hero-title">
					<div id="hero-title" className="visually-hidden">
						<h1>{content.hero.title.hi}<br />{content.hero.title.description}</h1>
					</div>
          <p>{content.hero.subtitle}</p>
          <div className="social social-bar" aria-label={content.hero.socialLabel}>
            <SocialButton
              type="link"
              href="https://www.linkedin.com/in/wiktor-spryszynski"
              target="_blank"
              rel="noopener"
              ariaLabel={content.social.linkedin}
            >
              <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                <defs>
                  <linearGradient id="grad-li" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--accent)" />
                    <stop offset="100%" stopColor="var(--green)" />
                  </linearGradient>
                </defs>
                <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#grad-li)" />
                <text x="12" y="15" textAnchor="middle" fontFamily="Segoe UI, Arial, sans-serif" fontSize="11" fontWeight="700" fill="#0f1115">in</text>
              </svg>
            </SocialButton>
            <SocialButton
              type="link"
              href="https://github.com/wiktorspryszynski"
              target="_blank"
              rel="noopener"
              ariaLabel={content.social.github}
            >
              <svg viewBox="0 0 16 16" role="img" aria-hidden="true">
                <defs>
                  <linearGradient id="grad-gh" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--accent)" />
                    <stop offset="100%" stopColor="var(--green)" />
                  </linearGradient>
                </defs>
                <path fill="url(#grad-gh)" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.31 6.57 5.49 7.62.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38C13.69 14.57 16 11.54 16 8c0-4.42-3.58-8-8-8z"/>
              </svg>
            </SocialButton>
            <SocialButton
              type="button"
              id="email-toggle"
              ariaLabel={content.social.email}
              copyTooltip={content.social.copyTooltip}
            >
              <svg viewBox="0 0 24 28" role="img" aria-hidden="true">
                <defs>
                  <linearGradient id="grad-at" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--accent)" />
                    <stop offset="100%" stopColor="var(--green)" />
                  </linearGradient>
                </defs>
                <text x="12" y="22" textAnchor="middle" fontFamily="Segoe UI, Arial, sans-serif" fontSize="24" fontWeight="500" fill="url(#grad-at)">@</text>
              </svg>
            </SocialButton>

          </div>
        </section>

        <section aria-labelledby="projects-title" id="projekty">
          <h2 className="section-title" id="projects-title">{content.projects.title}</h2>
          <div className="grid">
            {content.projects.cards.map((card, index) => (
              <Card
                key={index}
                href={card.title === "👷 Section under construction 🚧🚧" ? undefined : card.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '.html'}
                title={card.title}
                description={card.description}
                tags={card.tags}
                ariaLabel={card.ariaLabel}
                className={card.title === "👷 Section under construction 🚧🚧" ? "work-in-progress-card" : ""}
                style={card.title === "👷 Section under construction 🚧🚧" ? {border: '2px dashed var(--border)'} : undefined}
              />
            ))}
          </div>
        </section>

        <section aria-labelledby="contact-title" id="kontakt" style={{marginTop: '28px'}}>
          <h2 className="section-title" id="contact-title">{content.contact.title}</h2>
          <p>{content.contact.description}</p>
          <div className="actions">
            <a className="btn" href="mailto:spryszynskiwiktor@gmail.com" aria-label={content.contact.emailLabel}>{content.contact.emailButton}</a>
            <a className="btn" href="#" aria-label={content.contact.githubLabel}>{content.contact.githubButton}</a>
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
