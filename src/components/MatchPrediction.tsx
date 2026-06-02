import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Match } from '../types';

interface Props {
  match: Match;
}

type Prediction = 'home' | 'draw' | 'away';

const SEED_VOTES: Record<string, Record<Prediction, number>> = {};

function getSeededVotes(matchId: string, homeShort: string, awayShort: string): Record<Prediction, number> {
  if (SEED_VOTES[matchId]) return SEED_VOTES[matchId];
  // Generate plausible seed votes based on matchId hash
  const hash = matchId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const base = 80 + (hash % 120);
  SEED_VOTES[matchId] = {
    home: base + (hash % 40),
    draw: Math.floor(base * 0.4) + (hash % 20),
    away: base - (hash % 30) + 10,
  };
  return SEED_VOTES[matchId];
}

export default function MatchPrediction({ match }: Props) {
  const seeded = getSeededVotes(match.id, match.homeTeam.shortName, match.awayTeam.shortName);

  const [votes, setVotes] = useLocalStorage<Record<Prediction, number>>(
    `predict-votes-${match.id}`,
    seeded
  );
  const [myPick, setMyPick] = useLocalStorage<Prediction | null>(`predict-pick-${match.id}`, null);

  const totalVotes = votes.home + votes.draw + votes.away;
  const hasVoted = myPick !== null;
  const isFinished = match.status === 'finished';
  const isLive = match.status === 'live';

  const pct = (k: Prediction) => Math.round((votes[k] / totalVotes) * 100);

  const handlePick = (pick: Prediction) => {
    if (hasVoted || isFinished) return;
    setVotes(prev => ({ ...prev, [pick]: prev[pick] + 1 }));
    setMyPick(pick);
  };

  const actualResult: Prediction | null = match.score
    ? match.score.home > match.score.away ? 'home'
    : match.score.away > match.score.home ? 'away'
    : 'draw'
    : null;

  const myPredictionCorrect = hasVoted && actualResult && myPick === actualResult;

  const OPTIONS: { key: Prediction; label: string; sublabel: string }[] = [
    { key: 'home', label: match.homeTeam.shortName, sublabel: match.homeTeam.flag },
    { key: 'draw', label: 'Draw', sublabel: '🤝' },
    { key: 'away', label: match.awayTeam.shortName, sublabel: match.awayTeam.flag },
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-bold text-white">
          {isFinished ? '📊 Fan Predictions' : '🔮 Predict the Result'}
        </h3>
        <span className="text-xs text-gray-600">{totalVotes.toLocaleString()} fans voted</span>
      </div>

      {isFinished && myPredictionCorrect !== null && hasVoted && (
        <p className={`text-xs mb-3 font-medium ${myPredictionCorrect ? 'text-green-400' : 'text-red-400'}`}>
          {myPredictionCorrect ? '🎉 You predicted correctly!' : '😔 Better luck next time!'}
        </p>
      )}

      {!hasVoted && !isFinished && !isLive && (
        <p className="text-xs text-gray-500 mb-4">Who do you think wins this one?</p>
      )}
      {isLive && !hasVoted && (
        <p className="text-xs text-amber-400 mb-4">Match is live — predictions locked!</p>
      )}

      {/* Vote buttons */}
      {!hasVoted && !isFinished && !isLive ? (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {OPTIONS.map(o => (
            <button
              key={o.key}
              onClick={() => handlePick(o.key)}
              className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border border-gray-700 hover:border-amber-400 hover:bg-amber-400/5 transition-all group"
            >
              <span className="text-2xl">{o.sublabel}</span>
              <span className="text-xs font-bold text-gray-300 group-hover:text-white">{o.label}</span>
            </button>
          ))}
        </div>
      ) : null}

      {/* Results bars */}
      {(hasVoted || isFinished || isLive) && (
        <div className="space-y-3">
          {OPTIONS.map(o => {
            const p = pct(o.key);
            const isWinner = actualResult === o.key;
            const isMyPick = myPick === o.key;
            const isTop = p === Math.max(pct('home'), pct('draw'), pct('away'));

            return (
              <div key={o.key}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{o.sublabel}</span>
                    <span className={`text-xs font-semibold ${isMyPick ? 'text-amber-400' : 'text-gray-300'}`}>
                      {o.label}
                    </span>
                    {isMyPick && <span className="text-xs text-amber-400">← your pick</span>}
                    {isWinner && isFinished && <span className="text-xs text-green-400 font-bold">✓ Result</span>}
                  </div>
                  <span className={`text-sm font-bold tabular-nums ${
                    isTop ? 'text-white' : 'text-gray-500'
                  }`}>{p}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isMyPick ? 'bg-amber-400'
                      : isWinner && isFinished ? 'bg-green-500'
                      : isTop ? 'bg-blue-500'
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

      {hasVoted && !isFinished && !isLive && (
        <button
          onClick={() => {
            if (myPick) {
              setVotes(prev => ({ ...prev, [myPick]: Math.max(0, prev[myPick] - 1) }));
            }
            setMyPick(null);
          }}
          className="mt-3 text-xs text-gray-600 hover:text-gray-400 transition-colors"
        >
          Change prediction
        </button>
      )}
    </div>
  );
}
