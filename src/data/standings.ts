import type { Standing } from '../types';

export const STANDINGS: Standing[] = [
  // Group A
  { team: { id: 'arg', name: 'Argentina', shortName: 'ARG', flag: '🇦🇷' }, group: 'A', played: 1, won: 1, drawn: 0, lost: 0, goalsFor: 2, goalsAgainst: 1, points: 3 },
  { team: { id: 'usa', name: 'United States', shortName: 'USA', flag: '🇺🇸' }, group: 'A', played: 1, won: 0, drawn: 0, lost: 1, goalsFor: 1, goalsAgainst: 2, points: 0 },
  // Group B
  { team: { id: 'esp', name: 'Spain', shortName: 'ESP', flag: '🇪🇸' }, group: 'B', played: 1, won: 1, drawn: 0, lost: 0, goalsFor: 3, goalsAgainst: 1, points: 3 },
  { team: { id: 'mex', name: 'Mexico', shortName: 'MEX', flag: '🇲🇽' }, group: 'B', played: 1, won: 0, drawn: 0, lost: 1, goalsFor: 1, goalsAgainst: 3, points: 0 },
  // Group C
  { team: { id: 'ger', name: 'Germany', shortName: 'GER', flag: '🇩🇪' }, group: 'C', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
  { team: { id: 'ned', name: 'Netherlands', shortName: 'NED', flag: '🇳🇱' }, group: 'C', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
  // Group D
  { team: { id: 'fra', name: 'France', shortName: 'FRA', flag: '🇫🇷' }, group: 'D', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
  // Group E
  { team: { id: 'bra', name: 'Brazil', shortName: 'BRA', flag: '🇧🇷' }, group: 'E', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
  // Group F
  { team: { id: 'por', name: 'Portugal', shortName: 'POR', flag: '🇵🇹' }, group: 'F', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
  { team: { id: 'jpn', name: 'Japan', shortName: 'JPN', flag: '🇯🇵' }, group: 'F', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
  // Group G
  { team: { id: 'eng', name: 'England', shortName: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' }, group: 'G', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
  // Group H
  { team: { id: 'mar', name: 'Morocco', shortName: 'MAR', flag: '🇲🇦' }, group: 'H', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
];

export const GROUPS_WITH_STANDINGS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
