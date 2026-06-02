import type { NewsItem } from '../types';
import { formatDistanceToNow } from 'date-fns';

const CATEGORY_COLORS: Record<string, string> = {
  match: 'bg-green-900 text-green-300',
  squad: 'bg-blue-900 text-blue-300',
  injury: 'bg-red-900 text-red-300',
  transfer: 'bg-purple-900 text-purple-300',
  general: 'bg-gray-800 text-gray-300',
};

interface Props { news: NewsItem; featured?: boolean }

export default function NewsCard({ news, featured = false }: Props) {
  return (
    <a
      href={news.url}
      className={`group block bg-gray-900 rounded-xl border border-gray-800 hover:border-amber-500/50 transition-all overflow-hidden ${featured ? 'md:col-span-2' : ''}`}
    >
      {news.imageUrl && (
        <div className="overflow-hidden">
          <img
            src={news.imageUrl}
            alt=""
            className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${featured ? 'h-56' : 'h-36'}`}
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${CATEGORY_COLORS[news.category]}`}>
            {news.category}
          </span>
          <span className="text-xs text-gray-600">{news.source}</span>
          <span className="text-xs text-gray-600 ml-auto">
            {formatDistanceToNow(new Date(news.publishedAt), { addSuffix: true })}
          </span>
        </div>
        <h3 className={`font-semibold text-white group-hover:text-amber-400 transition-colors leading-snug ${featured ? 'text-lg' : 'text-sm'}`}>
          {news.title}
        </h3>
        {featured && (
          <p className="mt-2 text-sm text-gray-400 line-clamp-2">{news.description}</p>
        )}
      </div>
    </a>
  );
}
