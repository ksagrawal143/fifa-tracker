import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchMatches } from '../api';
import { getH2HNormalized } from '../data/h2h';
import { format, parseISO } from 'date-fns';
import MatchSentiment from '../components/MatchSentiment';

function FormDot({ result }: { result: 'W' | 'D' | 'L' }) {
  const colors = { W: 'bg-green-500', D: 'bg-yellow-500', L: 'bg-red-500' };
  return (
    <span className={`w-7 h-7 rounded-full ${colors[result]} flex items-center justify-center text-xs font-bold text-white`}>
      {result}
    </span>
  );
}

// Mock recent form — in production this comes from ESPN API
const FORM: Record<string, Array<'W' | 'D' | 'L'>> = {
  arg: ['W', 'W', 'D', 'W', 'W'],
  usa: ['W', 'L', 'W', 'D', 'W'],
  mex: ['L', 'W', 'L', 'W', 'D'],
  esp: ['W', 'W', 'W', 'D', 'W'],
  ger: ['W', 'D', 'W', 'W', 'L'],
  ned: ['W', 'W', 'D', 'W', 'W'],
  fra: ['W', 'W', 'W', 'L', 'W'],
  bra: ['D', 'W', 'W', 'W', 'D'],
  eng: ['W', 'W', 'D', 'W', 'W'],
  jpn: ['W', 'W', 'L', 'W', 'W'],
  por: ['W', 'W', 'W', 'D', 'W'],
  mar: ['W', 'D', 'W', 'W', 'L'],
};

