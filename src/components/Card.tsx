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
  wipTag?: string;
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
    <article className={cardClass} style={style} aria-label={ariaLabel}>
      <h3 className="card-title">{title}</h3>

      <div className="card-stack">
        {(worksInProgress) && <span className="tag wip" aria-label="work-in-progress">{wipTag}</span>}
        {tags.map((tag, index) => (
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
            <a className="card-btn" href={githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a>
          ) : null}
          {demoUrl ? (
            <a className="card-btn" href={demoUrl}>Demo</a>
          ) : null}
        </div>
      ) : null}
    </article>
  );
};

export default Card;
