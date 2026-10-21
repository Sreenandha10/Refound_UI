import { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api, { errMsg, img } from '../api';
import { setToast } from '../store/notifSlice';
import { toLocalInput } from '../utils';
import PageHeader, { Spinner } from '../components/PageHeader';

const blank = { title: '', category: '', brand: '', color: '', dateTime: toLocalInput(new Date()), location: '', description: '', lat: '', lng: '' };

export default function ReportItem() {
  const { type: paramType, id } = useParams();
  const editing = !!id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [type, setType] = useState(paramType);
  const [form, setForm] = useState(blank);
  const [questions, setQuestions] = useState(['']);
  const [categories, setCategories] = useState([]);
  const [existing, setExisting] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(editing);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  useEffect(() => {
    api.get('/categories').then(({ data }) => {
      setCategories(data);
      if (!editing) setForm((f) => ({ ...f, category: data[0]?.name || '' }));
    });
    if (editing) {
      api.get(`/items/${id}`).then(({ data }) => {
        setType(data.type);
        setForm({ ...blank, title: data.title, category: data.category, brand: data.brand, color: data.color, dateTime: toLocalInput(data.dateTime), location: data.location, description: data.description, lat: data.geo?.coordinates?.[1] ?? '', lng: data.geo?.coordinates?.[0] ?? '' });
        setExisting(data.images);
        setQuestions(data.questions.length ? data.questions : ['']);
        setLoading(false);
      }).catch(() => navigate('/my-items'));
    }
  }, [id]);

  useEffect(() => { if (!editing) { setType(paramType); setFiles([]); setForm((f) => ({ ...blank, category: f.category })); } }, [paramType]);

  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);

  if (!editing && !['lost', 'found'].includes(paramType)) return <Navigate to="/dashboard" replace />;
  if (loading) return <Spinner />;

  const room = 4 - existing.length;
  const locate = () => {
    if (!navigator.geolocation) return setError('Location is not available in this browser');
    navigator.geolocation.getCurrentPosition(
      (p) => setForm((f) => ({ ...f, lat: p.coords.latitude.toFixed(6), lng: p.coords.longitude.toFixed(6) })),
      () => setError('Could not read your location. You can still type the place name.')
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => v !== '' && fd.append(k, v));
    if (!editing) fd.append('type', type);
    if (type === 'found') fd.append('questions', JSON.stringify(questions.map((q) => q.trim()).filter(Boolean)));
    if (editing) fd.append('keepImages', JSON.stringify(existing));
    files.slice(0, Math.max(room, 0)).forEach((f) => fd.append('images', f));
    try {
      const { data } = editing ? await api.put(`/items/${id}`, fd) : await api.post('/items', fd);
      dispatch(setToast(editing ? 'Report updated' : 'Report submitted. We are checking for matches.'));
      navigate(`/items/${data._id}`);
    } catch (err) {
      setError(errMsg(err));
      setBusy(false);
    }
  };

  const isLost = type === 'lost';

  return (
    <>
      <PageHeader title={editing ? `Edit ${type} report` : isLost ? 'Report a lost item' : 'Report a found item'} subtitle={isLost ? 'The more detail you add, the better the match.' : 'Keep identifying details for the verification questions so only the real owner can claim it.'} />
      <form onSubmit={submit} className="card max-w-3xl space-y-5">
        <div>
          <label className="label" htmlFor="title">Item name</label>
          <input id="title" className="input" required maxLength={120} value={form.title} onChange={set('title')} placeholder="e.g. Black leather wallet" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="category">Category</label>
            <select id="category" className="input" required value={form.category} onChange={set('category')}>{categories.map((c) => <option key={c._id}>{c.name}</option>)}</select>
          </div>
          <div><label className="label" htmlFor="brand">Brand</label><input id="brand" className="input" value={form.brand} onChange={set('brand')} placeholder="Optional" /></div>
          <div><label className="label" htmlFor="color">Color</label><input id="color" className="input" value={form.color} onChange={set('color')} placeholder="e.g. black, silver" /></div>
          <div><label className="label" htmlFor="dt">{isLost ? 'Lost on' : 'Found on'}</label><input id="dt" type="datetime-local" className="input" required max={toLocalInput(new Date())} value={form.dateTime} onChange={set('dateTime')} /></div>
        </div>
        <div>
          <label className="label" htmlFor="loc">{isLost ? 'Where did you lose it?' : 'Where did you find it?'}</label>
          <div className="flex gap-2">
            <input id="loc" className="input" required value={form.location} onChange={set('location')} placeholder="Area, street or landmark" />
            <button type="button" className="btn btn-outline shrink-0" onClick={locate}>Pin my location</button>
          </div>
          {form.lat && <p className="mt-1.5 text-xs text-moss">Pinned at {Number(form.lat).toFixed(4)}, {Number(form.lng).toFixed(4)}. This improves nearby matching.</p>}
        </div>
        <div>
          <label className="label" htmlFor="desc">Description</label>
          <textarea id="desc" className="input min-h-28" maxLength={1000} value={form.description} onChange={set('description')} placeholder="Size, material, condition, anything distinctive" />
        </div>

        {type === 'found' && (
          <fieldset className="space-y-2">
            <legend className="label">Verification questions <span className="font-normal text-forest/60">(up to 3, only the owner should know the answers)</span></legend>
            {questions.map((q, i) => (
              <input key={i} className="input" aria-label={`Question ${i + 1}`} value={q} onChange={(e) => setQuestions(questions.map((x, j) => (j === i ? e.target.value : x)))} placeholder="e.g. What card is kept in the front pocket?" />
            ))}
            {questions.length < 3 && <button type="button" className="btn btn-outline btn-sm" onClick={() => setQuestions([...questions, ''])}>Add another question</button>}
          </fieldset>
        )}

        <div>
          <label className="label" htmlFor="imgs">Photos <span className="font-normal text-forest/60">(up to 4)</span></label>
          {existing.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-3">
              {existing.map((p) => (
                <div key={p} className="relative">
                  <img src={img(p)} alt="" className="h-20 w-20 rounded-lg object-cover" />
                  <button type="button" onClick={() => setExisting(existing.filter((x) => x !== p))} className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-rust text-xs text-white" aria-label="Remove photo">×</button>
                </div>
              ))}
            </div>
          )}
          {room > 0 && <input id="imgs" type="file" accept="image/*" multiple className="input" onChange={(e) => setFiles([...e.target.files].slice(0, room))} />}
          {previews.length > 0 && <div className="mt-3 flex flex-wrap gap-3">{previews.map((src) => <img key={src} src={src} alt="" className="h-20 w-20 rounded-lg object-cover" />)}</div>}
        </div>

        {error && <p role="alert" className="rounded-lg bg-rust-soft px-3 py-2 text-sm text-rust">{error}</p>}
        <div className="flex gap-3">
          <button className="btn btn-primary" disabled={busy}>{busy ? 'Saving…' : editing ? 'Save changes' : 'Submit report'}</button>
          <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </form>
    </>
  );
}
