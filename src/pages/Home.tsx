import { useQuery } from '@tanstack/react-query';
import { fetchMatches, fetchNews, fetchStandings } from '../api';
import MatchCard from '../components/MatchCard';
import NewsCard from '../components/NewsCard';
import StandingsTable from '../components/StandingsTable';
import { Link } from 'react-router-dom';

export default function Home() {
  const { data: matches = [] } = useQuery({ queryKey: ['matches'], queryFn: fetchMatches, refetchInterval: 30_000 });
  const { data: news = [] } = useQuery({ queryKey: ['news'], queryFn: fetchNews, refetchInterval: 300_000 });
  const { data: standings = [] } = useQuery({ queryKey: ['standings'], queryFn: fetchStandings, refetchInterval: 60_000 });

  const liveMatches = matches.filter(m => m.status === 'live');
  const upcomingMatches = matches.filter(m => m.status === 'upcoming').slice(0, 4);
  const recentMatches = matches.filter(m => m.status === 'finished').slice(0, 2);
  const topStandingGroups = ['A', 'B'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-10">

      {/* Hero banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-amber-950 border border-gray-800 p-6 md:p-10">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_30%_50%,#f59e0b,transparent)]" />
        <div className="relative">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2">June 11 – July 19, 2026</div>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-3">
            FIFA World Cup<br />
            <span className="text-amber-400">2026™</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-md">
            48 teams. 3 host nations. 104 matches. Follow every moment of the greatest football tournament on Earth.
          </p>
          <div className="mt-5 flex flex-wrap gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">48</div>
              <div className="text-xs text-gray-500">Teams</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">16</div>
              <div className="text-xs text-gray-500">Groups</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">104</div>
              <div className="text-xs text-gray-500">Matches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">3</div>
              <div className="text-xs text-gray-500">Host Nations</div>
            </div>
          </div>
          <div className="mt-4 flex gap-2 text-2xl">🇺🇸 🇨🇦 🇲🇽</div>
        </div>
      </div>

      {/* Live matches */}
      {liveMatches.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="live-dot" />
            <h2 className="text-base font-bold text-white">Live Now</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveMatches.map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        </section>
      )}

      {/* Main 2-col layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: news + upcoming */}
        <div className="lg:col-span-2 space-y-8">

          {/* Latest News */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white">Latest News</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {news.slice(0, 6).map((item, i) => (
                <NewsCard key={item.id} news={item} featured={i === 0} />
              ))}
            </div>
          </section>

          {/* Recent Results */}
          {recentMatches.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-white">Recent Results</h2>
                <Link to="/matches" className="text-xs text-amber-400 hover:underline">View all →</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recentMatches.map(m => <MatchCard key={m.id} match={m} />)}
              </div>
            </section>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Upcoming matches */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-white">Upcoming</h2>
              <Link to="/matches" className="text-xs text-amber-400 hover:underline">All →</Link>
            </div>
            <div className="space-y-3">
              {upcomingMatches.map(m => <MatchCard key={m.id} match={m} compact />)}
            </div>
          </section>

          {/* Quick standings */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-white">Standings</h2>
              <Link to="/standings" className="text-xs text-amber-400 hover:underline">Full →</Link>
            </div>
            <div className="space-y-4">
              {topStandingGroups.map(g => (
                <StandingsTable key={g} standings={standings} group={g} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
