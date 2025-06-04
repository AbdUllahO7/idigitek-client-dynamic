"use client";

import { CookieCategory, CookieConsentData, CookiePreferences } from '@/api/types/cookie-consent';
import { useState, useEffect, useCallback } from 'react';

const CONSENT_STORAGE_KEY = 'cookieConsent';
const CONSENT_VERSION = '1.0.0';

interface UseCookieConsentReturn {
  consent: CookiePreferences | null;
  loading: boolean;
  hasConsent: (category: CookieCategory) => boolean;
  resetConsent: () => void;
  updateConsent: (category: CookieCategory, value: boolean) => void;
  isConsentGiven: boolean;
}

export const useCookieConsent = (): UseCookieConsentReturn => {
  const [consent, setConsent] = useState<CookiePreferences | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadConsent = () => {
      try {
        const storedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);
        if (storedConsent) {
          const parsed: CookieConsentData = JSON.parse(storedConsent);
          
          // Check version compatibility
          if (parsed.version === CONSENT_VERSION) {
            setConsent(parsed.preferences);
          } else {
            // Version mismatch, remove old consent
            localStorage.removeItem(CONSENT_STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error('Error loading cookie consent:', error);
        localStorage.removeItem(CONSENT_STORAGE_KEY);
      } finally {
        setLoading(false);
      }
    };

    loadConsent();

    // Listen for consent updates
    const handleConsentUpdate = (event: Event): void => {
      const customEvent = event as CustomEvent<CookiePreferences>;
      setConsent(customEvent.detail);
    };

    window.addEventListener('cookieConsentUpdated', handleConsentUpdate);

    return () => {
      window.removeEventListener('cookieConsentUpdated', handleConsentUpdate);
    };
  }, []);

  const hasConsent = useCallback((category: CookieCategory): boolean => {
    return consent ? consent[category] === true : false;
  }, [consent]);

  const resetConsent = useCallback((): void => {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
    setConsent(null);
    window.location.reload();
  }, []);

  const updateConsent = useCallback((category: CookieCategory, value: boolean): void => {
    if (!consent) return;

    const updatedConsent: CookiePreferences = {
      ...consent,
      [category]: value
    };

    const consentData: CookieConsentData = {
      preferences: updatedConsent,
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION
    };

    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentData));
      setConsent(updatedConsent);

      // Trigger event
      const event = new CustomEvent('cookieConsentUpdated', {
        detail: updatedConsent
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error updating cookie consent:', error);
    }
  }, [consent]);

  const isConsentGiven = consent !== null;

  return {
    consent,
    loading,
    hasConsent,
    resetConsent,
    updateConsent,
    isConsentGiven
  };
};