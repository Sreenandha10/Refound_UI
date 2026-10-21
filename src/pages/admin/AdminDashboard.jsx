import { useEffect, useState } from 'react';
import api from '../../api';
import PageHeader, { Empty, Spinner } from '../../components/PageHeader';
import { fmtDay } from '../../utils';

const monthName = (m) => new Date(2000, m - 1, 1).toLocaleString(undefined, { month: 'short' });

export default function AdminDashboard() {
  const [s, setS] = useState(null);
  useEffect(() => { api.get('/admin/stats').then(({ data }) => setS(data)); }, []);
  if (!s) return <Spinner />;

  const tiles = [
    ['Registered users', s.users], ['Lost reports', s.lost], ['Found reports', s.found], ['Recovered', s.recovered],
    ['Recovery rate', `${s.recoveryRate}%`], ['Active claims', s.activeClaims], ['Flagged reports', s.flaggedItems], ['Reported users', s.reportedUsers],
  ];
  const peak = Math.max(1, ...s.monthly.map((m) => m.reported));
  const stages = ['REPORTED', 'POTENTIAL_MATCH', 'UNDER_CLAIM', 'RECOVERED'];
  const count = (k) => s.byStatus.find((x) => x._id === k)?.count || 0;

  return (
    <>
      <PageHeader title="Recovery overview" subtitle="Live numbers across the platform." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {tiles.map(([label, n], i) => (
          <div key={label} className={`rounded-2xl p-5 ${i === 4 ? 'bg-forest text-cream' : 'bg-mist/70'}`}>
            <p className="font-heading text-3xl font-bold">{n}</p>
            <p className={`mt-1 text-sm ${i === 4 ? 'text-leaf' : 'text-forest/70'}`}>{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="card">
          <h2 className="mb-4 text-lg font-semibold">Reports per month</h2>
          {s.monthly.length === 0 ? <Empty>No reports yet.</Empty> : (
            <div className="flex h-44 items-end gap-3">
              {s.monthly.map((m) => (
                <div key={`${m._id.y}-${m._id.m}`} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-xs tabular-nums">{m.reported}</span>
                  <div className="relative w-full overflow-hidden rounded-t-md bg-leaf" style={{ height: `${(m.reported / peak) * 100}%`, minHeight: 4 }} title={`${m.recovered} recovered`}>
                    <div className="absolute inset-x-0 bottom-0 bg-forest" style={{ height: `${(m.recovered / m.reported) * 100}%` }} />
                  </div>
                  <span className="text-xs text-forest/60">{monthName(m._id.m)}</span>
                </div>
              ))}
            </div>
          )}
          <p className="mt-3 text-xs text-forest/60">Light bars are reports, dark portion is recovered.</p>
        </section>

        <section className="card">
          <h2 className="mb-4 text-lg font-semibold">Pipeline</h2>
          <ul className="space-y-3">
            {stages.map((k) => (
              <li key={k} className="grid grid-cols-[120px_1fr_36px] items-center gap-3 text-sm">
                <span>{k.replace('_', ' ').toLowerCase().replace(/^./, (c) => c.toUpperCase())}</span>
                <div className="h-2 overflow-hidden rounded-full bg-mist"><div className="h-full rounded-full bg-moss" style={{ width: `${(count(k) / Math.max(1, s.lost + s.found)) * 100}%` }} /></div>
                <span className="text-right tabular-nums">{count(k)}</span>
              </li>
            ))}
          </ul>
          <h3 className="mb-2 mt-6 font-semibold">Latest recoveries</h3>
          {s.recent.length === 0 ? <p className="text-sm text-forest/60">None yet.</p> : (
            <ul className="space-y-1 text-sm">{s.recent.map((r) => <li key={r._id}>{r.item} returned to {r.claimer} <span className="text-forest/50">· {fmtDay(r.at)}</span></li>)}</ul>
          )}
        </section>
      </div>

      <section className="card mt-6 overflow-x-auto">
        <h2 className="mb-3 text-lg font-semibold">By category</h2>
        <table className="w-full min-w-[420px]">
          <thead><tr><th className="th">Category</th><th className="th">Lost</th><th className="th">Found</th><th className="th">Recovered</th></tr></thead>
          <tbody className="divide-y divide-forest/10">
            {s.byCategory.map((c) => <tr key={c._id}><td className="td font-medium">{c._id}</td><td className="td">{c.lost}</td><td className="td">{c.found}</td><td className="td">{c.recovered}</td></tr>)}
          </tbody>
        </table>
      </section>
    </>
  );
}
