import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Poll } from '../data/polls';

interface Props {
  poll: Poll;
}

export default function FanPoll({ poll }: Props) {
  const [votes, setVotes] = useLocalStorage<Record<number, number>>(`poll-votes-${poll.id}`, {});
  const [myVote, setMyVote] = useLocalStorage<number | null>(`poll-myvote-${poll.id}`, null);

  const totalVotes = Object.values(votes).reduce((s, v) => s + v, 0);
  const hasVoted = myVote !== null;

  const handleVote = (idx: number) => {
    if (hasVoted) return;
    setVotes((prev) => ({ ...prev, [idx]: (prev[idx] ?? 0) + 1 }));
    setMyVote(idx);
  };

  const getPct = (idx: number): number => {
    if (totalVotes === 0) return 0;
    return Math.round(((votes[idx] ?? 0) / totalVotes) * 100);
  };

  const maxVoteCount = poll.options.reduce((max, _, i) => Math.max(max, votes[i] ?? 0), 0);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">{poll.emoji}</span>
        <h3 className="text-sm font-bold text-white leading-snug">{poll.question}</h3>
      </div>

      <div className="space-y-2.5">
        {poll.options.map((option, idx) => {
          const pct = getPct(idx);
          const isMyVote = myVote === idx;
          const isLeading = hasVoted && (votes[idx] ?? 0) === maxVoteCount && (votes[idx] ?? 0) > 0;

          return (
            <button
              key={idx}
              onClick={() => handleVote(idx)}
              disabled={hasVoted}
              className={`w-full text-left rounded-xl overflow-hidden transition-all ${
                hasVoted ? 'cursor-default' : 'cursor-pointer hover:ring-1 hover:ring-amber-400/50'
              }`}
            >
              <div className="relative bg-gray-800 rounded-xl">
                {hasVoted && (
                  <div
                    className={`absolute inset-y-0 left-0 rounded-xl transition-all duration-700 ${
                      isMyVote ? 'bg-amber-400/25' : isLeading ? 'bg-green-500/15' : 'bg-gray-700/40'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                )}
                <div className="relative flex items-center justify-between px-3 py-2.5">
                  <span className={`text-sm font-medium ${isMyVote ? 'text-amber-400' : 'text-gray-300'}`}>
                    {isMyVote && <span className="mr-1.5">✓</span>}
                    {isLeading && !isMyVote && <span className="mr-1.5">🔥</span>}
                    {option}
                  </span>
                  {hasVoted && (
                    <span className={`text-xs font-bold tabular-nums ${isMyVote ? 'text-amber-400' : 'text-gray-500'}`}>
                      {pct}%
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-gray-600">
          {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
        </span>
        {hasVoted && (
          <button
            onClick={() => {
              if (myVote !== null) {
                setVotes((prev) => ({
                  ...prev,
                  [myVote]: Math.max(0, (prev[myVote] ?? 1) - 1),
                }));
              }
              setMyVote(null);
            }}
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
          >
            Change vote
          </button>
        )}
      </div>
    </div>
  );
}
