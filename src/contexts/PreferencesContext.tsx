import { createContext, useContext, useEffect, useState } from 'react';

type Language = 'en' | 'ta';
type ThemeMode = 'system' | 'light' | 'dark';

interface PreferencesContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

const STORAGE_KEY = 'storyseed_preferences';

const getSystemTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

export const PreferencesProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');
  // Default to light theme so the app starts in light mode even if the OS is dark
  const [theme, setThemeState] = useState<ThemeMode>('light');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.language) setLanguageState(parsed.language);
        if (parsed.theme) setThemeState(parsed.theme);
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist preferences to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          language,
          theme,
        }),
      );
    } catch {
      // ignore
    }
  }, [language, theme]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
  };

  return (
    <PreferencesContext.Provider value={{ language, setLanguage, theme, setTheme }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used within PreferencesProvider');
  return ctx;
};


