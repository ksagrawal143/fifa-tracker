import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Match } from '../types';

type Pick = 'home' | 'draw' | 'away';

interface VoteStore {
  home: number;
  draw: number;
  away: number;
}

// Generate stable seed votes from match id so polls feel populated
function seedVotes(matchId: string): VoteStore {
  const hash = matchId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return {
    home: 90 + (hash % 60),
    draw: 30 + (hash % 25),
    away: 70 + ((hash * 3) % 55),
  };
}

interface Props {
  match: Match;
}

export default function MatchSentiment({ match }: Props) {
  const seed = seedVotes(match.id);

  const [votes, setVotes] = useLocalStorage<VoteStore>(`sentiment-votes-${match.id}`, seed);
  const [myPick, setMyPick] = useLocalStorage<Pick | null>(`sentiment-pick-${match.id}`, null);

  const isUpcoming = match.status === 'upcoming';
  const isLive = match.status === 'live';
  const isFinished = match.status === 'finished';
  const hasVoted = myPick !== null;
  const canVote = isUpcoming && !hasVoted;

  const total = votes.home + votes.draw + votes.away;

  const pct = (k: Pick): number => Math.round((votes[k] / total) * 100);

  const actualResult: Pick | null = match.score
    ? match.score.home > match.score.away
      ? 'home'
      : match.score.away > match.score.home
      ? 'away'
      : 'draw'
    : null;

  const predictedCorrectly = hasVoted && actualResult !== null && myPick === actualResult;

  const handlePick = (pick: Pick) => {
    if (!canVote) return;
    setVotes((prev) => ({ ...prev, [pick]: prev[pick] + 1 }));
    setMyPick(pick);
  };

  const handleChangePick = () => {
    if (myPick !== null) {
      setVotes((prev) => ({ ...prev, [myPick]: Math.max(0, prev[myPick] - 1) }));
    }
    setMyPick(null);
  };

  const options: { key: Pick; icon: string; label: string }[] = [
    { key: 'home', icon: match.homeTeam.flag, label: match.homeTeam.shortName },
    { key: 'draw', icon: '🤝', label: 'Draw' },
    { key: 'away', icon: match.awayTeam.flag, label: match.awayTeam.shortName },
  ];

  const topPct = Math.max(pct('home'), pct('draw'), pct('away'));

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-bold text-white">
          {isFinished ? '📊 Fan Sentiment' : '🗳️ Fan Sentiment'}
        </h3>
        <span className="text-xs text-gray-600">{total.toLocaleString()} fans</span>
      </div>

      {/* Status line */}
      <p className="text-xs mb-4 text-gray-500">
        {isUpcoming && !hasVoted && 'Who do you think wins this one?'}
        {isUpcoming && hasVoted && 'Your prediction is locked in!'}
        {isLive && 'Match is live — voting closed'}
        {isFinished && hasVoted && (predictedCorrectly ? '🎉 You called it right!' : '😔 Better luck next time!')}
        {isFinished && !hasVoted && 'Final result is in'}
      </p>

      {/* Predict buttons — only before match */}
      {canVote && (
        <div className="grid grid-cols-3 gap-2 mb-5">
          {options.map((o) => (
            <button
              key={o.key}
              onClick={() => handlePick(o.key)}
              className="flex flex-col items-center gap-1.5 py-3 rounded-xl border border-gray-700 hover:border-amber-400 hover:bg-amber-400/5 transition-all group"
            >
              <span className="text-2xl">{o.icon}</span>
              <span className="text-xs font-bold text-gray-400 group-hover:text-white">{o.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Result bars — shown after voting, during live, or after FT */}
      {(hasVoted || isLive || isFinished) && (
        <div className="space-y-3">
          {options.map((o) => {
            const p = pct(o.key);
            const isMyPick = myPick === o.key;
            const isResult = actualResult === o.key;
            const isTop = p === topPct;

            return (
              <div key={o.key}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base">{o.icon}</span>
                    <span className={`text-xs font-semibold ${isMyPick ? 'text-amber-400' : 'text-gray-300'}`}>
                      {o.label}
                    </span>
                    {isMyPick && (
                      <span className="text-xs text-amber-400/70">your pick</span>
                    )}
                    {isResult && isFinished && (
                      <span className="text-xs text-green-400 font-bold">✓ Result</span>
                    )}
                  </div>
                  <span className={`text-sm font-bold tabular-nums ${isTop ? 'text-white' : 'text-gray-500'}`}>
                    {p}%
                  </span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isMyPick
                        ? 'bg-amber-400'
                        : isResult && isFinished
                        ? 'bg-green-500'
                        : isTop
                        ? 'bg-blue-500'
                        : 'bg-gray-600'
                    }`}
                    style={{ width: `${p}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {hasVoted && isUpcoming && (
        <button
          onClick={handleChangePick}
          className="mt-3 text-xs text-gray-600 hover:text-gray-400 transition-colors"
        >
          Change prediction
        </button>
      )}
    </div>
  );
}
