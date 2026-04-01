import { Link } from 'react-router-dom';
import { useState } from 'react';
import { CV_PATHS } from '../constants/cvPaths';
import contentPl from '../content.json';
import contentEn from '../english.json';

const CvPage: React.FC = () => {
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
  const validLangs = languages.map((lang) => lang.code);
  type LangCode = typeof languages[number]['code'];
  const defaultLang = languages[0].code;
  const initialLang = validLangs.includes(langParam as LangCode) ? (langParam as LangCode) : defaultLang;
  const [language, setLanguage] = useState<LangCode>(initialLang);
  const content = contents[language].cv;
  const otherLang = languages.find((lang) => lang.code !== language);

  const changeLanguage = () => {
    if (!otherLang) {
      return;
    }

    const url = new URL(window.location.href);
    url.searchParams.set('lang', otherLang.code);
    window.history.pushState({}, '', url);
    setLanguage(otherLang.code);
  };

  return (
    <main className="container cv-page" role="main">
      <header className="header-bar cv-topbar">
        <div className="brand">
          <div className="name-and-surname">{content.pageTitle}</div>
        </div>
        <nav>
          <button
            onClick={changeLanguage}
            className="language-switch"
            aria-label={`Switch to ${otherLang?.name || 'other language'}`}
          >
            {otherLang?.display || 'EN'}
          </button>
        </nav>
      </header>

      <header className="cv-header">
        <h1>{content.heading}</h1>
        <p>{content.subtitle}</p>
      </header>

      <section className="grid cv-grid" aria-label={content.listAriaLabel}>
        <article className="card cv-card">
          <h2>{content.polish.title}</h2>
          <p>{content.polish.description}</p>
          <div className="actions cv-actions">
            <a className="btn" href={CV_PATHS.pl} target="_blank" rel="noopener noreferrer" aria-label={content.openButtonAriaLabel}>
              {content.openButton}
            </a>
            <a className="btn" href={CV_PATHS.pl} download aria-label={content.downloadButtonAriaLabel}>
              {content.downloadButton}
            </a>
          </div>
        </article>

        <article className="card cv-card">
          <h2>{content.english.title}</h2>
          <p>{content.english.description}</p>
          <div className="actions cv-actions">
            <a className="btn" href={CV_PATHS.en} target="_blank" rel="noopener noreferrer" aria-label={content.openButtonAriaLabel}>
              {content.openButton}
            </a>
            <a className="btn" href={CV_PATHS.en} download aria-label={content.downloadButtonAriaLabel}>
              {content.downloadButton}
            </a>
          </div>
        </article>
      </section>

      <div className="actions">
        <Link className="btn" to={`/?lang=${language}`}>
          {content.backButton}
        </Link>
      </div>
    </main>
  );
};

export default CvPage;
