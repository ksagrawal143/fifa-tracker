import type { Match } from '../types';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface Props { match: Match; compact?: boolean }

export default function MatchCard({ match, compact = false }: Props) {
  const isLive = match.status === 'live';
  const isFinished = match.status === 'finished';

  return (
    <Link to={`/matches/${match.id}`} className={`block bg-gray-900 rounded-xl border border-gray-800 hover:border-amber-400/50 hover:bg-gray-800/50 transition-all cursor-pointer ${compact ? 'p-3' : 'p-4'}`}>
      {/* Stage + Status */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-500">{match.group ? `Group ${match.group}` : match.stage}</span>
        {isLive ? (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-red-400">
            <span className="live-dot" /> LIVE {match.minute}'
          </span>
        ) : isFinished ? (
          <span className="text-xs text-gray-500 font-medium">FT</span>
        ) : (
          <span className="text-xs text-amber-400 font-medium">
            {format(new Date(`${match.date}T${match.time}`), 'MMM d, HH:mm')}
          </span>
        )}
      </div>

      {/* Teams + Score */}
      <div className="flex items-center justify-between gap-4">
        {/* Home */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <span className="text-3xl">{match.homeTeam.flag}</span>
          <span className={`text-sm font-semibold ${isLive ? 'text-white' : 'text-gray-300'}`}>
            {compact ? match.homeTeam.shortName : match.homeTeam.name}
          </span>
        </div>

        {/* Score / VS */}
        <div className="flex flex-col items-center min-w-[60px]">
          {match.score ? (
            <div className={`text-2xl font-bold ${isLive ? 'text-amber-400' : 'text-white'}`}>
              {match.score.home} – {match.score.away}
            </div>
          ) : (
            <span className="text-lg font-bold text-gray-600">VS</span>
          )}
        </div>

        {/* Away */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <span className="text-3xl">{match.awayTeam.flag}</span>
          <span className={`text-sm font-semibold ${isLive ? 'text-white' : 'text-gray-300'}`}>
            {compact ? match.awayTeam.shortName : match.awayTeam.name}
          </span>
        </div>
      </div>

      {/* Venue */}
      {!compact && (
        <div className="mt-3 text-center text-xs text-gray-600">
          📍 {match.venue}, {match.city}
        </div>
      )}
      {!compact && (
        <div className="mt-2 text-center text-xs text-amber-500/60 font-medium">
          Tap for head-to-head →
        </div>
      )}
    </Link>
  );
}
