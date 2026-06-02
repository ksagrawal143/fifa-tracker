import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMatches } from '../api';
import MatchCard from '../components/MatchCard';
import { SCHEDULE_STAGES } from '../data/matches';
import { format, parseISO } from 'date-fns';

export default function Matches() {
  const [filter, setFilter] = useState<'all' | 'live' | 'upcoming' | 'finished'>('all');
  const [stageFilter, setStageFilter] = useState('All');

  const { data: matches = [], isLoading } = useQuery({
    queryKey: ['matches'],
    queryFn: fetchMatches,
    refetchInterval: 30_000,
  });

  const filtered = matches.filter(m => {
    const statusOk = filter === 'all' || m.status === filter;
    const stageOk = stageFilter === 'All' || m.stage === stageFilter;
    return statusOk && stageOk;
  });

  // Group by date
  const byDate: Record<string, typeof filtered> = {};
  for (const m of filtered) {
    if (!byDate[m.date]) byDate[m.date] = [];
    byDate[m.date].push(m);
  }

  const liveCount = matches.filter(m => m.status === 'live').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white mb-1">Match Schedule</h1>
        <p className="text-gray-500 text-sm">FIFA World Cup 2026 — All 104 matches</p>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {(['all', 'live', 'upcoming', 'finished'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize flex items-center gap-1.5 ${
              filter === s
                ? 'bg-amber-400 text-gray-900'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {s === 'live' && liveCount > 0 && <span className="live-dot" />}
            {s}{s === 'live' && liveCount > 0 && ` (${liveCount})`}
          </button>
        ))}
      </div>

      {/* Stage filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
        {SCHEDULE_STAGES.map(s => (
          <button
            key={s}
            onClick={() => setStageFilter(s)}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              stageFilter === s
                ? 'bg-gray-700 text-white'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20 text-gray-500">Loading matches…</div>
      ) : Object.keys(byDate).length === 0 ? (
        <div className="flex justify-center py-20 text-gray-500">No matches found</div>
      ) : (
        <div className="space-y-8">
          {Object.entries(byDate).sort().map(([date, dayMatches]) => (
            <div key={date}>
              <h2 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                <span className="h-px flex-1 bg-gray-800" />
                {format(parseISO(date), 'EEEE, MMMM d, yyyy')}
                <span className="h-px flex-1 bg-gray-800" />
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {dayMatches.map(m => <MatchCard key={m.id} match={m} />)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
