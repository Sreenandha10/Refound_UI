import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import PageHeader, { Empty, Spinner } from '../components/PageHeader';
import ItemCard from '../components/ItemCard';

const tabs = [['all', 'All'], ['lost', 'Lost'], ['found', 'Found'], ['RECOVERED', 'Recovered']];

export default function MyItems() {
  const [items, setItems] = useState(null);
  const [tab, setTab] = useState('all');
  useEffect(() => { api.get('/items/mine').then(({ data }) => setItems(data)); }, []);
  if (!items) return <Spinner />;

  const shown = items.filter((i) => tab === 'all' || i.type === tab || i.status === tab);

  return (
    <>
      <PageHeader title="My reports" subtitle="Track every item from report to recovery.">
        <Link to="/report/lost" className="btn btn-primary">Report lost</Link>
        <Link to="/report/found" className="btn btn-outline">Report found</Link>
      </PageHeader>
      <div className="mb-6 flex gap-2 overflow-x-auto" role="tablist">
        {tabs.map(([k, label]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`btn btn-sm ${tab === k ? 'btn-primary' : 'btn-outline'}`}>{label}</button>
        ))}
      </div>
      {shown.length === 0 ? <Empty>Nothing here yet.</Empty> : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{shown.map((i) => <ItemCard key={i._id} item={i} />)}</div>
      )}
    </>
  );
}
