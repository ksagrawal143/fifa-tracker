export interface Poll {
  id: string;
  question: string;
  options: string[];
  category: 'tournament' | 'player' | 'team' | 'fun';
  emoji: string;
}

export const POLLS: Poll[] = [
  {
    id: 'wc-winner',
    question: 'Who will win the 2026 FIFA World Cup?',
    options: ['🇦🇷 Argentina', '🇫🇷 France', '🇧🇷 Brazil', '🇪🇸 Spain', '🇩🇪 Germany', '🏴󠁧󠁢󠁥󠁮󠁧󠁿 England'],
    category: 'tournament',
    emoji: '🏆',
  },
  {
    id: 'golden-boot',
    question: 'Who will win the Golden Boot?',
    options: ['Kylian Mbappé', 'Lionel Messi', 'Harry Kane', 'Vinícius Jr', 'Erling Haaland', 'Cristiano Ronaldo'],
    category: 'player',
    emoji: '👟',
  },
  {
    id: 'best-player',
    question: 'Who will be the best player of the tournament?',
    options: ['Jude Bellingham', 'Pedri', 'Jamal Musiala', 'Lamine Yamal', 'Rodri', 'Alexis Mac Allister'],
    category: 'player',
    emoji: '⭐',
  },
  {
    id: 'biggest-surprise',
    question: 'Which team will be the biggest surprise?',
    options: ['🇲🇦 Morocco', '🇯🇵 Japan', '🇺🇸 USA', '🇵🇹 Portugal', '🇳🇱 Netherlands', '🇲🇽 Mexico'],
    category: 'team',
    emoji: '😲',
  },
  {
    id: 'final',
    question: 'Who will play in the final?',
    options: ['ARG vs FRA', 'BRA vs ENG', 'ESP vs GER', 'ARG vs BRA', 'FRA vs BRA', 'ENG vs ESP'],
    category: 'tournament',
    emoji: '🥇',
  },
  {
    id: 'most-goals',
    question: 'Which group will have the most goals?',
    options: ['Group A', 'Group B', 'Group C', 'Group D', 'Group E', 'Group F'],
    category: 'fun',
    emoji: '⚽',
  },
];
