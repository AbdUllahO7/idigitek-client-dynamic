"use client";

import { useCookieConsent } from '@/hooks/useCookieConsent';
import React from 'react';

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
      aria-label="Open cookie settings"
    >
      {children}
    </button>
  );
};

export default CookieSettingsButton;
