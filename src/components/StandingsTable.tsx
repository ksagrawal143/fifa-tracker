import type { Standing } from '../types';

interface Props { standings: Standing[]; group: string }

export default function StandingsTable({ standings, group }: Props) {
  const rows = standings
    .filter(s => s.group === group)
    .sort((a, b) => b.points - a.points || (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst));

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
        <span className="font-semibold text-white text-sm">Group {group}</span>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-gray-500 uppercase border-b border-gray-800">
            <th className="text-left py-2 px-4 font-medium">Team</th>
            <th className="py-2 px-2 font-medium text-center">P</th>
            <th className="py-2 px-2 font-medium text-center">W</th>
            <th className="py-2 px-2 font-medium text-center">D</th>
            <th className="py-2 px-2 font-medium text-center">L</th>
            <th className="py-2 px-2 font-medium text-center">GF</th>
            <th className="py-2 px-2 font-medium text-center">GA</th>
            <th className="py-2 px-2 font-medium text-center">GD</th>
            <th className="py-2 px-3 font-medium text-center">Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((s, i) => (
            <tr key={s.team.id} className={`border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors ${i < 2 ? 'border-l-2 border-l-amber-400/50' : ''}`}>
              <td className="py-2.5 px-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 w-3">{i + 1}</span>
                  <span>{s.team.flag}</span>
                  <span className="text-gray-200 font-medium">{s.team.shortName}</span>
                </div>
              </td>
              <td className="py-2.5 px-2 text-center text-gray-400">{s.played}</td>
              <td className="py-2.5 px-2 text-center text-gray-400">{s.won}</td>
              <td className="py-2.5 px-2 text-center text-gray-400">{s.drawn}</td>
              <td className="py-2.5 px-2 text-center text-gray-400">{s.lost}</td>
              <td className="py-2.5 px-2 text-center text-gray-400">{s.goalsFor}</td>
              <td className="py-2.5 px-2 text-center text-gray-400">{s.goalsAgainst}</td>
              <td className="py-2.5 px-2 text-center text-gray-400">
                {s.goalsFor - s.goalsAgainst > 0 ? `+${s.goalsFor - s.goalsAgainst}` : s.goalsFor - s.goalsAgainst}
              </td>
              <td className="py-2.5 px-3 text-center font-bold text-amber-400">{s.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
