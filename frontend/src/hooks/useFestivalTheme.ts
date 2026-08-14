import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../config/axios';

export interface FestivalTheme {
  key: string;
  name: string;
  date: string;
  emoji: string;
  decoration: string;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    banner_bg: string;
  };
  email_headline: string;
}

const fetchFestivalTheme = async (): Promise<FestivalTheme | null> => {
  const res = await axiosInstance.get('/festival_theme');
  return res.data.data;
};

export function useFestivalTheme() {
  const { data: festival } = useQuery({
    queryKey: ['festival_theme'],
    queryFn: fetchFestivalTheme,
    staleTime: 1000 * 60 * 60, // 1 hour — changes daily, no need to refetch often
    retry: false,
  });

  useEffect(() => {
    if (!festival) {
      // Remove any previously set festival vars
      document.documentElement.removeAttribute('data-festival');
      document.documentElement.style.removeProperty('--festival-primary');
      document.documentElement.style.removeProperty('--festival-secondary');
      document.documentElement.style.removeProperty('--festival-accent');
      document.documentElement.style.removeProperty('--festival-banner-bg');
      return;
    }

    document.documentElement.setAttribute('data-festival', festival.key);
    document.documentElement.style.setProperty('--festival-primary', festival.theme.primary);
    document.documentElement.style.setProperty('--festival-secondary', festival.theme.secondary);
    document.documentElement.style.setProperty('--festival-accent', festival.theme.accent);
    document.documentElement.style.setProperty('--festival-banner-bg', festival.theme.banner_bg);
  }, [festival]);

  return festival ?? null;
}
