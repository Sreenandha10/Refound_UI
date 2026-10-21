import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import api, { errMsg } from '../../api';
import { setToast } from '../../store/notifSlice';
import { fmtDay } from '../../utils';
import PageHeader, { Empty, Spinner } from '../../components/PageHeader';

export default function AdminUsers() {
  const dispatch = useDispatch();
  const [users, setUsers] = useState(null);
  const [q, setQ] = useState('');
  const [reported, setReported] = useState(false);

  const load = () => api.get('/admin/users', { params: { q, reported: reported ? 1 : undefined } }).then(({ data }) => setUsers(data));
  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [q, reported]);

  const act = async (fn, msg) => {
    try { await fn(); dispatch(setToast(msg)); load(); } catch (e) { dispatch(setToast(errMsg(e))); }
  };

  return (
    <>
      <PageHeader title="Users" subtitle="Manage accounts and handle reports of fraud." />
      <div className="mb-5 flex flex-wrap gap-3">
        <input className="input max-w-xs" placeholder="Search name or email" aria-label="Search users" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className={`btn ${reported ? 'btn-primary' : 'btn-outline'}`} aria-pressed={reported} onClick={() => setReported(!reported)}>Reported only</button>
      </div>
      {!users ? <Spinner /> : users.length === 0 ? <Empty>No users found.</Empty> : (
        <div className="overflow-x-auto rounded-2xl border border-forest/10 bg-white">
          <table className="w-full min-w-[720px]">
            <thead className="border-b border-forest/10"><tr><th className="th">User</th><th className="th">Joined</th><th className="th">Risk</th><th className="th">Reports against user</th><th className="th">Status</th><th className="th" /></tr></thead>
            <tbody className="divide-y divide-forest/10">
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="td"><p className="font-semibold">{u.name}</p><p className="text-forest/60">{u.email}</p></td>
                  <td className="td">{fmtDay(u.createdAt)}</td>
                  <td className="td"><span className={`badge ${u.fraudScore >= 3 ? 'bg-rust-soft text-rust' : 'bg-mist text-forest'}`}>{u.fraudScore}</span></td>
                  <td className="td max-w-xs">{u.reports.length === 0 ? <span className="text-forest/50">None</span> : <ul className="space-y-1 text-xs">{u.reports.map((r, i) => <li key={i}><span className="font-semibold">{r.by?.name || 'User'}:</span> {r.reason}</li>)}</ul>}</td>
                  <td className="td"><span className={`badge ${u.isBlocked ? 'bg-rust-soft text-rust' : 'bg-leaf text-forest'}`}>{u.isBlocked ? 'Blocked' : 'Active'}</span></td>
                  <td className="td">
                    <div className="flex flex-wrap justify-end gap-2">
                      {u.reports.length > 0 && <button className="btn btn-outline btn-sm" onClick={() => act(() => api.patch(`/admin/users/${u._id}/clear-reports`), 'Reports dismissed')}>Dismiss</button>}
                      <button className={`btn btn-sm ${u.isBlocked ? 'btn-outline' : 'btn-danger'}`} onClick={() => act(() => api.patch(`/admin/users/${u._id}/block`, { blocked: !u.isBlocked }), u.isBlocked ? 'User unblocked' : 'User blocked')}>{u.isBlocked ? 'Unblock' : 'Block'}</button>
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
