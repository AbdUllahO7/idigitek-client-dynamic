export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export interface CookieConsentData {
  preferences: CookiePreferences;
  timestamp: string;
  version: string; // Added for future compatibility
}

export type CookieCategory = keyof CookiePreferences;

export interface CookieConsentEvent extends CustomEvent {
  detail: CookiePreferences;
}

export interface CookieCategoryInfo {
  key: CookieCategory;
  title: string;
  description: string;
  required: boolean;
}
