// Relais Cyberdeck : boîte aux lettres temporaire pour transférer une sauvegarde CHIFFRÉE entre téléphone et PC.
// Le relais ne voit jamais la clé (elle reste dans le QR code) : il stocke un paquet illisible, effacé après 10 minutes.
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};
const TTL_MS = 10 * 60 * 1000;
const MAX = 2 * 1024 * 1024;

export class Box {
  constructor(state) { this.state = state; }
  async fetch(req) {
    if (req.method === 'PUT') {
      const body = await req.text();
      if (body.length > MAX) return new Response('trop gros', { status: 413 });
      await this.state.storage.put('data', body);
      await this.state.storage.setAlarm(Date.now() + TTL_MS);
      return new Response('ok');
    }
    if (req.method === 'GET') {
      const d = await this.state.storage.get('data');
      return d ? new Response(d) : new Response('vide', { status: 404 });
    }
    if (req.method === 'DELETE') { await this.state.storage.deleteAll(); return new Response('ok'); }
    return new Response('méthode', { status: 405 });
  }
  async alarm() { await this.state.storage.deleteAll(); }
}

// Statistiques de téléchargement : un appareil = un identifiant aléatoire gardé dans son navigateur.
// Aucune donnée personnelle : ni IP, ni navigateur complet, juste l'identifiant, le type d'appareil et les dates.
export class Stats {
  constructor(state) {
    this.sql = state.storage.sql;
    this.sql.exec(`CREATE TABLE IF NOT EXISTS dev (id TEXT PRIMARY KEY, kind TEXT, first INTEGER, last INTEGER, clicks INTEGER)`);
    this.sql.exec(`CREATE TABLE IF NOT EXISTS hit (day TEXT PRIMARY KEY, clicks INTEGER)`);
  }
  async fetch(req) {
    const now = Date.now(), day = new Date(now).toISOString().slice(0, 10);
    if (req.method === 'POST') {
      let b = {};
      try { b = JSON.parse(await req.text()); } catch (e) {}
      const id = String(b.d || '');
      if (!/^[a-f0-9]{32}$/.test(id)) return new Response('id', { status: 400 });
      const kind = ['android', 'ios', 'pc'].includes(b.k) ? b.k : 'autre';
      this.sql.exec(`INSERT INTO dev (id, kind, first, last, clicks) VALUES (?, ?, ?, ?, 1)
        ON CONFLICT(id) DO UPDATE SET last = excluded.last, clicks = clicks + 1`, id, kind, now, now);
      this.sql.exec(`INSERT INTO hit (day, clicks) VALUES (?, 1) ON CONFLICT(day) DO UPDATE SET clicks = clicks + 1`, day);
      return new Response('ok');
    }
    const one = (q, ...a) => this.sql.exec(q, ...a).toArray()[0] || {};
    const since = now - 30 * 864e5;
    return Response.json({
      devices: one(`SELECT COUNT(*) n FROM dev`).n || 0,
      clicks: one(`SELECT COALESCE(SUM(clicks),0) n FROM hit`).n || 0,
      today: one(`SELECT COUNT(*) n FROM dev WHERE first >= ?`, Date.parse(day)).n || 0,
      kinds: this.sql.exec(`SELECT kind, COUNT(*) n FROM dev GROUP BY kind ORDER BY n DESC`).toArray(),
      newPerDay: this.sql.exec(`SELECT date(first / 1000, 'unixepoch') day, COUNT(*) n FROM dev WHERE first >= ? GROUP BY day ORDER BY day`, since).toArray(),
      clicksPerDay: this.sql.exec(`SELECT day, clicks n FROM hit WHERE day >= ? ORDER BY day`, new Date(since).toISOString().slice(0, 10)).toArray(),
      last: one(`SELECT MAX(last) t FROM dev`).t || null,
    });
  }
}

export default {
  async fetch(req, env) {
    if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
    const path = new URL(req.url).pathname;
    if (path === '/dl' || path === '/stats') {
      if (path === '/dl' && req.method !== 'POST') return new Response('méthode', { status: 405, headers: CORS });
      const st = env.STATS.get(env.STATS.idFromName('global'));
      const res = await st.fetch(req);
      return new Response(res.body, { status: res.status, headers: { ...CORS, 'Content-Type': res.headers.get('Content-Type') || 'text/plain', 'Cache-Control': 'no-store' } });
    }
    const m = path.match(/^\/box\/([a-f0-9]{32})$/);
    if (!m) return new Response('Cyberdeck relay', { headers: CORS });
    const stub = env.BOX.get(env.BOX.idFromName(m[1]));
    const res = await stub.fetch(req);
    return new Response(res.body, { status: res.status, headers: CORS });
  },
};
