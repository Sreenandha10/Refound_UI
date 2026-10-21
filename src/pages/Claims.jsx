import { useEffect, useState } from 'react';
import api from '../api';
import PageHeader, { Empty, Spinner } from '../components/PageHeader';
import ClaimCard from '../components/ClaimCard';

export default function Claims() {
  const [mine, setMine] = useState(null);
  const [incoming, setIncoming] = useState(null);
  const [tab, setTab] = useState('mine');

  const load = () => {
    api.get('/claims/mine').then(({ data }) => setMine(data));
    api.get('/claims/incoming').then(({ data }) => setIncoming(data));
  };
  useEffect(load, []);
  if (!mine || !incoming) return <Spinner />;

  const history = [...mine.map((c) => ({ ...c, role: 'claimer' })), ...incoming.map((c) => ({ ...c, role: 'finder' }))].filter((c) => c.status === 'recovered');
  const lists = { mine: mine.filter((c) => c.status !== 'recovered').map((c) => ({ ...c, role: 'claimer' })), incoming: incoming.filter((c) => c.status !== 'recovered').map((c) => ({ ...c, role: 'finder' })), history };
  const pending = incoming.filter((c) => c.status === 'pending').length;
  const tabs = [['mine', 'My claims', mine.filter((c) => c.status !== 'recovered').length], ['incoming', 'On items I found', pending], ['history', 'Recovery history', history.length]];

  return (
    <>
      <PageHeader title="Claims" subtitle="Ownership claims, handovers and recovery history." />
      <div className="mb-6 flex gap-2 overflow-x-auto" role="tablist">
        {tabs.map(([k, label, n]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`btn btn-sm ${tab === k ? 'btn-primary' : 'btn-outline'}`}>{label}{n > 0 && ` (${n})`}</button>
        ))}
      </div>
      {lists[tab].length === 0 ? <Empty>{tab === 'history' ? 'Recovered items will appear here.' : 'No claims here yet.'}</Empty> : (
        <div className="space-y-5">{lists[tab].map((c) => <ClaimCard key={c._id} claim={c} role={c.role} onChange={load} />)}</div>
      )}
    </>
  );
}
