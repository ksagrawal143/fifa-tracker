import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { getTeamById } from '../data/teams';
import type { Player } from '../types';

const POSITION_ORDER = ['GK', 'DEF', 'MID', 'FWD'] as const;
const POSITION_LABELS: Record<string, string> = {
  GK: 'Goalkeepers',
  DEF: 'Defenders',
  MID: 'Midfielders',
  FWD: 'Forwards',
};
const POSITION_COLORS: Record<string, string> = {
  GK: 'bg-yellow-900/50 text-yellow-300 border-yellow-700/50',
  DEF: 'bg-blue-900/50 text-blue-300 border-blue-700/50',
  MID: 'bg-green-900/50 text-green-300 border-green-700/50',
  FWD: 'bg-red-900/50 text-red-300 border-red-700/50',
};

function PlayerCard({ player }: { player: Player }) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-700 p-4 flex items-start gap-3 transition-colors">
      <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-lg font-bold text-gray-400 shrink-0">
        {player.number}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="font-semibold text-white text-sm truncate">{player.name}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded border font-medium shrink-0 ${POSITION_COLORS[player.position]}`}>
            {player.position}
          </span>
        </div>
        <div className="text-xs text-gray-500 mb-2 truncate">{player.club}</div>
        <div className="flex gap-4 text-xs">
          <div>
            <span className="text-gray-600">Age </span>
            <span className="text-gray-300 font-medium">{player.age}</span>
          </div>
          <div>
            <span className="text-gray-600">Caps </span>
            <span className="text-gray-300 font-medium">{player.caps}</span>
          </div>
          <div>
            <span className="text-gray-600">Goals </span>
            <span className="text-amber-400 font-medium">{player.goals}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TeamDetail() {
  const { id } = useParams<{ id: string }>();
  const team = getTeamById(id!);
  const [posFilter, setPosFilter] = useState<string>('All');

  if (!team) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 mb-4">Team not found</p>
        <Link to="/teams" className="text-amber-400 hover:underline">← Back to Teams</Link>
      </div>
    );
  }

  const players = posFilter === 'All'
    ? team.players
    : team.players.filter(p => p.position === posFilter);

  const topScorer = [...team.players].sort((a, b) => b.goals - a.goals)[0];
  const mostCapped = [...team.players].sort((a, b) => b.caps - a.caps)[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <Link to="/teams" className="text-xs text-gray-500 hover:text-amber-400 flex items-center gap-1 mb-5">
        ← All Teams
      </Link>

      {/* Team header */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <span className="text-7xl">{team.flag}</span>
          <div className="flex-1">
            <div className="text-xs text-gray-500 mb-1">{team.confederation} • Group {team.group}</div>
            <h1 className="text-3xl font-black text-white">{team.name}</h1>
            <div className="text-gray-400 text-sm mt-1">🧑‍💼 Coach: <span className="text-white">{team.coach}</span></div>
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{team.players.length}</div>
              <div className="text-xs text-gray-500">Players</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">{team.players.reduce((s, p) => s + p.goals, 0)}</div>
              <div className="text-xs text-gray-500">Total Goals</div>
            </div>
          </div>
        </div>

        {/* Key players */}
        <div className="mt-5 pt-4 border-t border-gray-800 grid grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">⚽ Top Scorer</div>
            <div className="font-semibold text-white text-sm">{topScorer.name}</div>
            <div className="text-xs text-amber-400 mt-0.5">{topScorer.goals} international goals</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">🏆 Most Capped</div>
            <div className="font-semibold text-white text-sm">{mostCapped.name}</div>
            <div className="text-xs text-amber-400 mt-0.5">{mostCapped.caps} caps</div>
          </div>
        </div>
      </div>

      {/* Squad */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white">Squad</h2>
          <div className="flex gap-2">
            {['All', ...POSITION_ORDER].map(p => (
              <button
                key={p}
                onClick={() => setPosFilter(p)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  posFilter === p ? 'bg-amber-400 text-gray-900' : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {p === 'All' ? 'All' : POSITION_LABELS[p] ?? p}
              </button>
            ))}
          </div>
        </div>

        {posFilter === 'All' ? (
          <div className="space-y-6">
            {POSITION_ORDER.map(pos => {
              const posPlayers = team.players.filter(p => p.position === pos);
              if (!posPlayers.length) return null;
              return (
                <div key={pos}>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    {POSITION_LABELS[pos]}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {posPlayers.map(p => <PlayerCard key={p.id} player={p} />)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {players.map(p => <PlayerCard key={p.id} player={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
