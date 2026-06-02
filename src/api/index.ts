import axios from 'axios';
import type { Match, Standing, NewsItem } from '../types';
import { MATCHES } from '../data/matches';
import { STANDINGS } from '../data/standings';
import { MOCK_NEWS } from '../data/news';

const api = axios.create({
  // In production use VITE_API_URL env var, in dev use Vite proxy
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api',
  timeout: 8000,
});

async function fetchWithFallback<T>(
  fetcher: () => Promise<T>,
  fallback: T,
  label: string
): Promise<T> {
  try {
    const result = await fetcher();
    // If server returns empty array, use fallback (tournament not started yet)
    if (Array.isArray(result) && result.length === 0) {
      console.info(`[${label}] empty response, using mock data`);
      return fallback;
    }
    return result;
  } catch (err) {
    console.info(`[${label}] fetch failed, using mock data`);
    return fallback;
  }
}

export async function fetchMatches(): Promise<Match[]> {
  return fetchWithFallback(
    async () => {
      const res = await api.get<Match[]>('/matches');
      return res.data;
    },
    MATCHES,
    'matches'
  );
}

export async function fetchStandings(): Promise<Standing[]> {
  return fetchWithFallback(
    async () => {
      const res = await api.get<Standing[]>('/standings');
      return res.data;
    },
    STANDINGS,
    'standings'
  );
}

export async function fetchNews(): Promise<NewsItem[]> {
  return fetchWithFallback(
    async () => {
      const res = await api.get<NewsItem[]>('/news');
      return res.data;
    },
    MOCK_NEWS,
    'news'
  );
}
