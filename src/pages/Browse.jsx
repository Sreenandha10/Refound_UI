import { useEffect, useState } from 'react';
import api from '../api';
import PageHeader, { Empty, Spinner } from '../components/PageHeader';
import ItemCard from '../components/ItemCard';

const initial = { q: '', type: '', category: '', color: '', location: '', status: '' };

export default function Browse() {
  const [filters, setFilters] = useState(initial);
  const [near, setNear] = useState(null);
  const [radius, setRadius] = useState(10);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(null);
  const [geoError, setGeoError] = useState('');
  const set = (k) => (e) => { setFilters({ ...filters, [k]: e.target.value }); setPage(1); };

  useEffect(() => { api.get('/categories').then(({ data }) => setCategories(data)); }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      const params = { ...filters, page, limit: 12 };
      Object.keys(params).forEach((k) => params[k] === '' && delete params[k]);
      if (near) Object.assign(params, { lat: near.lat, lng: near.lng, radius });
      api.get('/items', { params }).then(({ data }) => setResult(data));
    }, 300);
    return () => clearTimeout(t);
  }, [filters, page, near, radius]);

  const toggleNear = () => {
    if (near) return setNear(null);
    setGeoError('');
    navigator.geolocation?.getCurrentPosition(
      (p) => { setNear({ lat: p.coords.latitude, lng: p.coords.longitude }); setPage(1); },
      () => setGeoError('Allow location access to search nearby items.')
    );
  };

  return (
    <>
      <PageHeader title="Browse items" subtitle="Search every open lost and found report." />
      <div className="card mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <input className="input sm:col-span-2" placeholder="Search by name, brand or description" aria-label="Search" value={filters.q} onChange={set('q')} />
        <select className="input" aria-label="Type" value={filters.type} onChange={set('type')}><option value="">Lost and found</option><option value="lost">Lost</option><option value="found">Found</option></select>
        <select className="input" aria-label="Category" value={filters.category} onChange={set('category')}><option value="">All categories</option>{categories.map((c) => <option key={c._id}>{c.name}</option>)}</select>
        <input className="input" placeholder="Color" aria-label="Color" value={filters.color} onChange={set('color')} />
        <input className="input" placeholder="Location" aria-label="Location" value={filters.location} onChange={set('location')} />
        <select className="input" aria-label="Status" value={filters.status} onChange={set('status')}><option value="">Open items</option><option value="REPORTED">Reported</option><option value="POTENTIAL_MATCH">Potential match</option><option value="UNDER_CLAIM">Under claim</option><option value="RECOVERED">Recovered</option></select>
        <div className="flex gap-2">
          <button type="button" onClick={toggleNear} className={`btn flex-1 ${near ? 'btn-primary' : 'btn-outline'}`} aria-pressed={!!near}>{near ? 'Near me: on' : 'Near me'}</button>
          {near && <select className="input w-24" aria-label="Radius" value={radius} onChange={(e) => setRadius(e.target.value)}>{[2, 5, 10, 25, 50].map((r) => <option key={r} value={r}>{r} km</option>)}</select>}
        </div>
        {geoError && <p className="text-sm text-rust sm:col-span-2 lg:col-span-4">{geoError}</p>}
      </div>

      {!result ? <Spinner /> : result.items.length === 0 ? (
        <Empty>No items match these filters.</Empty>
      ) : (
        <>
          <p className="mb-3 text-sm text-forest/70">{result.total} item{result.total !== 1 && 's'}</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{result.items.map((i) => <ItemCard key={i._id} item={i} />)}</div>
          {result.pages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <button className="btn btn-outline btn-sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
              <span className="text-sm">Page {result.page} of {result.pages}</span>
              <button className="btn btn-outline btn-sm" disabled={page >= result.pages} onClick={() => setPage(page + 1)}>Next</button>
            </div>
          )}
        </>
      )}
    </>
  );
}
