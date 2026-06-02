import { Link, useLocation } from 'react-router-dom';

const NAV = [
  { label: 'Home', to: '/' },
  { label: 'Matches', to: '/matches' },
  { label: 'Standings', to: '/standings' },
  { label: 'Teams', to: '/teams' },
  { label: 'Polls', to: '/polls' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 h-14">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg shrink-0">
          <span className="text-2xl">⚽</span>
          <span className="text-white">FIFA</span>
          <span className="text-amber-400">WC 2026</span>
        </Link>

        <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {NAV.map(n => (
            <Link
              key={n.to}
              to={n.to}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                pathname === n.to
                  ? 'bg-amber-400 text-gray-900'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 text-xs text-gray-500 shrink-0">
          <span className="live-dot" />
          <span>Live Updates</span>
        </div>
      </div>
    </header>
  );
}
