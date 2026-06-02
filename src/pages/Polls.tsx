import { useState } from 'react';
import { POLLS } from '../data/polls';
import FanPoll from '../components/FanPoll';

type Category = 'All' | 'tournament' | 'player' | 'team' | 'fun';

const CATEGORIES: Category[] = ['All', 'tournament', 'player', 'team', 'fun'];

const CATEGORY_LABELS: Record<Category, string> = {
  All: 'All',
  tournament: '🏆 Tournament',
  player: '⭐ Players',
  team: '🌍 Teams',
  fun: '😄 Fun',
};

export default function Polls() {
  const [cat, setCat] = useState<Category>('All');

  const filtered = POLLS.filter((p) => cat === 'All' || p.category === cat);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white mb-1">Fan Polls</h1>
        <p className="text-gray-500 text-sm">Have your say — vote and see what the world thinks</p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              cat === c ? 'bg-amber-400 text-gray-900' : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((poll) => (
          <FanPoll key={poll.id} poll={poll} />
        ))}
      </div>
    </div>
  );
}
