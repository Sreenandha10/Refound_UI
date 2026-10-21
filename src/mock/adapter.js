// Fake axios adapter: answers every API call with sample data so the UI works without a backend.
import * as D from './data';

const match = (c, q) => !q || c.toLowerCase().includes(String(q).toLowerCase());
const role = () => (window.location.pathname.startsWith('/admin') ? 'admin' : 'user');

function route(method, path, params = {}, body) {
  if (method === 'post' && path === '/auth/login') return { user: body?.as === 'admin' ? D.admin : D.me, token: 'demo' };
  if (method === 'post' && path === '/auth/register') return { user: { ...D.me, name: body?.name || D.me.name, email: body?.email || D.me.email }, token: 'demo' };
  if (path === '/auth/me') return { user: role() === 'admin' ? D.admin : D.me };
  if (method === 'put' && path === '/users/me') return { user: { ...D.me, name: body?.name, phone: body?.phone } };
  if (path === '/public/stats') return D.publicStats;
  if (path === '/categories') return D.categories;
  if (path === '/notifications') return D.notifications;
  if (path === '/messages/rooms') return D.rooms;
  if (path.startsWith('/messages/')) return D.getMessages(path.split('/')[2]);
  if (path === '/matches') return params.item ? D.matches.filter((m) => m.lostItem._id === params.item || m.foundItem._id === params.item) : D.matches;
  if (path === '/claims/mine') return D.myClaims;
  if (path === '/claims/incoming') return D.incomingClaims;
  if (path === '/items/mine') return D.items.filter((i) => i.user._id === 'u1');
  if (path === '/items' && method === 'get') {
    let list = D.items.filter((i) => (params.status ? i.status === params.status : i.status !== 'RECOVERED'));
    if (params.type) list = list.filter((i) => i.type === params.type);
    if (params.category) list = list.filter((i) => i.category === params.category);
    if (params.q) list = list.filter((i) => match(`${i.title} ${i.brand} ${i.description}`, params.q));
    if (params.color) list = list.filter((i) => match(i.color, params.color));
    if (params.location) list = list.filter((i) => match(i.location, params.location));
    return { items: list, total: list.length, page: 1, pages: 1, limit: 12 };
  }
  if (path === '/items' && method === 'post') return { _id: 'i1' };
  if (/^\/items\/[^/]+$/.test(path)) {
    const id = path.split('/')[2];
    if (method === 'get') return D.byId(id) || D.items[0];
    return { _id: id };
  }
  if (path === '/admin/stats') return D.adminStats;
  if (path === '/admin/users') {
    let u = D.adminUsers.filter((x) => match(`${x.name} ${x.email}`, params.q));
    if (params.reported) u = u.filter((x) => x.reports.length);
    return u;
  }
  if (path === '/admin/items') {
    let l = D.items.filter((i) => match(i.title, params.q));
    if (params.type) l = l.filter((i) => i.type === params.type);
    if (params.verification) l = l.filter((i) => i.verification === params.verification);
    if (params.flagged) l = l.filter((i) => i.flags.length);
    return l;
  }
  if (path === '/admin/claims') return params.status ? D.claims.filter((c) => c.status === params.status) : D.claims;
  if (method === 'post' && path.endsWith('/report')) return { message: 'Thanks, our team will review this.' };
  return {};
}

export default function mockAdapter(config) {
  const body = typeof config.data === 'string' ? (() => { try { return JSON.parse(config.data); } catch { return {}; } })() : config.data;
  const data = route((config.method || 'get').toLowerCase(), config.url, config.params, body);
  return Promise.resolve({ data: JSON.parse(JSON.stringify(data ?? {})), status: 200, statusText: 'OK', headers: {}, config });
}
