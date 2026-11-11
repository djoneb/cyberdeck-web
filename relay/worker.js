// Relais Cyberdeck : boîte aux lettres temporaire pour transférer une sauvegarde CHIFFRÉE entre téléphone et PC.
// Le relais ne voit jamais la clé (elle reste dans le QR code) : il stocke un paquet illisible, effacé après 10 minutes.
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
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

export default {
  async fetch(req, env) {
    if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
    const m = new URL(req.url).pathname.match(/^\/box\/([a-f0-9]{32})$/);
    if (!m) return new Response('Cyberdeck relay', { headers: CORS });
    const stub = env.BOX.get(env.BOX.idFromName(m[1]));
    const res = await stub.fetch(req);
    return new Response(res.body, { status: res.status, headers: CORS });
  },
};
