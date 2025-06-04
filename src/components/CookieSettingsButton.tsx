import React from 'react';
import { useCookieConsent } from '../hooks/useCookieConsent';

interface CookieSettingsButtonProps {
  className?: string;
  children?: React.ReactNode;
}

const CookieSettingsButton: React.FC<CookieSettingsButtonProps> = ({ 
  className = '', 
  children = 'Cookie Settings' 
}) => {
  const { resetConsent } = useCookieConsent();

  return (
    <button 
      onClick={resetConsent}
      className={className}
      type="button"
    >
      {children}
    </button>
  );
};

export default CookieSettingsButton;
