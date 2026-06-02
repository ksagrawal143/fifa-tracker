import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Matches from './pages/Matches';
import Standings from './pages/Standings';
import Teams from './pages/Teams';
import TeamDetail from './pages/TeamDetail';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-950">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/matches" element={<Matches />} />
              <Route path="/standings" element={<Standings />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/teams/:id" element={<TeamDetail />} />
            </Routes>
          </main>
          <footer className="mt-16 border-t border-gray-800 py-6 text-center text-xs text-gray-600">
            FIFA World Cup 2026™ Tracker — Data updates every 30 seconds for live matches
          </footer>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
