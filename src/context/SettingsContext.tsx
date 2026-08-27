'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { EnvironmentMode } from '@/types/message';

interface SettingsContextType {
  environmentMode: EnvironmentMode;
  isConnected: boolean;
  setMode: (mode: EnvironmentMode) => Promise<boolean>;
  refreshSettings: () => Promise<void>;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType>({
  environmentMode: 'development',
  isConnected: false,
  setMode: async () => false,
  refreshSettings: async () => {},
  isLoading: false,
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [environmentMode, setEnvironmentMode] = useState<EnvironmentMode>('development');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings', { cache: 'no-store' });
      const data = await res.json();
      if (data && data.environmentMode) {
        setEnvironmentMode(data.environmentMode);
        setIsConnected(Boolean(data.isConnected));
        if (typeof window !== 'undefined') {
          localStorage.setItem('line_oa_env_mode', data.environmentMode);
        }
      }
    } catch {
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('line_oa_env_mode') as EnvironmentMode;
        if (cached) setEnvironmentMode(cached);
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('line_oa_env_mode') as EnvironmentMode;
      if (cached) setEnvironmentMode(cached);
    }
    fetchSettings();

    const handleUpdate = () => fetchSettings();
    window.addEventListener('settings-updated', handleUpdate);
    return () => window.removeEventListener('settings-updated', handleUpdate);
  }, []);

  const setMode = async (newMode: EnvironmentMode): Promise<boolean> => {
    setIsLoading(true);
    // 1. Instant optimistic update in memory & localStorage
    setEnvironmentMode(newMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('line_oa_env_mode', newMode);
    }

    try {
      // 2. Persist to server backend .data/settings.json
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ environmentMode: newMode }),
      });

      if (res.ok) {
        window.dispatchEvent(new Event('settings-updated'));
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        environmentMode,
        isConnected,
        setMode,
        refreshSettings: fetchSettings,
        isLoading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useEnvironmentMode() {
  return useContext(SettingsContext);
}
