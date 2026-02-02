import React from 'react';

interface CardProps {
  href?: string;
  title: string;
  description: string;
  tags: string[];
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
}

const Card: React.FC<CardProps> = ({
  href,
  title,
  description,
  tags,
  className = '',
  style,
  ariaLabel
}) => {
  const cardClass = `card ${className}`.trim();
  const commonProps = {
    className: cardClass,
    style,
    'aria-label': ariaLabel
  };

  const content = (
    <>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="tags">
        {tags.map((tag, index) => (
          <span key={index} className="tag">{tag}</span>
        ))}
      </div>
    </>
  );

  if (href) {
    return (
      <a href={href} {...commonProps}>
        {content}
      </a>
    );
  }

  return (
    <div {...commonProps}>
      {content}
    </div>
  );
};

export default Card;