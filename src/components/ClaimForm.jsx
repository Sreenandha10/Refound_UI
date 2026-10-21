import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api, { errMsg } from '../api';
import { setToast } from '../store/notifSlice';

export default function ClaimForm({ item }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [lostItems, setLostItems] = useState(null);
  const [lostItem, setLostItem] = useState(params.get('lost') || '');
  const [proofDetails, setProofDetails] = useState('');
  const [answers, setAnswers] = useState(item.questions.map(() => ''));
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get('/items/mine').then(({ data }) => {
      const open = data.filter((i) => i.type === 'lost' && i.status !== 'RECOVERED');
      setLostItems(open);
      if (!lostItem && open.length) setLostItem(open[0]._id);
    });
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    const fd = new FormData();
    fd.append('foundItem', item._id);
    fd.append('lostItem', lostItem);
    fd.append('proofDetails', proofDetails);
    fd.append('answers', JSON.stringify(answers.map((answer) => ({ answer }))));
    files.forEach((f) => fd.append('proofImages', f));
    try {
      await api.post('/claims', fd);
      dispatch(setToast('Claim sent. The finder will review it.'));
      navigate('/claims');
    } catch (err) {
      setError(errMsg(err));
      setBusy(false);
    }
  };

  if (lostItems && !lostItems.length) {
    return (
      <div className="card border-moss/40 bg-mist/50">
        <h3 className="text-lg font-semibold">Report your lost item first</h3>
        <p className="mt-1 text-sm text-forest/70">A claim is linked to your own lost report, so we can compare the details.</p>
        <Link to="/report/lost" className="btn btn-primary mt-4">Report a lost item</Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card space-y-4 border-moss/40">
      <h3 className="text-lg font-semibold">Claim this item</h3>
      <div>
        <label className="label" htmlFor="lost">Which lost report is this?</label>
        <select id="lost" className="input" value={lostItem} onChange={(e) => setLostItem(e.target.value)} required>
          {(lostItems || []).map((i) => <option key={i._id} value={i._id}>{i.title}</option>)}
        </select>
      </div>
      {item.questions.map((q, i) => (
        <div key={i}>
          <label className="label" htmlFor={`q${i}`}>{q}</label>
          <input id={`q${i}`} className="input" required value={answers[i]} onChange={(e) => setAnswers(answers.map((a, j) => (j === i ? e.target.value : a)))} />
        </div>
      ))}
      <div>
        <label className="label" htmlFor="proof">Proof of ownership</label>
        <textarea id="proof" className="input min-h-24" required value={proofDetails} onChange={(e) => setProofDetails(e.target.value)} placeholder="Contents, marks, serial number, where you bought it…" />
      </div>
      <div>
        <label className="label" htmlFor="proofImgs">Photos or receipts <span className="font-normal text-forest/60">(up to 4)</span></label>
        <input id="proofImgs" type="file" accept="image/*" multiple className="input" onChange={(e) => setFiles([...e.target.files].slice(0, 4))} />
      </div>
      {error && <p role="alert" className="rounded-lg bg-rust-soft px-3 py-2 text-sm text-rust">{error}</p>}
      <button className="btn btn-primary" disabled={busy || !lostItem}>{busy ? 'Sending…' : 'Send claim'}</button>
    </form>
  );
}
