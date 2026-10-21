import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../api';
import PageHeader, { Empty, Spinner } from '../components/PageHeader';
import ItemCard from '../components/ItemCard';
import { timeAgo } from '../utils';

export default function Dashboard() {
  const user = useSelector((s) => s.auth.user);
  const notes = useSelector((s) => s.notif.items);
  const [data, setData] = useState(null);

  useEffect(() => {
    Promise.all([api.get('/items/mine'), api.get('/matches'), api.get('/claims/mine'), api.get('/claims/incoming')]).then(
      ([items, matches, mine, incoming]) => setData({ items: items.data, matches: matches.data, mine: mine.data, incoming: incoming.data })
    );
  }, []);

  if (!data) return <Spinner />;
  const { items, matches, mine, incoming } = data;
  const stats = [
    ['Lost reports', items.filter((i) => i.type === 'lost').length],
    ['Found reports', items.filter((i) => i.type === 'found').length],
    ['Possible matches', matches.length],
    ['Recovered', items.filter((i) => i.status === 'RECOVERED').length],
  ];
  const waiting = incoming.filter((c) => c.status === 'pending').length;

  return (
    <>
      <PageHeader title={`Welcome, ${user.name.split(' ')[0]}`} subtitle="Here is where your reports stand.">
        <Link to="/report/lost" className="btn btn-primary">Report lost item</Link>
        <Link to="/report/found" className="btn btn-outline">Report found item</Link>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(([label, n], i) => (
          <div key={label} className={`rounded-2xl p-5 ${i === 3 ? 'bg-forest text-cream' : 'bg-mist/70'}`}>
            <p className="font-heading text-4xl font-bold">{n}</p>
            <p className={`mt-1 text-sm ${i === 3 ? 'text-leaf' : 'text-forest/70'}`}>{label}</p>
          </div>
        ))}
      </div>

      {(waiting > 0 || mine.some((c) => c.status === 'approved')) && (
        <Link to="/claims" className="mt-6 block rounded-2xl border border-moss/40 bg-leaf/30 p-4 text-sm font-medium hover:bg-leaf/50">
          {waiting > 0 ? `${waiting} claim${waiting > 1 ? 's' : ''} waiting for your review.` : 'You have a claim ready for handover.'} Open claims
        </Link>
      )}

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <section>
          <h2 className="mb-4 text-xl font-semibold">Top matches</h2>
          {matches.length === 0 ? (
            <Empty>No matches yet. We check again whenever a new report is added.</Empty>
          ) : (
            <ul className="space-y-3">
              {matches.slice(0, 4).map((m) => (
                <li key={m._id}>
                  <Link to="/matches" className="card flex items-center justify-between gap-4 hover:border-moss">
                    <span className="min-w-0"><span className="block truncate font-semibold">{m.lostItem.title}</span><span className="block truncate text-sm text-forest/70">with {m.foundItem.title}</span></span>
                    <span className="font-heading text-2xl font-bold text-moss">{m.percentage}%</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section>
          <h2 className="mb-4 text-xl font-semibold">Recent activity</h2>
          {notes.length === 0 ? <Empty>Nothing yet.</Empty> : (
            <ul className="divide-y divide-forest/10 rounded-2xl border border-forest/10 bg-white">
              {notes.slice(0, 5).map((n) => (
                <li key={n._id} className="p-4 text-sm"><p className="font-semibold">{n.title}</p><p className="text-forest/70">{n.message}</p><p className="mt-1 text-xs text-forest/50">{timeAgo(n.createdAt)}</p></li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {items.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold">Your latest reports</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.slice(0, 3).map((i) => <ItemCard key={i._id} item={i} />)}</div>
        </section>
      )}
    </>
  );
}
