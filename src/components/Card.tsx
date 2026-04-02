import React from 'react';

interface CardProps {
  title: string;
  description: string;
  tags: string[];
  imageUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
  underConstruction?: boolean;
  worksInProgress?: boolean;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  tags,
  imageUrl,
  githubUrl,
  demoUrl,
  className = '',
  style,
  ariaLabel,
  underConstruction = false,
  worksInProgress = false
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
    <article className={cardClass} style={style} aria-label={ariaLabel}>
      <h3 className="card-title">{title}</h3>

      <div className="card-stack">
        {(worksInProgress) && <span className="tag" aria-label="Work in progress">WIP</span>}
        {tags.map((tag, index) => (
          <span key={index} className="tag">{tag}</span>
        ))}
      </div>

      <p className="card-description">{description}</p>

      {imageUrl ? (
        <img className="card-image" src={imageUrl} alt={`${title} preview`} loading="lazy" />
      ) : null}

      <div className="card-actions">
        {githubUrl ? (
          <a className="card-btn" href={githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a>
        ) : (
          <span className="card-btn card-btn-disabled" aria-disabled="true">GitHub</span>
        )}
        {demoUrl ? (
          <a className="card-btn" href={demoUrl}>Demo</a>
        ) : (
          <span className="card-btn card-btn-disabled" aria-disabled="true">Demo</span>
        )}
      </div>
    </article>
  );
};

export default Card;
