import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import api, { errMsg } from '../../api';
import { setToast } from '../../store/notifSlice';
import PageHeader, { Spinner } from '../../components/PageHeader';

export default function AdminCategories() {
  const dispatch = useDispatch();
  const [cats, setCats] = useState(null);
  const [name, setName] = useState('');
  const [editing, setEditing] = useState(null);

  const load = () => api.get('/categories').then(({ data }) => setCats(data));
  useEffect(() => { load(); }, []);

  const act = async (fn, msg) => {
    try { await fn(); dispatch(setToast(msg)); load(); return true; } catch (e) { dispatch(setToast(errMsg(e))); return false; }
  };
  const add = async (e) => {
    e.preventDefault();
    if (await act(() => api.post('/admin/categories', { name }), 'Category added')) setName('');
  };
  const save = async () => {
    if (await act(() => api.put(`/admin/categories/${editing._id}`, { name: editing.name }), 'Category renamed')) setEditing(null);
  };

  if (!cats) return <Spinner />;

  return (
    <>
      <PageHeader title="Item categories" subtitle="Categories drive the matching engine, so rename with care." />
      <form onSubmit={add} className="mb-6 flex max-w-lg gap-3">
        <input className="input" placeholder="New category name" aria-label="New category" value={name} onChange={(e) => setName(e.target.value)} required />
        <button className="btn btn-primary shrink-0">Add</button>
      </form>
      <ul className="max-w-lg divide-y divide-forest/10 overflow-hidden rounded-2xl border border-forest/10 bg-white">
        {cats.map((c) => (
          <li key={c._id} className="flex items-center justify-between gap-3 px-4 py-3">
            {editing?._id === c._id ? (
              <>
                <input className="input" aria-label="Category name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                <div className="flex gap-2"><button className="btn btn-primary btn-sm" onClick={save}>Save</button><button className="btn btn-outline btn-sm" onClick={() => setEditing(null)}>Cancel</button></div>
              </>
            ) : (
              <>
                <span className="font-medium">{c.name}</span>
                <div className="flex gap-2">
                  <button className="btn btn-outline btn-sm" onClick={() => setEditing({ ...c })}>Rename</button>
                  <button className="btn btn-danger btn-sm" onClick={() => window.confirm(`Delete "${c.name}"?`) && act(() => api.delete(`/admin/categories/${c._id}`), 'Category deleted')}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
