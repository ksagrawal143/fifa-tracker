import express from 'express';
import cors from 'cors';
import NodeCache from 'node-cache';
import axios from 'axios';
import * as cheerio from 'cheerio';
import RSSParser from 'rss-parser';

const app = express();
const cache = new NodeCache({ stdTTL: 60 }); // default 60s TTL
const rss = new RSSParser();

app.use(cors({
  origin: [
    'http://localhost:5174',
    'http://localhost:5173',
    /\.vercel\.app$/,       // any Vercel preview URL
    /\.onrender\.com$/,     // Render internal
    process.env.FRONTEND_URL, // set this in Render dashboard if custom domain
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json());

const ESPN_BASE = 'https://site.api.espn.com/apis/site/v2/sports/soccer';
const ESPN_LEAGUE = 'fifa.world';
const WIKI_API = 'https://en.wikipedia.org/w/api.php';

const headers = {
  'User-Agent': 'Mozilla/5.0 (compatible; FIFA-WC-Tracker/1.0)',
  'Accept': 'application/json, text/html, */*',
};

// ─── Helper ─────────────────────────────────────────────────────────────────

function cached(key, ttl, fn) {
  const hit = cache.get(key);
  if (hit !== undefined) return Promise.resolve(hit);
  return fn().then(data => {
    cache.set(key, data, ttl);
    return data;
  });
}

// ─── ESPN: Matches / Scoreboard ─────────────────────────────────────────────

app.get('/api/matches', async (req, res) => {
  try {
    const data = await cached('matches', 30, async () => {
      // ESPN scoreboard — fetch multiple dates around the tournament
      const url = `${ESPN_BASE}/${ESPN_LEAGUE}/scoreboard?limit=50&dates=20260611-20260719`;
      const { data } = await axios.get(url, { headers });
      return parseESPNMatches(data);
    });
    res.json(data);
  } catch (err) {
    console.error('matches error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

function parseESPNMatches(data) {
  const events = data.events || [];
  return events.map(ev => {
    const comp = ev.competitions?.[0];
    const home = comp?.competitors?.find(c => c.homeAway === 'home');
    const away = comp?.competitors?.find(c => c.homeAway === 'away');
    const status = ev.status?.type?.name;
    const clock = ev.status?.displayClock;
    const period = ev.status?.period;

    let matchStatus = 'upcoming';
    if (status === 'STATUS_FINAL') matchStatus = 'finished';
    else if (status === 'STATUS_IN_PROGRESS' || status === 'STATUS_HALFTIME') matchStatus = 'live';

    const dateObj = new Date(ev.date);
    return {
      id: ev.id,
      homeTeam: {
        id: home?.team?.id,
        name: home?.team?.displayName,
        shortName: home?.team?.abbreviation,
        flag: getFlagEmoji(home?.team?.abbreviation),
      },
      awayTeam: {
        id: away?.team?.id,
        name: away?.team?.displayName,
        shortName: away?.team?.abbreviation,
        flag: getFlagEmoji(away?.team?.abbreviation),
      },
      date: dateObj.toISOString().split('T')[0],
      time: dateObj.toTimeString().slice(0, 5),
      venue: comp?.venue?.fullName || '',
      city: comp?.venue?.address?.city || '',
      stage: ev.season?.slug === 'group-stage' ? 'Group Stage' : (ev.name || 'Group Stage'),
      group: extractGroup(ev.name),
      status: matchStatus,
      score: matchStatus !== 'upcoming' && home && away ? {
        home: parseInt(home.score || '0'),
        away: parseInt(away.score || '0'),
      } : undefined,
      minute: matchStatus === 'live' ? parseClock(clock, period) : undefined,
    };
  });
}

function extractGroup(name = '') {
  const m = name.match(/Group ([A-P])/i);
  return m ? m[1].toUpperCase() : undefined;
}

function parseClock(clock, period) {
  if (!clock) return undefined;
  const mins = parseInt(clock.split(':')[0]);
  return period === 2 ? 45 + mins : mins;
}

// ─── ESPN: Standings ─────────────────────────────────────────────────────────

app.get('/api/standings', async (req, res) => {
  try {
    const data = await cached('standings', 60, async () => {
      const url = `https://site.api.espn.com/apis/v2/sports/soccer/${ESPN_LEAGUE}/standings`;
      const { data } = await axios.get(url, { headers });
      return parseESPNStandings(data);
    });
    res.json(data);
  } catch (err) {
    console.error('standings error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

function parseESPNStandings(data) {
  const standings = [];
  const groups = data.standings?.entries || data.children || [];

  const processGroup = (group) => {
    const groupName = group.name || group.abbreviation || '';
    const letter = (groupName.match(/Group ([A-P])/i) || [])[1]?.toUpperCase() || groupName.slice(-1);
    const entries = group.standings?.entries || group.entries || [];
    entries.forEach(entry => {
      const team = entry.team;
      const stats = {};
      (entry.stats || []).forEach(s => { stats[s.name] = s.value; });
      standings.push({
        team: {
          id: team?.id,
          name: team?.displayName,
          shortName: team?.abbreviation,
          flag: getFlagEmoji(team?.abbreviation),
        },
        group: letter,
        played: stats.gamesPlayed ?? 0,
        won: stats.wins ?? 0,
        drawn: stats.ties ?? 0,
        lost: stats.losses ?? 0,
        goalsFor: stats.pointsFor ?? stats.goalsFor ?? 0,
        goalsAgainst: stats.pointsAgainst ?? stats.goalsAgainst ?? 0,
        points: stats.points ?? 0,
      });
    });
  };

  if (data.children) {
    data.children.forEach(processGroup);
  } else if (data.standings) {
    processGroup(data);
  }

  return standings;
}

// ─── News: Multiple free RSS sources ─────────────────────────────────────────

const NEWS_FEEDS = [
  { url: 'https://www.fifa.com/en/tournaments/mens/worldcup/articles.rss', source: 'FIFA.com' },
  { url: 'https://feeds.bbci.co.uk/sport/football/rss.xml', source: 'BBC Sport' },
  { url: 'https://www.goal.com/feeds/en/news', source: 'Goal.com' },
  { url: 'https://www.espn.com/espn/rss/soccer/news', source: 'ESPN FC' },
];

app.get('/api/news', async (req, res) => {
  try {
    const data = await cached('news', 300, async () => {
      const results = await Promise.allSettled(
        NEWS_FEEDS.map(async ({ url, source }) => {
          try {
            const feed = await rss.parseURL(url);
            return (feed.items || []).slice(0, 10).map((item, i) => ({
              id: `${source}-${i}-${Date.now()}`,
              title: item.title || '',
              description: stripHtml(item.contentSnippet || item.content || item.summary || ''),
              url: item.link || '#',
              source,
              publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
              imageUrl: extractImage(item),
              category: categorize(item.title || ''),
            }));
          } catch {
            return [];
          }
        })
      );

      const allItems = results
        .filter(r => r.status === 'fulfilled')
        .flatMap(r => r.value)
        .filter(item => isRelevant(item.title));

      // Sort by date, deduplicate by similar titles
      return allItems
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
        .slice(0, 30);
    });
    res.json(data);
  } catch (err) {
    console.error('news error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

function isRelevant(title = '') {
  const t = title.toLowerCase();
  return t.includes('world cup') || t.includes('fifa') || t.includes('wc2026') ||
    t.includes('2026') || t.includes('squad') || t.includes('messi') ||
    t.includes('ronaldo') || t.includes('mbapp') || t.includes('football') || true; // return all for now
}

function categorize(title = '') {
  const t = title.toLowerCase();
  if (t.includes('injur') || t.includes('doubt') || t.includes('fit')) return 'injury';
  if (t.includes('squad') || t.includes('lineup') || t.includes('selected')) return 'squad';
  if (t.includes('transfer') || t.includes('sign')) return 'transfer';
  if (t.includes(' vs ') || t.includes('defeat') || t.includes('win') || t.includes('goal') || t.includes('score')) return 'match';
  return 'general';
}

function extractImage(item) {
  // Try various RSS image fields
  if (item['media:thumbnail']) return item['media:thumbnail']?.$.url || item['media:thumbnail'];
  if (item.enclosure?.url) return item.enclosure.url;
  if (item['media:content']) return item['media:content']?.$.url;
  // Try parsing from content HTML
  if (item.content) {
    const m = item.content.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (m) return m[1];
  }
  return undefined;
}

function stripHtml(html = '') {
  return html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').trim().slice(0, 300);
}

// ─── Wikipedia: Squad data ───────────────────────────────────────────────────

app.get('/api/squad/:team', async (req, res) => {
  const { team } = req.params;
  try {
    const data = await cached(`squad-${team}`, 3600, () => fetchWikiSquad(team));
    res.json(data);
  } catch (err) {
    console.error('squad error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

async function fetchWikiSquad(teamSlug) {
  // Map team slugs to Wikipedia page names
  const WIKI_PAGES = {
    arg: 'Argentina_national_football_team',
    fra: 'France_national_football_team',
    bra: 'Brazil_national_football_team',
    eng: 'England_national_football_team',
    esp: 'Spain_national_football_team',
    ger: 'Germany_national_football_team',
    por: 'Portugal_national_football_team',
    usa: 'United_States_men%27s_national_soccer_team',
    ned: 'Netherlands_national_football_team',
    mex: 'Mexico_national_football_team',
    jpn: 'Japan_national_football_team',
    mar: 'Morocco_national_football_team',
  };

  const page = WIKI_PAGES[teamSlug];
  if (!page) return null;

  const url = `${WIKI_API}?action=parse&page=${page}&prop=text&section=0&format=json&origin=*`;
  const { data } = await axios.get(url, { headers });
  // Return summary text from Wikipedia intro
  const html = data?.parse?.text?.['*'] || '';
  const $ = cheerio.load(html);
  const summary = $('p').first().text().trim();
  return { summary, wikiUrl: `https://en.wikipedia.org/wiki/${page}` };
}

// ─── ESPN: Live match details ────────────────────────────────────────────────

app.get('/api/matches/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const url = `${ESPN_BASE}/${ESPN_LEAGUE}/summary?event=${id}`;
    const { data } = await axios.get(url, { headers });
    res.json({
      id,
      headline: data.header?.competitions?.[0]?.notes?.[0]?.headline || '',
      venue: data.header?.competitions?.[0]?.venue || {},
      officials: data.header?.competitions?.[0]?.officials || [],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Health check ────────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', cached: cache.keys(), time: new Date().toISOString() });
});

// ─── Flag emoji mapping ──────────────────────────────────────────────────────

const FLAG_MAP = {
  ARG: '🇦🇷', FRA: '🇫🇷', BRA: '🇧🇷', ENG: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', ESP: '🇪🇸',
  GER: '🇩🇪', POR: '🇵🇹', USA: '🇺🇸', NED: '🇳🇱', MEX: '🇲🇽',
  JPN: '🇯🇵', MAR: '🇲🇦', SEN: '🇸🇳', GHA: '🇬🇭', CMR: '🇨🇲',
  NGR: '🇳🇬', IVY: '🇨🇮', EGY: '🇪🇬', TUN: '🇹🇳', ALG: '🇩🇿',
  AUS: '🇦🇺', KOR: '🇰🇷', IRN: '🇮🇷', SAU: '🇸🇦', QAT: '🇶🇦',
  URU: '🇺🇾', COL: '🇨🇴', CHI: '🇨🇱', ECU: '🇪🇨', PAR: '🇵🇾',
  PER: '🇵🇪', VEN: '🇻🇪', BOL: '🇧🇴', CRC: '🇨🇷', PAN: '🇵🇦',
  HON: '🇭🇳', CAN: '🇨🇦', JAM: '🇯🇲', BEL: '🇧🇪', SUI: '🇨🇭',
  CRO: '🇭🇷', DEN: '🇩🇰', POL: '🇵🇱', SRB: '🇷🇸', SCO: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  WAL: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', TUR: '🇹🇷', AUT: '🇦🇹', GRE: '🇬🇷', HUN: '🇭🇺',
  SVK: '🇸🇰', SVN: '🇸🇮', ROU: '🇷🇴', UKR: '🇺🇦', ALB: '🇦🇱',
  NZL: '🇳🇿', FIJ: '🇫🇯', VAN: '🇻🇺', SOL: '🇸🇧',
};

function getFlagEmoji(abbr = '') {
  return FLAG_MAP[abbr?.toUpperCase()] || '🏳️';
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`⚽ FIFA WC server running on :${PORT}`));
