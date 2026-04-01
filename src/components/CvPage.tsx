import { Link } from 'react-router-dom';
import { useState } from 'react';
import { CV_PATHS } from '../constants/cvPaths';
import HeaderBar from './HeaderBar';
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

  const openCv = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLElement>, url: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openCv(url);
    }
  };

  return (
    <>
      <HeaderBar
        title="Wiktor Spryszyński"
        switchDisplay={otherLang?.display || 'EN'}
        switchAriaLabel={`Switch to ${otherLang?.name || 'other language'}`}
        onSwitch={changeLanguage}
      />

      <main className="container cv-page" role="main">
        <section className="cv-header">
          <h1>{content.heading}</h1>
          <p>{content.subtitle}</p>
        </section>

        <section className="grid cv-grid" aria-label={content.listAriaLabel}>
          <article
            className="card cv-card cv-card-clickable"
            role="link"
            tabIndex={0}
            aria-label={`${content.polish.title} - ${content.openButtonAriaLabel}`}
            onClick={() => openCv(CV_PATHS.pl)}
            onKeyDown={(event) => handleCardKeyDown(event, CV_PATHS.pl)}
          >
            <div className="cv-card-content">
              <h2>{content.polish.title}</h2>
            </div>
            <div className="actions cv-actions">
              <a
                className="icon-btn cv-open-btn"
                href={CV_PATHS.pl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={content.openButtonAriaLabel}
                title={content.openButton}
                onClick={(event) => event.stopPropagation()}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20">
                  <path fill="currentColor" d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3z" />
                  <path fill="currentColor" d="M5 5h6V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-6h-2v6H5V5z" />
                </svg>
              </a>
              <a
                className="icon-btn cv-download-btn"
                href={CV_PATHS.pl}
                download
                aria-label={content.downloadButtonAriaLabel}
                title={content.downloadButton}
                onClick={(event) => event.stopPropagation()}
              >
                <span className="material-symbols-rounded cv-download-icon" aria-hidden="true">download</span>
              </a>
            </div>
          </article>

          <article
            className="card cv-card cv-card-clickable"
            role="link"
            tabIndex={0}
            aria-label={`${content.english.title} - ${content.openButtonAriaLabel}`}
            onClick={() => openCv(CV_PATHS.en)}
            onKeyDown={(event) => handleCardKeyDown(event, CV_PATHS.en)}
          >
            <div className="cv-card-content">
              <h2>{content.english.title}</h2>
            </div>
            <div className="actions cv-actions">
              <a
                className="icon-btn cv-open-btn"
                href={CV_PATHS.en}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={content.openButtonAriaLabel}
                title={content.openButton}
                onClick={(event) => event.stopPropagation()}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20">
                  <path fill="currentColor" d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3z" />
                  <path fill="currentColor" d="M5 5h6V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-6h-2v6H5V5z" />
                </svg>
              </a>
              <a
                className="icon-btn cv-download-btn"
                href={CV_PATHS.en}
                download
                aria-label={content.downloadButtonAriaLabel}
                title={content.downloadButton}
                onClick={(event) => event.stopPropagation()}
              >
                <span className="material-symbols-rounded cv-download-icon" aria-hidden="true">download</span>
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
    </>
  );
};

export default CvPage;
