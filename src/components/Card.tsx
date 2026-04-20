import React from 'react';

interface CardProps {
  title: string;
  description: string;
  stack: string[];
  imageUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
  underConstruction?: boolean;
  worksInProgress?: boolean;
  wipTag?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  stack,
  imageUrl,
  githubUrl,
  demoUrl,
  className = '',
  style,
  ariaLabel,
  underConstruction = false,
  worksInProgress = false,
  wipTag = 'Work in progress'
}) => {
  let cardClass = `card`;
  let isShowcaseable = true;

  if (className) {
    cardClass += ` ${className}`;
  }

  if (worksInProgress) {
    cardClass += ' project-wip-card';
  }
  
  if (underConstruction) {
    cardClass += ' under-construction-card';
    isShowcaseable = false;
  }

  if (isShowcaseable) {
    cardClass += ' showcaseable-project-card';
  }

  return (
    <article
      className={cardClass}
      style={demoUrl ? { ...style, cursor: 'pointer' } : style}
      aria-label={ariaLabel}
      onClick={demoUrl ? () => window.open(demoUrl, '_blank', 'noopener,noreferrer') : undefined}
    >
      <h3 className="card-title">{title}</h3>

      {worksInProgress && (
        <span className="card-wip-badge tag wip" aria-label="work-in-progress">{wipTag}</span>
      )}

      <div className="card-stack">
        {stack.map((tag, index) => (
          <span key={index} className="tag">{tag}</span>
        ))}
      </div>

      <p className="card-description">{description}</p>

      {imageUrl ? (
        <img className="card-image" src={imageUrl} alt={`${title} preview`} loading="lazy" />
      ) : null}

      {(githubUrl || demoUrl) ? (
        <div className="card-actions">
          {githubUrl ? (
            <a className="card-btn" href={githubUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
              <svg viewBox="0 0 16 16" width="15" height="15" fill="currentColor" aria-hidden="true">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              GitHub
            </a>
          ) : null}
          {demoUrl ? (
            <a className="card-btn" href={demoUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
              <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{position: 'relative', top: '1px'}}>
                <path d="M6 2H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V9"/>
                <polyline points="10 1 14 1 14 5"/>
                <line x1="6.5" y1="9" x2="14" y2="1"/>
              </svg>
              Demo
            </a>
          ) : null}
        </div>
      ) : null}
    </article>
  );
};

export default Card;
