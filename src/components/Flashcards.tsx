import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import flashcardsData from '../flashcards.json';

interface Flashcard {
  number?: number | string;
  question: string;
  answer: string;
}

const Flashcards: React.FC = () => {
  const flashcards: Flashcard[] = flashcardsData;
  const [hideAnswers, setHideAnswers] = useState(false);
  const [shownAnswers, setShownAnswers] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [randomIndex, setRandomIndex] = useState<number | null>(null);

  const handleHideToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.checked;
    setHideAnswers(nextValue);
    if (!nextValue) {
      setShownAnswers(new Set());
    }
  };

  const toggleAnswer = (index: number) => {
    const newShown = new Set(shownAnswers);
    if (newShown.has(index)) {
      newShown.delete(index);
    } else {
      newShown.add(index);
    }
    setShownAnswers(newShown);
  };

  useEffect(() => {
    document.body.classList.add('flashcards-page');
    return () => {
      document.body.classList.remove('flashcards-page');
    };
  }, []);

  useEffect(() => {
    setRandomIndex(null);
  }, [searchQuery]);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredFlashcards = flashcards
    .map((card, index) => ({ card, index }))
    .filter(({ card, index }) => {
    if (!normalizedQuery) {
      return true;
    }
    const indexLabel = String(card.number ?? index + 1);
    const questionText = card.question.toLowerCase();
    const answerText = card.answer.toLowerCase();
    return (
      indexLabel.includes(normalizedQuery) ||
      questionText.includes(normalizedQuery) ||
      answerText.includes(normalizedQuery)
    );
  });

  const visibleFlashcards = randomIndex === null
    ? filteredFlashcards
    : filteredFlashcards.filter((item) => item.index === randomIndex);

  const handleRandomCard = () => {
    if (filteredFlashcards.length === 0) {
      return;
    }
    const availableIndices = filteredFlashcards.map((item) => item.index);
    let nextIndex = availableIndices[
      Math.floor(Math.random() * availableIndices.length)
    ];

    if (randomIndex !== null && availableIndices.length > 1) {
      while (nextIndex === randomIndex) {
        nextIndex = availableIndices[
          Math.floor(Math.random() * availableIndices.length)
        ];
      }
    }

    setRandomIndex(nextIndex);
  };

  return (
    <div className="container">
      <Helmet>
        <title>Fiszki</title>
        <meta name="theme-color" content="#0F1115" />
      </Helmet>
      <div className="flashcards-header">
        <h1>Fiszki</h1>
        <label className="flashcards-search">
          <span className="visually-hidden">Szukaj fiszek</span>
          <span className="search-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M10.5 3a7.5 7.5 0 0 1 5.9 12.1l4 4a1 1 0 1 1-1.4 1.4l-4-4A7.5 7.5 0 1 1 10.5 3zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11z" />
            </svg>
          </span>
          <input
            type="search"
            placeholder="Szukaj po numerze, pytaniu, odpowiedzi"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </label>
        <button
          className="flashcards-random"
          onClick={handleRandomCard}
          aria-label={randomIndex === null ? 'Losowa fiszka' : 'Wszystkie fiszki'}
          title={randomIndex === null ? 'Losowa fiszka' : 'Wszystkie fiszki'}
        >
          losuj
        </button>
        <label className="switch">
          <span className="switch-label">Ukrywaj odpowiedzi</span>
          <input
            type="checkbox"
            checked={hideAnswers}
            onChange={handleHideToggle}
          />
          <span className="switch-slider" aria-hidden="true"></span>
        </label>
      </div>
      <div className="flashcards">
        {visibleFlashcards.map(({ card, index }) => (
          <div key={index} className="flashcard">
            <a
              className="google-btn"
              href={`https://www.google.com/search?q=${encodeURIComponent(card.question)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Search on Google"
              title="Search on Google"
            >
              <svg
                className="google-icon"
                viewBox="0 0 48 48"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M24 20.5v7.2h10.1c-.4 2.2-2.6 6.4-10.1 6.4-6.1 0-11.1-5-11.1-11.1s5-11.1 11.1-11.1c3.5 0 5.9 1.5 7.2 2.8l4.9-4.7C33 5.1 29 3.5 24 3.5 13.4 3.5 4.8 12.1 4.8 22.7S13.4 41.9 24 41.9c11.5 0 19.1-8.1 19.1-19.5 0-1.3-.1-2.3-.3-3.4H24z" />
              </svg>
            </a>
            <h3>{card.number ?? index + 1}. {card.question}</h3>
            {(!hideAnswers || shownAnswers.has(index)) && (
              <div>
                <p>{card.answer}</p>
              </div>
            )}
            {hideAnswers && !shownAnswers.has(index) && (
              <button onClick={() => toggleAnswer(index)}>Pokaż odpowiedź</button>
            )}
          </div>
        ))}
        {visibleFlashcards.length === 0 && (
          <div className="flashcards-empty">Brak fiszek do wyświetlenia.</div>
        )}
        {randomIndex !== null && visibleFlashcards.length > 0 && (
          <button
            className="flashcards-show-all"
            onClick={() => setRandomIndex(null)}
          >
            Pokaż wszystkie fiszki
          </button>
        )}
      </div>
    </div>
  );
};

export default Flashcards;