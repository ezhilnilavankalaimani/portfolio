// Live scores for the Popcorn Corner cards.
// Called by the site as /.netlify/functions/scores?team=mun|bra|csk and returns { line: "..." }.
// Keys live in Netlify (Site configuration > Environment variables), never in the page:
//   FOOTBALL_DATA_TOKEN  free key from https://www.football-data.org/client/register  (Man United, Brazil)
//   CRICAPI_KEY          free key from https://cricketdata.org                         (Chennai Super Kings)

const FOOTBALL_IDS = { mun: 66, bra: 764 }; // football-data.org team ids
const CSK_NAME = 'chennai super kings';

const json = (code, body) => ({
  statusCode: code,
  headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=30' },
  body: JSON.stringify(body),
});

const iso = (d) => d.toISOString().slice(0, 10);

const dayLabel = (d) => new Date(d).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', timeZone: 'America/Toronto' });

async function football(team) {
  const token = process.env.FOOTBALL_DATA_TOKEN;
  if (!token) return { line: 'Live score will appear once the football key is added' };
  const now = new Date();
  const from = iso(new Date(now.getTime() - 75 * 86400000));
  const to = iso(new Date(now.getTime() + 2 * 86400000));
  const r = await fetch(
    `https://api.football-data.org/v4/teams/${FOOTBALL_IDS[team]}/matches?dateFrom=${from}&dateTo=${to}`,
    { headers: { 'X-Auth-Token': token } }
  );
  if (!r.ok) throw new Error('football ' + r.status);
  const { matches = [] } = await r.json();
  const name = (t) => t.shortName || t.name;
  const sc = (m) => `${name(m.homeTeam)} ${m.score?.fullTime?.home ?? m.score?.halfTime?.home ?? 0}-${m.score?.fullTime?.away ?? m.score?.halfTime?.away ?? 0} ${name(m.awayTeam)}`;
  const live = matches.find((m) => m.status === 'IN_PLAY' || m.status === 'PAUSED');
  if (live) {
    const tag = live.status === 'PAUSED' ? 'Half time' : live.minute ? `${live.minute}'` : '';
    return { live: true, kind: 'live', line: `${tag ? tag + '  ' : ''}${sc(live)}` };
  }
  const done = matches.filter((m) => m.status === 'FINISHED').sort((x, y) => new Date(y.utcDate) - new Date(x.utcDate))[0];
  if (done) {
    const today = Date.now() - new Date(done.utcDate).getTime() < 20 * 3600000;
    return today
      ? { live: false, kind: 'full', line: sc(done) }
      : { live: false, kind: 'last', line: `${dayLabel(done.utcDate)} · ${sc(done)}` };
  }
  return { live: false, line: 'No recent match found' };
}

async function cricket() {
  const key = process.env.CRICAPI_KEY;
  if (!key) return { line: 'Live score will appear once the cricket key is added' };
  const r = await fetch(`https://api.cricapi.com/v1/currentMatches?apikey=${key}&offset=0`);
  if (!r.ok) throw new Error('cricket ' + r.status);
  const { data = [] } = await r.json();
  const mine = data.filter((x) => (x.name || '').toLowerCase().includes(CSK_NAME));
  const line = (m) => {
    const sc = (m.score || []).map((s) => `${s.inning.replace(/ Inning \d+/, '')} ${s.r}/${s.w} (${s.o})`).join(' | ');
    return `${sc || m.name}${m.status ? ' - ' + m.status : ''}`;
  };
  const live = mine.find((m) => m.matchStarted && !m.matchEnded);
  if (live) return { live: true, kind: 'live', line: line(live) };
  const done = mine.filter((m) => m.matchEnded).sort((x, y) => new Date(y.dateTimeGMT || 0) - new Date(x.dateTimeGMT || 0))[0];
  if (done) {
    const t = done.dateTimeGMT ? new Date(done.dateTimeGMT + 'Z').getTime() : 0;
    return Date.now() - t < 20 * 3600000
      ? { live: false, kind: 'full', line: line(done) }
      : { live: false, kind: 'last', line: `${t ? dayLabel(t) + ' · ' : ''}${line(done)}` };
  }
  return { live: false, line: 'No recent Chennai Super Kings match found' };
}

export const handler = async (event) => {
  const team = (event.queryStringParameters || {}).team;
  try {
    if (team === 'mun' || team === 'bra') return json(200, await football(team));
    if (team === 'csk') return json(200, await cricket());
    return json(400, { error: 'unknown team' });
  } catch (e) {
    return json(502, { error: 'score feed unavailable' });
  }
};
