"use client";

import CookieConsent from '@/components/CookieConsent/CookieConsent';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { CookieAnalytics } from '@/lib/analytics';
import React, { useEffect } from 'react';


interface CookieConsentProviderProps {
  children: React.ReactNode;
}

const CookieConsentProvider: React.FC<CookieConsentProviderProps> = ({ children }) => {
  const { consent, loading } = useCookieConsent();
  const analytics = CookieAnalytics.getInstance();

  useEffect(() => {
    if (!loading && consent) {
      analytics.initializeAnalytics(consent);
    }
  }, [consent, loading, analytics]);

  useEffect(() => {
    if (consent) {
      analytics.updateConsent(consent);
    }
  }, [consent, analytics]);

  return (
    <>
      {children}
      <CookieConsent />
    </>
  );
};

export default CookieConsentProvider;