import { useQuery } from '@tanstack/react-query';
import { fetchStandings } from '../api';
import StandingsTable from '../components/StandingsTable';
import { GROUPS_WITH_STANDINGS } from '../data/standings';

export default function Standings() {
  const { data: standings = [], isLoading } = useQuery({
    queryKey: ['standings'],
    queryFn: fetchStandings,
    refetchInterval: 60_000,
  });

  const activeGroups = GROUPS_WITH_STANDINGS.filter(g =>
    standings.some(s => s.group === g)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white mb-1">Group Standings</h1>
        <p className="text-gray-500 text-sm">Top 2 from each group advance to Round of 32</p>
      </div>

      <div className="mb-4 flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <span className="w-3 h-4 rounded-sm bg-amber-400/20 border-l-2 border-amber-400/60 inline-block" />
          Qualifies to Round of 32
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20 text-gray-500">Loading standings…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {activeGroups.map(g => (
            <StandingsTable key={g} standings={standings} group={g} />
          ))}
        </div>
      )}
    </div>
  );
}