export default function MatchDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: matches = [], isLoading } = useQuery({ queryKey: ['matches'], queryFn: fetchMatches });
  const match = matches.find(m => m.id === id);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-500">
        Loading match…
      </div>
    );
  }

  if (!match) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 mb-4">Match not found</p>
        <Link to="/matches" className="text-amber-400 hover:underline">← Back to Matches</Link>
      </div>
    );
  }

  const h2h = getH2HNormalized(match.homeTeam.id, match.awayTeam.id);
  const homeForm = FORM[match.homeTeam.id] || ['W', 'D', 'W', 'W', 'L'];
  const awayForm = FORM[match.awayTeam.id] || ['W', 'L', 'W', 'D', 'W'];

  const isLive = match.status === 'live';
  const isFinished = match.status === 'finished';

  // Win % bars
  const totalH2H = h2h ? h2h.team1Wins + h2h.team2Wins + h2h.draws : 0;
  const homeWinPct = totalH2H ? Math.round((h2h!.team1Wins / totalH2H) * 100) : 33;
  const drawPct = totalH2H ? Math.round((h2h!.draws / totalH2H) * 100) : 34;
  const awayWinPct = totalH2H ? 100 - homeWinPct - drawPct : 33;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Back */}
      <Link to="/matches" className="text-xs text-gray-500 hover:text-amber-400 flex items-center gap-1">
        ← All Matches
      </Link>

      {/* Match hero card */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="text-center mb-4">
          <span className="text-xs text-gray-500">
            {match.group ? `Group ${match.group} · ` : ''}{match.stage}
          </span>
          {isLive && (
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="live-dot" />
              <span className="text-red-400 font-bold text-sm">LIVE · {match.minute}'</span>
            </div>
          )}
          {isFinished && <div className="text-gray-500 text-xs mt-1 font-medium">FULL TIME</div>}
          {!isLive && !isFinished && (
            <div className="text-amber-400 text-sm mt-1 font-medium">
              {format(parseISO(`${match.date}T00:00:00`), 'EEEE, MMMM d yyyy')} · {match.time}
            </div>
          )}
        </div>

        {/* Teams + Score */}
        <div className="flex items-center justify-between gap-4 py-4">
          <Link to={`/teams/${match.homeTeam.id}`} className="flex-1 flex flex-col items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-6xl">{match.homeTeam.flag}</span>
            <span className="text-lg font-bold text-white text-center">{match.homeTeam.name}</span>
            <span className="text-xs text-gray-500">{match.homeTeam.shortName}</span>
          </Link>

          <div className="flex flex-col items-center gap-1 min-w-[90px]">
            {match.score ? (
              <div className={`text-4xl font-black ${isLive ? 'text-amber-400' : 'text-white'}`}>
                {match.score.home} – {match.score.away}
              </div>
            ) : (
              <div className="text-2xl font-black text-gray-600">VS</div>
            )}
            <div className="text-xs text-gray-600">📍 {match.city}</div>
            <div className="text-xs text-gray-600 text-center">{match.venue}</div>
          </div>

          <Link to={`/teams/${match.awayTeam.id}`} className="flex-1 flex flex-col items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-6xl">{match.awayTeam.flag}</span>
            <span className="text-lg font-bold text-white text-center">{match.awayTeam.name}</span>
            <span className="text-xs text-gray-500">{match.awayTeam.shortName}</span>
          </Link>
        </div>
      </div>

      {/* Recent Form */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <h2 className="text-sm font-bold text-white mb-4">Recent Form (last 5)</h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 mb-2">{match.homeTeam.shortName}</div>
            <div className="flex gap-1.5">
              {homeForm.map((r, i) => <FormDot key={i} result={r} />)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 mb-2">{match.awayTeam.shortName}</div>
            <div className="flex gap-1.5 justify-end">
              {awayForm.map((r, i) => <FormDot key={i} result={r} />)}
            </div>
          </div>
        </div>
      </div>

      {/* Head to Head */}
      {h2h ? (
        <>
          {/* H2H summary bar */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-4">
              Head to Head · {h2h.played} meetings
            </h2>

            {/* Win bar */}
            <div className="mb-5">
              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                <span className="font-semibold text-white">{h2h.team1Wins} wins</span>
                <span>{h2h.draws} draws</span>
                <span className="font-semibold text-white">{h2h.team2Wins} wins</span>
              </div>
              <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
                <div className="bg-amber-400 rounded-l-full transition-all" style={{ width: `${homeWinPct}%` }} />
                <div className="bg-gray-600 transition-all" style={{ width: `${drawPct}%` }} />
                <div className="bg-blue-500 rounded-r-full transition-all" style={{ width: `${awayWinPct}%` }} />
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>{match.homeTeam.shortName}</span>
                <span>{match.awayTeam.shortName}</span>
              </div>
            </div>

            {/* Goals tally */}
            <div className="grid grid-cols-3 gap-3 text-center mb-2">
              <div className="bg-gray-800 rounded-xl p-3">
                <div className="text-2xl font-bold text-amber-400">{h2h.team1Goals}</div>
                <div className="text-xs text-gray-500 mt-0.5">{match.homeTeam.shortName} goals</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-3">
                <div className="text-2xl font-bold text-white">{h2h.played}</div>
                <div className="text-xs text-gray-500 mt-0.5">Total matches</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-3">
                <div className="text-2xl font-bold text-blue-400">{h2h.team2Goals}</div>
                <div className="text-xs text-gray-500 mt-0.5">{match.awayTeam.shortName} goals</div>
              </div>
            </div>
          </div>

          {/* Last 5 meetings */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-4">Last 5 Meetings</h2>
            <div className="space-y-2">
              {h2h.lastMeetings.slice(0, 5).map((m, i) => {
                const winner = m.team1Score > m.team2Score ? 'home'
                  : m.team2Score > m.team1Score ? 'away' : 'draw';
                return (
                  <div key={i} className="flex items-center justify-between bg-gray-800 rounded-xl px-4 py-3">
                    <div className="text-xs text-gray-500 w-24">
                      {format(parseISO(m.date), 'MMM yyyy')}
                    </div>
                    <div className="text-xs text-gray-500 flex-1 text-center truncate px-2">
                      {m.competition}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold ${winner === 'home' ? 'text-amber-400' : 'text-gray-400'}`}>
                        {match.homeTeam.shortName}
                      </span>
                      <span className="text-sm font-black text-white bg-gray-700 px-3 py-1 rounded-lg">
                        {m.team1Score} – {m.team2Score}
                      </span>
                      <span className={`text-sm font-bold ${winner === 'away' ? 'text-blue-400' : 'text-gray-400'}`}>
                        {match.awayTeam.shortName}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* World Cup meetings */}
          {h2h.wcMeetings.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h2 className="text-sm font-bold text-white mb-4">⚽ World Cup History</h2>
              <div className="space-y-2">
                {h2h.wcMeetings.map((m, i) => {
                  const winner = m.team1Score > m.team2Score ? 'home'
                    : m.team2Score > m.team1Score ? 'away' : 'draw';
                  return (
                    <div key={i} className="flex items-center justify-between bg-gradient-to-r from-amber-950/30 to-gray-800 border border-amber-800/30 rounded-xl px-4 py-3">
                      <div className="text-xs text-gray-400 w-24">
                        {format(parseISO(m.date), 'MMM yyyy')}
                      </div>
                      <div className="text-xs text-amber-400/80 flex-1 text-center truncate px-2">
                        {m.stage || m.competition}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-bold ${winner === 'home' ? 'text-amber-400' : 'text-gray-400'}`}>
                          {match.homeTeam.shortName}
                        </span>
                        <span className="text-sm font-black text-white bg-amber-900/50 border border-amber-700/40 px-3 py-1 rounded-lg">
                          {m.team1Score} – {m.team2Score}
                        </span>
                        <span className={`text-sm font-bold ${winner === 'away' ? 'text-blue-400' : 'text-gray-400'}`}>
                          {match.awayTeam.shortName}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Fun facts */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-4">📊 Did You Know?</h2>
            <div className="space-y-3">
              {h2h.funFacts.map((fact, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="text-amber-400 font-bold text-sm mt-0.5 shrink-0">{i + 1}.</span>
                  <p className="text-sm text-gray-300 leading-relaxed">{fact}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        // No H2H data — show a placeholder
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">📊</div>
          <p className="text-gray-400 text-sm">Head-to-head data coming soon for this fixture</p>
        </div>
      )}

      {/* Audience Sentiment */}
      <MatchSentiment match={match} />

      {/* View squads CTA */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          to={`/teams/${match.homeTeam.id}`}
          className="bg-gray-900 border border-gray-800 hover:border-amber-400/50 rounded-xl p-4 flex items-center gap-3 transition-colors"
        >
          <span className="text-3xl">{match.homeTeam.flag}</span>
          <div>
            <div className="text-xs text-gray-500">View squad</div>
            <div className="text-sm font-semibold text-white">{match.homeTeam.name}</div>
          </div>
        </Link>
        <Link
          to={`/teams/${match.awayTeam.id}`}
          className="bg-gray-900 border border-gray-800 hover:border-amber-400/50 rounded-xl p-4 flex items-center gap-3 transition-colors"
        >
          <span className="text-3xl">{match.awayTeam.flag}</span>
          <div>
            <div className="text-xs text-gray-500">View squad</div>
            <div className="text-sm font-semibold text-white">{match.awayTeam.name}</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
