export interface Team {
  id: string;
  name: string;
  shortName: string;
  flag: string;
  group: string;
  confederation: string;
  coach: string;
  players: Player[];
}

export interface Player {
  id: string;
  name: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  age: number;
  club: string;
  number: number;
  caps: number;
  goals: number;
}

export interface Match {
  id: string;
  homeTeam: TeamRef;
  awayTeam: TeamRef;
  date: string;
  time: string;
  venue: string;
  city: string;
  stage: string;
  group?: string;
  status: 'upcoming' | 'live' | 'finished';
  score?: { home: number; away: number };
  minute?: number;
}

export interface TeamRef {
  id: string;
  name: string;
  shortName: string;
  flag: string;
}

export interface Standing {
  team: TeamRef;
  group: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
  category: 'general' | 'match' | 'squad' | 'injury' | 'transfer';
}
