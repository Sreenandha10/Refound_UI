import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api, { errMsg, img } from '../api';
import { setToast } from '../store/notifSlice';
import { fmtDate } from '../utils';
import StatusBadge from './StatusBadge';

export default function ClaimCard({ claim, role, onChange }) {
  const dispatch = useDispatch();
  const [note, setNote] = useState('');
  const [plan, setPlan] = useState(claim.handoverPlan || '');
  const [busy, setBusy] = useState(false);
  const canReview = (role === 'finder' || role === 'admin') && claim.status === 'pending';
  const active = claim.status === 'approved' && role !== 'admin';

  const act = async (method, path, body, ok) => {
    setBusy(true);
    try {
      await api[method](`/claims/${claim._id}/${path}`, body);
      dispatch(setToast(ok));
      onChange();
    } catch (e) {
      dispatch(setToast(errMsg(e)));
    }
    setBusy(false);
  };

  const other = role === 'claimer' ? claim.finder : claim.claimer;
  const confirmedByMe = role === 'claimer' ? claim.ownerConfirmed : claim.finderConfirmed;

  return (
    <article className="card space-y-4">
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <Link to={`/items/${claim.foundItem?._id}`} className="text-lg font-semibold hover:text-moss">{claim.foundItem?.title}</Link>
          <p className="text-sm text-forest/70">
            {role === 'claimer' ? `Found by ${claim.finder?.name}` : `Claimed by ${claim.claimer?.name} for “${claim.lostItem?.title}”`} · {fmtDate(claim.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge bg-mist text-forest">{claim.match?.percentage}% match</span>
          <StatusBadge kind="claim" value={claim.status} />
        </div>
      </header>

      {role !== 'claimer' && (
        <div className="space-y-3 rounded-xl bg-cream p-4 text-sm">
          <p><span className="font-semibold">Proof:</span> {claim.proofDetails}</p>
          {claim.answers.map((a, i) => (
            <p key={i}><span className="font-semibold">{a.question}</span><br />{a.answer}</p>
          ))}
          {claim.proofImages.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {claim.proofImages.map((p) => (
                <a key={p} href={img(p)} target="_blank" rel="noreferrer"><img src={img(p)} alt="Proof" className="h-20 w-20 rounded-lg object-cover" /></a>
              ))}
            </div>
          )}
        </div>
      )}

      {claim.reviewNote && <p className="text-sm text-forest/70">Reviewer note: {claim.reviewNote}</p>}

      {canReview && (
        <div className="space-y-2">
          <input className="input" placeholder="Add a note (optional)" value={note} onChange={(e) => setNote(e.target.value)} aria-label="Review note" />
          <div className="flex gap-2">
            <button className="btn btn-primary btn-sm" disabled={busy} onClick={() => act('patch', 'review', { decision: 'approved', note }, 'Claim approved')}>Approve</button>
            <button className="btn btn-danger btn-sm" disabled={busy} onClick={() => act('patch', 'review', { decision: 'rejected', note }, 'Claim rejected')}>Reject</button>
          </div>
        </div>
      )}

      {active && (
        <div className="space-y-3 rounded-xl bg-mist/60 p-4 text-sm">
          <p className="font-semibold">Handover</p>
          <p>{other?.name}{other?.phone ? ` · ${other.phone}` : ''}</p>
          <div className="flex gap-2">
            <input className="input" placeholder="Where and when will you meet?" value={plan} onChange={(e) => setPlan(e.target.value)} aria-label="Handover plan" />
            <button className="btn btn-outline btn-sm" disabled={busy || !plan.trim()} onClick={() => act('patch', 'handover', { plan }, 'Handover plan shared')}>Share</button>
          </div>
          <p className="text-forest/70">
            Owner confirmed: {claim.ownerConfirmed ? 'yes' : 'not yet'} · Finder confirmed: {claim.finderConfirmed ? 'yes' : 'not yet'}
          </p>
          <div className="flex flex-wrap gap-2">
            <button className="btn btn-primary btn-sm" disabled={busy || confirmedByMe} onClick={() => act('patch', 'confirm', {}, 'Confirmation saved')}>
              {confirmedByMe ? 'You confirmed' : role === 'claimer' ? 'I received my item' : 'I handed over the item'}
            </button>
            <Link to={`/chat/${claim.match?._id}`} className="btn btn-outline btn-sm">Open chat</Link>
          </div>
        </div>
      )}

      {claim.status === 'recovered' && (
        <p className="rounded-xl bg-forest px-4 py-3 text-sm text-cream">Recovered on {fmtDate(claim.recoveredAt)}. This is saved in your recovery history.</p>
      )}
    </article>
  );
}
