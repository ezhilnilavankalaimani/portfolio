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

async function football(team) {
  const token = process.env.FOOTBALL_DATA_TOKEN;
  if (!token) return { line: 'Live score will appear once the football key is added' };
  const now = new Date();
  const from = iso(new Date(now.getTime() - 86400000));
  const to = iso(new Date(now.getTime() + 86400000));
  const r = await fetch(
    `https://api.football-data.org/v4/teams/${FOOTBALL_IDS[team]}/matches?dateFrom=${from}&dateTo=${to}`,
    { headers: { 'X-Auth-Token': token } }
  );
  if (!r.ok) throw new Error('football ' + r.status);
  const { matches = [] } = await r.json();
  if (!matches.length) return { line: 'No match in the last day' };
  // prefer a live match, then the most recent one
  const pick =
    matches.find((m) => m.status === 'IN_PLAY' || m.status === 'PAUSED') ||
    matches.slice().sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate))[0];
  const h = pick.homeTeam.shortName || pick.homeTeam.name;
  const a = pick.awayTeam.shortName || pick.awayTeam.name;
  const hs = pick.score?.fullTime?.home;
  const as = pick.score?.fullTime?.away;
  const score = hs == null || as == null ? '' : ` ${hs}-${as} `;
  if (pick.status === 'IN_PLAY') return { line: `LIVE: ${h}${score || ' v '}${a}${pick.minute ? ` (${pick.minute}')` : ''}` };
  if (pick.status === 'PAUSED') return { line: `Half time: ${h}${score || ' v '}${a}` };
  if (pick.status === 'FINISHED') return { line: `Full time: ${h}${score || ' v '}${a}` };
  const ko = new Date(pick.utcDate).toLocaleTimeString('en-CA', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Toronto' });
  return { line: `${h} v ${a}, kick-off ${ko} Toronto time` };
}

async function cricket() {
  const key = process.env.CRICAPI_KEY;
  if (!key) return { line: 'Live score will appear once the cricket key is added' };
  const r = await fetch(`https://api.cricapi.com/v1/currentMatches?apikey=${key}&offset=0`);
  if (!r.ok) throw new Error('cricket ' + r.status);
  const { data = [] } = await r.json();
  const m = data.find((x) => (x.name || '').toLowerCase().includes(CSK_NAME));
  if (!m) return { line: 'No Chennai Super Kings match right now' };
  const sc = (m.score || []).map((s) => `${s.inning.replace(' Inning 1', '').replace(' Inning 2', '')} ${s.r}/${s.w} (${s.o})`).join(' | ');
  const prefix = m.matchEnded ? 'Full time' : m.matchStarted ? 'LIVE' : 'Up next';
  return { line: `${prefix}: ${sc || m.name}${m.status ? ' - ' + m.status : ''}` };
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
