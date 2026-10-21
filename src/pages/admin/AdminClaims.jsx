import { useEffect, useState } from 'react';
import api from '../../api';
import PageHeader, { Empty, Spinner } from '../../components/PageHeader';
import ClaimCard from '../../components/ClaimCard';

export default function AdminClaims() {
  const [claims, setClaims] = useState(null);
  const [status, setStatus] = useState('pending');

  const load = () => api.get('/admin/claims', { params: { status: status || undefined } }).then(({ data }) => setClaims(data));
  useEffect(() => { setClaims(null); load(); }, [status]);

  return (
    <>
      <PageHeader title="Ownership claims" subtitle="Review claims, compare proof and stop false ownership attempts.">
        <select className="input w-auto" aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">Pending</option><option value="approved">Approved</option><option value="recovered">Recovered</option><option value="rejected">Rejected</option><option value="">All</option>
        </select>
      </PageHeader>
      {!claims ? <Spinner /> : claims.length === 0 ? <Empty>No claims in this view.</Empty> : (
        <div className="space-y-5">{claims.map((c) => <ClaimCard key={c._id} claim={c} role="admin" onChange={load} />)}</div>
      )}
    </>
  );
}
