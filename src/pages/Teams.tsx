import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TEAMS } from '../data/teams';

const CONFEDERATIONS = ['All', 'UEFA', 'CONMEBOL', 'CONCACAF', 'AFC', 'CAF', 'OFC'];

export default function Teams() {
  const [search, setSearch] = useState('');
  const [confederation, setConfederation] = useState('All');

  const filtered = TEAMS.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.shortName.toLowerCase().includes(search.toLowerCase());
    const matchesConf = confederation === 'All' || t.confederation === confederation;
    return matchesSearch && matchesConf;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white mb-1">Teams</h1>
        <p className="text-gray-500 text-sm">48 nations competing at FIFA World Cup 2026</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search team…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 w-full sm:w-64"
        />
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {CONFEDERATIONS.map(c => (
            <button
              key={c}
              onClick={() => setConfederation(c)}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                confederation === c
                  ? 'bg-amber-400 text-gray-900'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No teams found</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filtered.map(team => (
            <Link
              key={team.id}
              to={`/teams/${team.id}`}
              className="group bg-gray-900 rounded-xl border border-gray-800 hover:border-amber-400/50 p-4 flex flex-col items-center gap-2 transition-all hover:bg-gray-800"
            >
              <span className="text-4xl">{team.flag}</span>
              <div className="text-center">
                <div className="text-xs font-bold text-gray-300 group-hover:text-white">{team.shortName}</div>
                <div className="text-xs text-gray-600 truncate max-w-full">{team.name}</div>
              </div>
              <span className="text-xs bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full group-hover:bg-gray-700">
                Group {team.group}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
