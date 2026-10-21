import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api, { errMsg, img } from '../api';
import { setToast } from '../store/notifSlice';
import { fmtDate } from '../utils';
import { Spinner } from '../components/PageHeader';
import StatusBadge, { TypeBadge } from '../components/StatusBadge';
import RecoveryTrack from '../components/RecoveryTrack';
import ClaimForm from '../components/ClaimForm';

export default function ItemDetail() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const me = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [photo, setPhoto] = useState(0);
  const [note, setNote] = useState('');
  const [claiming, setClaiming] = useState(params.get('claim') === '1');

  const load = () => {
    api.get(`/items/${id}`).then(({ data }) => { setItem(data); setNote(data.statusNote); }).catch(() => navigate('/browse'));
    api.get('/matches', { params: { item: id } }).then(({ data }) => setMatches(data));
  };
  useEffect(() => { setItem(null); setPhoto(0); load(); }, [id]);

  if (!item) return <Spinner />;
  const owner = item.user._id === me._id;
  const toast = (m) => dispatch(setToast(m));

  const remove = async () => {
    if (!window.confirm('Delete this report?')) return;
    try { await api.delete(`/items/${id}`); toast('Report deleted'); navigate('/my-items'); } catch (e) { toast(errMsg(e)); }
  };
  const saveNote = async () => {
    try { await api.patch(`/items/${id}/note`, { statusNote: note }); toast('Status update saved'); } catch (e) { toast(errMsg(e)); }
  };
  const report = async (path, label) => {
    const reason = window.prompt(`Why are you reporting this ${label}?`);
    if (!reason) return;
    try { const { data } = await api.post(path, { reason }); toast(data.message); } catch (e) { toast(errMsg(e)); }
  };

  const canClaim = !owner && item.type === 'found' && ['REPORTED', 'POTENTIAL_MATCH', 'UNDER_CLAIM'].includes(item.status);
  const editable = owner && !['UNDER_CLAIM', 'RECOVERED'].includes(item.status);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
      <div>
        <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-mist">
          {item.images[photo] ? <img src={img(item.images[photo])} alt={item.title} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-forest/50">No photo</div>}
        </div>
        {item.images.length > 1 && (
          <div className="mt-3 flex gap-2">
            {item.images.map((p, i) => (
              <button key={p} onClick={() => setPhoto(i)} aria-label={`Photo ${i + 1}`} className={`h-16 w-16 overflow-hidden rounded-lg border-2 ${i === photo ? 'border-moss' : 'border-transparent'}`}><img src={img(p)} alt="" className="h-full w-full object-cover" /></button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <TypeBadge type={item.type} /><StatusBadge value={item.status} />
            {item.verification === 'verified' && <StatusBadge kind="verification" value="verified" />}
          </div>
          <h1 className="text-3xl font-semibold">{item.title}</h1>
          <p className="mt-1 text-forest/70">Reported by {owner ? 'you' : item.user.name}</p>
        </div>

        <RecoveryTrack status={item.status} />

        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          {[['Category', item.category], ['Brand', item.brand || 'Not given'], ['Color', item.color || 'Not given'], [item.type === 'lost' ? 'Lost on' : 'Found on', fmtDate(item.dateTime)], ['Location', item.location]].map(([k, v]) => (
            <div key={k} className={k === 'Location' ? 'col-span-2' : ''}><dt className="text-forest/60">{k}</dt><dd className="font-medium">{v}</dd></div>
          ))}
        </dl>
        {item.description && <p className="text-sm leading-relaxed">{item.description}</p>}
        {item.statusNote && !owner && <p className="rounded-xl bg-mist/60 px-4 py-3 text-sm"><span className="font-semibold">Update:</span> {item.statusNote}</p>}

        {owner && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {editable && <Link to={`/edit/${item._id}`} className="btn btn-outline btn-sm">Edit</Link>}
              {item.status !== 'UNDER_CLAIM' && <button onClick={remove} className="btn btn-danger btn-sm">Delete</button>}
            </div>
            {item.status !== 'RECOVERED' && (
              <div className="flex gap-2">
                <input className="input" aria-label="Status update" placeholder={item.type === 'found' ? 'e.g. Kept safe at the bus stand office' : 'e.g. Still searching, call me'} value={note} onChange={(e) => setNote(e.target.value)} maxLength={200} />
                <button className="btn btn-outline shrink-0" onClick={saveNote}>Update</button>
              </div>
            )}
          </div>
        )}

        {!owner && (
          <div className="flex flex-wrap gap-2">
            {canClaim && !claiming && <button className="btn btn-primary" onClick={() => setClaiming(true)}>This is mine, claim it</button>}
            {item.type === 'lost' && <Link to="/report/found" className="btn btn-outline">I found this</Link>}
            <button className="btn btn-outline btn-sm" onClick={() => report(`/items/${id}/report`, 'report')}>Report suspicious</button>
            <button className="btn btn-outline btn-sm" onClick={() => report(`/users/${item.user._id}/report`, 'user')}>Report user</button>
          </div>
        )}
      </div>

      {claiming && canClaim && <div className="lg:col-span-2"><ClaimForm item={item} /></div>}

      {owner && (
        <section className="lg:col-span-2">
          <h2 className="mb-4 text-xl font-semibold">Possible {item.type === 'lost' ? 'found items' : 'owners'}</h2>
          {matches.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-forest/25 bg-mist/40 p-6 text-sm text-forest/70">No matches above 60% yet. You will be notified as soon as one appears.</p>
          ) : (
            <ul className="space-y-3">
              {matches.map((m) => {
                const other = item.type === 'lost' ? m.foundItem : m.lostItem;
                return (
                  <li key={m._id} className="card flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0"><p className="font-semibold">{other.title}</p><p className="text-sm text-forest/70">{other.location}</p></div>
                    <div className="flex items-center gap-3">
                      <span className="font-heading text-2xl font-bold text-moss">{m.percentage}%</span>
                      <Link to={`/items/${other._id}${item.type === 'lost' ? `?claim=1&lost=${item._id}` : ''}`} className="btn btn-outline btn-sm">{item.type === 'lost' ? 'View and claim' : 'View lost report'}</Link>
                      <Link to={`/chat/${m._id}`} className="btn btn-primary btn-sm">Chat</Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
