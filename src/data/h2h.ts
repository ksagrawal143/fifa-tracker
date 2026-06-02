export interface H2HRecord {
  team1: string; // team id
  team2: string;
  played: number;
  team1Wins: number;
  team2Wins: number;
  draws: number;
  team1Goals: number;
  team2Goals: number;
  lastMeetings: Meeting[];
  wcMeetings: Meeting[];
  funFacts: string[];
}

export interface Meeting {
  date: string;
  competition: string;
  team1Score: number;
  team2Score: number;
  stage?: string;
}

const H2H_DATA: H2HRecord[] = [
  {
    team1: 'usa',
    team2: 'arg',
    played: 12,
    team1Wins: 2,
    team2Wins: 8,
    draws: 2,
    team1Goals: 12,
    team2Goals: 28,
    lastMeetings: [
      { date: '2016-11-15', competition: 'Friendly', team1Score: 0, team2Score: 0 },
      { date: '2011-06-25', competition: 'Copa América', team1Score: 1, team2Score: 4 },
      { date: '2008-05-26', competition: 'Friendly', team1Score: 0, team2Score: 0 },
      { date: '1995-03-04', competition: 'Friendly', team1Score: 3, team2Score: 0 },
      { date: '1993-07-04', competition: 'Copa América', team1Score: 0, team2Score: 2 },
    ],
    wcMeetings: [],
    funFacts: [
      'Argentina have never lost to USA at a FIFA World Cup',
      'Lionel Messi has scored in 3 of his last 4 games against CONCACAF opposition',
      'USA\'s only win vs Argentina came in 1995 — a 3-0 friendly victory',
      'Argentina have scored 28 goals in 12 meetings — an average of 2.3 per game',
      'This is the first ever World Cup meeting between these two nations',
      'Messi is playing his 5th and likely final World Cup at age 37',
    ],
  },
  {
    team1: 'mex',
    team2: 'esp',
    played: 18,
    team1Wins: 4,
    team2Wins: 9,
    draws: 5,
    team1Goals: 22,
    team2Goals: 34,
    lastMeetings: [
      { date: '2022-11-22', competition: 'Friendly', team1Score: 0, team2Score: 1 },
      { date: '2021-07-01', competition: 'Olympic QF', team1Score: 0, team2Score: 0 },
      { date: '2010-06-17', competition: 'World Cup R16', team1Score: 0, team2Score: 1 },
      { date: '2006-05-26', competition: 'Friendly', team1Score: 0, team2Score: 1 },
      { date: '1998-12-13', competition: 'Friendly', team1Score: 0, team2Score: 2 },
    ],
    wcMeetings: [
      { date: '2010-06-17', competition: 'World Cup 2010 R16', team1Score: 0, team2Score: 1, stage: 'Round of 16' },
    ],
    funFacts: [
      'Spain eliminated Mexico in the 2010 World Cup Round of 16',
      'Lamine Yamal (16) is younger than the 2010 WC trophy itself — Spain won it that year',
      'Mexico have not beaten Spain in their last 8 meetings',
      'Spain\'s 2024 Euro squad featured 7 players under 23 — the youngest ever to win the tournament',
      'Guillermo Ochoa is playing his 6th World Cup for Mexico at age 38',
    ],
  },
  {
    team1: 'ger',
    team2: 'ned',
    played: 43,
    team1Wins: 20,
    team2Wins: 13,
    draws: 10,
    team1Goals: 78,
    team2Goals: 62,
    lastMeetings: [
      { date: '2023-11-18', competition: 'Friendly', team1Score: 2, team2Score: 1 },
      { date: '2022-09-26', competition: 'UEFA NL', team1Score: 1, team2Score: 0 },
      { date: '2021-03-25', competition: 'WC Qualifier', team1Score: 2, team2Score: 4 },
      { date: '2012-10-12', competition: 'WC Qualifier', team1Score: 3, team2Score: 0 },
      { date: '2011-11-15', competition: 'Friendly', team1Score: 3, team2Score: 0 },
    ],
    wcMeetings: [
      { date: '1990-06-24', competition: 'World Cup 1990 SF', team1Score: 2, team2Score: 1, stage: 'Semi-final' },
      { date: '1974-07-07', competition: 'World Cup 1974 Final', team1Score: 2, team2Score: 1, stage: 'Final' },
    ],
    funFacts: [
      'West Germany beat Netherlands 2-1 in the 1974 World Cup Final on home soil',
      'Germany knocked Netherlands out in the 1990 World Cup semi-finals',
      'Jamal Musiala and Xavi Simons are close friends from their time at Bayern Munich together',
      'The Bundesliga features 6 Dutch players who will face their German teammates at this World Cup',
      'Netherlands\' last WC win over Germany was in their legendary 1988 Euro semi-final (2-1)',
      'This is one of international football\'s most iconic rivalries — 43 meetings since 1956',
    ],
  },
  {
    team1: 'fra',
    team2: 'bra',
    played: 14,
    team1Wins: 5,
    team2Wins: 6,
    draws: 3,
    team1Goals: 22,
    team2Goals: 24,
    lastMeetings: [
      { date: '2023-03-27', competition: 'Friendly', team1Score: 4, team2Score: 2 },
      { date: '2013-06-09', competition: 'Friendly', team1Score: 0, team2Score: 3 },
      { date: '2011-11-09', competition: 'Friendly', team1Score: 1, team2Score: 0 },
      { date: '2004-11-16', competition: 'Friendly', team1Score: 0, team2Score: 0 },
      { date: '1997-06-03', competition: 'Friendly', team1Score: 1, team2Score: 1 },
    ],
    wcMeetings: [
      { date: '2006-07-01', competition: 'World Cup 2006 QF', team1Score: 1, team2Score: 0, stage: 'Quarter-final' },
      { date: '1998-07-12', competition: 'World Cup 1998 SF', team1Score: 1, team2Score: 1, stage: 'Semi-final' },
    ],
    funFacts: [
      'France knocked Brazil out in the 1998 World Cup semi-finals (1-1 AET, 4-3 pens) on home soil',
      'Zidane scored twice against Brazil in the 1998 World Cup Final',
      'France beat Brazil 1-0 in the 2006 QF — Thierry Henry scoring the only goal',
      'Mbappé vs Vinícius Jr is being called the greatest rivalry of the next decade',
      'Both teams have won the World Cup twice — France (1998, 2018), Brazil (1958, 62, 70, 94, 2002)',
      'Mbappé and Vinícius Jr are Real Madrid teammates — now international rivals',
    ],
  },
  {
    team1: 'eng',
    team2: 'jpn',
    played: 5,
    team1Wins: 3,
    team2Wins: 1,
    draws: 1,
    team1Goals: 8,
    team2Goals: 5,
    lastMeetings: [
      { date: '2010-05-30', competition: 'Friendly', team1Score: 2, team2Score: 1 },
      { date: '2004-06-01', competition: 'Friendly', team1Score: 1, team2Score: 1 },
      { date: '1995-06-03', competition: 'Umbro Cup', team1Score: 2, team2Score: 1 },
      { date: '1993-06-09', competition: 'Kirin Cup', team1Score: 0, team2Score: 2 },
      { date: '1992-05-14', competition: 'Friendly', team1Score: 2, team2Score: 0 },
    ],
    wcMeetings: [],
    funFacts: [
      'Japan\'s only win over England came in the 1993 Kirin Cup — a 2-0 victory',
      'England have never met Japan at a World Cup',
      'Japan eliminated Germany AND Spain at the 2022 World Cup in arguably the biggest upset',
      'Jude Bellingham\'s Real Madrid teammate Takefusa Kubo will face him in this fixture',
      'Japan have won all 3 of their last competitive matches against European opposition',
      'Harry Kane needs 2 goals to become England\'s all-time leading scorer at World Cups',
    ],
  },
  {
    team1: 'por',
    team2: 'mar',
    played: 8,
    team1Wins: 5,
    team2Wins: 2,
    draws: 1,
    team1Goals: 16,
    team2Goals: 9,
    lastMeetings: [
      { date: '2022-12-10', competition: 'World Cup 2022 QF', team1Score: 0, team2Score: 1 },
      { date: '2018-06-20', competition: 'World Cup 2018 Group', team1Score: 1, team2Score: 0 },
      { date: '2015-03-28', competition: 'Friendly', team1Score: 3, team2Score: 0 },
      { date: '2010-05-31', competition: 'Friendly', team1Score: 3, team2Score: 1 },
      { date: '2005-08-17', competition: 'Friendly', team1Score: 0, team2Score: 1 },
    ],
    wcMeetings: [
      { date: '2022-12-10', competition: 'World Cup 2022 QF', team1Score: 0, team2Score: 1, stage: 'Quarter-final' },
      { date: '2018-06-20', competition: 'World Cup 2018 Group B', team1Score: 1, team2Score: 0, stage: 'Group Stage' },
    ],
    funFacts: [
      'Morocco sensationally knocked out Portugal 1-0 in the 2022 World Cup quarter-finals',
      'Youssef En-Nesyri\'s header eliminated Ronaldo and ended Portugal\'s 2022 campaign',
      'Morocco became the first African nation to reach a World Cup semi-final in 2022',
      'Ronaldo was benched for Portugal\'s 2022 QF loss to Morocco — a controversial decision',
      'Achraf Hakimi and his PSG teammate João Cancelo will face each other in this match',
      'Portugal seek revenge for their historic 2022 quarter-final elimination',
    ],
  },
];

export function getH2H(team1Id: string, team2Id: string): H2HRecord | undefined {
  return H2H_DATA.find(
    h => (h.team1 === team1Id && h.team2 === team2Id) ||
         (h.team1 === team2Id && h.team2 === team1Id)
  );
}

// Normalize so team1 always matches the home team passed in
export function getH2HNormalized(homeId: string, awayId: string): H2HRecord | undefined {
  const record = getH2H(homeId, awayId);
  if (!record) return undefined;
  if (record.team1 === homeId) return record;
  // Flip it
  return {
    ...record,
    team1: record.team2,
    team2: record.team1,
    team1Wins: record.team2Wins,
    team2Wins: record.team1Wins,
    team1Goals: record.team2Goals,
    team2Goals: record.team1Goals,
    lastMeetings: record.lastMeetings.map(m => ({
      ...m,
      team1Score: m.team2Score,
      team2Score: m.team1Score,
    })),
    wcMeetings: record.wcMeetings.map(m => ({
      ...m,
      team1Score: m.team2Score,
      team2Score: m.team1Score,
    })),
  };
}
