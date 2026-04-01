interface HeaderBarProps {
  title: string;
  switchDisplay: string;
  switchAriaLabel: string;
  onSwitch: () => void;
  brandAriaLabel?: string;
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
          <div className="name-and-surname">{title}</div>
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
