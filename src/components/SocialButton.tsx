import React, { useState, useEffect, useRef } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

interface SocialButtonProps {
  type: 'link' | 'button';
  href?: string;
  target?: string;
  rel?: string;
  id?: string;
  ariaLabel: string;
  ariaHasPopup?: boolean;
  ariaExpanded?: boolean;
  ariaControls?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

const SocialButton: React.FC<SocialButtonProps> = ({
  type,
  href,
  target,
  rel,
  id,
  ariaLabel,
  ariaHasPopup,
  ariaExpanded,
  ariaControls,
  onClick,
  children
}) => {
  const [isEmailPopoverOpen, setIsEmailPopoverOpen] = useState(false);
  const [copyTooltipVisible, setCopyTooltipVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const copyBtnRef = useRef<HTMLButtonElement>(null);

  const isEmailButton = id === 'email-toggle';

  useEffect(() => {
    if (!isEmailButton) return;

    const toggleBtn = buttonRef.current;
    const pop = popoverRef.current;
    const social = toggleBtn?.parentElement;
    const emailSpan = pop?.querySelector('#email-value') as HTMLSpanElement;
    const copyBtn = pop?.querySelector('#copy-email') as HTMLButtonElement;

    if (!toggleBtn || !pop || !emailSpan || !copyBtn || !social) return;

    function positionPopover() {
      const tb = toggleBtn!.getBoundingClientRect();
      const sb = social!.getBoundingClientRect();
      const left = Math.round(tb.left - sb.left);
      const top = Math.round(tb.bottom - sb.top + 10);
      pop!.style.left = left + 'px';
      pop!.style.top = top + 'px';
    }

    // Close on outside click
    const handleOutsideClick = (e: MouseEvent) => {
      if (!isEmailPopoverOpen) return;
      const target = e.target as Node;
      if (!target) return;
      if (!pop.contains(target) && target !== toggleBtn && !toggleBtn.contains(target)) {
        setIsEmailPopoverOpen(false);
      }
    };

    // Close on Escape
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isEmailPopoverOpen) {
        setIsEmailPopoverOpen(false);
      }
    };

    // Reposition on resize
    const handleResize = () => {
      if (isEmailPopoverOpen) {
        positionPopover();
      }
    };

    // Copy email to clipboard
    const handleCopy = async () => {
      const email = emailSpan.textContent || '';
      try {
        await navigator.clipboard.writeText(email);
        copyBtn.classList.add('copied');
        setCopyTooltipVisible(true);
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          setCopyTooltipVisible(false);
        }, 2000);
      } catch (_) {
        // Fallback
        const range = document.createRange();
        range.selectNodeContents(emailSpan);
        const sel = window.getSelection();
        if (sel) {
          sel.removeAllRanges();
          sel.addRange(range);
          document.execCommand('copy');
          sel.removeAllRanges();
        }
        copyBtn.classList.add('copied');
        setCopyTooltipVisible(true);
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          setCopyTooltipVisible(false);
        }, 2000);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    window.addEventListener('resize', handleResize);

    copyBtn.addEventListener('click', handleCopy);

    // Position when opened
    if (isEmailPopoverOpen) {
      setTimeout(positionPopover, 0);
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('resize', handleResize);
      copyBtn.removeEventListener('click', handleCopy);
    };
  }, [isEmailButton, isEmailPopoverOpen]);

  const handleClick = () => {
    if (isEmailButton) {
      setIsEmailPopoverOpen(!isEmailPopoverOpen);
    } else if (onClick) {
      onClick();
    }
  };

  if (type === 'link') {
    return (
      <a
        ref={buttonRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        id={id}
        aria-label={ariaLabel}
        className='social-btn'
        onClick={handleClick}
      >
        {children}
      </a>
    );
  }

  return (
    <>
      <button
        ref={buttonRef as React.RefObject<HTMLButtonElement>}
        type="button"
        id={id}
        aria-label={ariaLabel}
        aria-haspopup={ariaHasPopup}
        aria-expanded={isEmailButton ? isEmailPopoverOpen : ariaExpanded}
        aria-controls={ariaControls}
        onClick={handleClick}
        className='social-btn'
      >
        {children}
      </button>
      {isEmailButton && (
        <div
          ref={popoverRef}
          className="email-popover"
          id="email-popover"
          role="dialog"
          aria-label="Adres email"
          hidden={!isEmailPopoverOpen}
        >
          <span className="email-text" id="email-value">spryszynskiwiktor@gmail.com</span>
          <Tippy
            content="Skopiowano!"
            visible={copyTooltipVisible}
            onHidden={() => setCopyTooltipVisible(false)}
            placement="top"
            theme="custom"
            arrow={true}
            duration={200}
          >
            <button
              ref={copyBtnRef}
              className="icon-btn"
              id="copy-email"
              type="button"
              aria-label="Kopiuj email"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20">
                <path fill="currentColor" d="M16 1H6C4.9 1 4 1.9 4 3v12h2V3h10V1zm3 4H10c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h9c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H10V7h9v14z"/>
              </svg>
            </button>
          </Tippy>
          <a className="icon-btn" id="send-email" href="mailto:spryszynskiwiktor@gmail.com" aria-label="Wyślij email">
            <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20">
              <path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/>
            </svg>
          </a>
        </div>
      )}
    </>
  );
};

export default SocialButton;