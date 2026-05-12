interface HeaderBarProps {
  title: string;
  switchDisplay: string;
  switchAriaLabel: string;
  onSwitch: () => void;
  brandAriaLabel?: string;
}

const redirectHome = () => {
  window.location.href = window.location.origin;
}

const updateHomeLinkLight = (event: React.MouseEvent<HTMLDivElement>) => {
  const rect = event.currentTarget.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  event.currentTarget.style.setProperty('--home-light-x', `${x}px`);
  event.currentTarget.style.setProperty('--home-light-y', `${y}px`);
}

const resetHomeLinkLight = (event: React.MouseEvent<HTMLDivElement>) => {
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty('--home-light-x', `${rect.width / 2}px`);
  event.currentTarget.style.setProperty('--home-light-y', `${rect.height / 2}px`);
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  switchDisplay,
  switchAriaLabel,
  onSwitch,
  brandAriaLabel
}) => {
  return (
    <header role="banner">
      <div className="container header-bar">
        <div className="brand" aria-label={brandAriaLabel}>
          <div
            className="name-and-surname"
            id="home-link"
            onClick={redirectHome}
            onMouseEnter={updateHomeLinkLight}
            onMouseMove={updateHomeLinkLight}
            onMouseLeave={resetHomeLinkLight}
          >
            {title}
          </div>
        </div>
        <nav>
          <button
            onClick={onSwitch}
            className="language-switch"
            aria-label={switchAriaLabel}
          >
            {switchDisplay}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default HeaderBar;
