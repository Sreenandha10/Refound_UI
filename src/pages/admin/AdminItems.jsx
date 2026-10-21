import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api, { errMsg } from '../../api';
import { setToast } from '../../store/notifSlice';
import { fmtDay } from '../../utils';
import PageHeader, { Empty, Spinner } from '../../components/PageHeader';
import StatusBadge, { TypeBadge } from '../../components/StatusBadge';

export default function AdminItems() {
  const dispatch = useDispatch();
  const [items, setItems] = useState(null);
  const [f, setF] = useState({ q: '', type: '', verification: '', flagged: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const load = () => {
    const params = { ...f };
    Object.keys(params).forEach((k) => !params[k] && delete params[k]);
    api.get('/admin/items', { params }).then(({ data }) => setItems(data));
  };
  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [f]);

  const act = async (fn, msg) => {
    try { await fn(); dispatch(setToast(msg)); load(); } catch (e) { dispatch(setToast(errMsg(e))); }
  };
  const reject = (id) => {
    const note = window.prompt('Reason for rejecting this report (shown to the owner):');
    if (note !== null) act(() => api.patch(`/admin/items/${id}/verify`, { decision: 'rejected', note }), 'Report rejected');
  };

  return (
    <>
      <PageHeader title="Lost and found reports" subtitle="Verify genuine reports and remove suspicious ones." />
      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <input className="input" placeholder="Search title" aria-label="Search" value={f.q} onChange={set('q')} />
        <select className="input" aria-label="Type" value={f.type} onChange={set('type')}><option value="">Lost and found</option><option value="lost">Lost</option><option value="found">Found</option></select>
        <select className="input" aria-label="Verification" value={f.verification} onChange={set('verification')}><option value="">Any verification</option><option value="unverified">Unverified</option><option value="verified">Verified</option><option value="rejected">Rejected</option></select>
        <select className="input" aria-label="Flags" value={f.flagged} onChange={set('flagged')}><option value="">All reports</option><option value="1">Flagged by users</option></select>
      </div>
      {!items ? <Spinner /> : items.length === 0 ? <Empty>No reports match.</Empty> : (
        <div className="overflow-x-auto rounded-2xl border border-forest/10 bg-white">
          <table className="w-full min-w-[820px]">
            <thead className="border-b border-forest/10"><tr><th className="th">Item</th><th className="th">Reporter</th><th className="th">Status</th><th className="th">Verification</th><th className="th">Flags</th><th className="th" /></tr></thead>
            <tbody className="divide-y divide-forest/10">
              {items.map((i) => (
                <tr key={i._id}>
                  <td className="td"><div className="mb-1 flex gap-2"><TypeBadge type={i.type} /></div><Link to={`/items/${i._id}`} className="font-semibold hover:text-moss">{i.title}</Link><p className="text-forest/60">{i.category} · {i.location} · {fmtDay(i.dateTime)}</p></td>
                  <td className="td">{i.user?.name}<p className="text-forest/60">{i.user?.email}</p></td>
                  <td className="td"><StatusBadge value={i.status} /></td>
                  <td className="td"><StatusBadge kind="verification" value={i.verification} />{i.verificationNote && <p className="mt-1 text-xs text-forest/60">{i.verificationNote}</p>}</td>
                  <td className="td max-w-[200px]">{i.flags.length === 0 ? <span className="text-forest/50">None</span> : <ul className="space-y-1 text-xs">{i.flags.map((fl, n) => <li key={n}>{fl.reason}</li>)}</ul>}</td>
                  <td className="td">
                    <div className="flex flex-wrap justify-end gap-2">
                      {i.verification !== 'verified' && <button className="btn btn-primary btn-sm" onClick={() => act(() => api.patch(`/admin/items/${i._id}/verify`, { decision: 'verified' }), 'Report verified')}>Verify</button>}
                      {i.verification !== 'rejected' && <button className="btn btn-outline btn-sm" onClick={() => reject(i._id)}>Reject</button>}
                      <button className="btn btn-danger btn-sm" onClick={() => window.confirm('Delete this report?') && act(() => api.delete(`/admin/items/${i._id}`), 'Report deleted')}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
