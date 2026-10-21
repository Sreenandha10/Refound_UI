import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../api';
import PageHeader, { Empty, Spinner } from '../components/PageHeader';
import MatchBars from '../components/MatchBars';
import StatusBadge from '../components/StatusBadge';

export default function Matches() {
  const me = useSelector((s) => s.auth.user);
  const [matches, setMatches] = useState(null);
  useEffect(() => { api.get('/matches').then(({ data }) => setMatches(data)); }, []);
  if (!matches) return <Spinner />;

  return (
    <>
      <PageHeader title="Potential matches" subtitle="Reports scoring above 60% are matched automatically." />
      {matches.length === 0 ? <Empty>No matches yet. We will notify you the moment one appears.</Empty> : (
        <ul className="space-y-5">
          {matches.map((m) => {
            const mineIsLost = String(m.lostItem.user) === me._id;
            return (
              <li key={m._id} className="card grid gap-6 md:grid-cols-[1fr_1fr]">
                <div>
                  <div className="flex items-end gap-3">
                    <span className="font-heading text-6xl font-bold leading-none text-moss">{m.percentage}%</span>
                    {m.claimStatus && <StatusBadge kind="claim" value={m.claimStatus} />}
                  </div>
                  <div className="mt-4 space-y-2 text-sm">
                    <p><span className="text-forest/60">Lost:</span> <Link className="font-semibold hover:text-moss" to={`/items/${m.lostItem._id}`}>{m.lostItem.title}</Link> <span className="text-forest/60">({m.lostItem.location})</span></p>
                    <p><span className="text-forest/60">Found:</span> <Link className="font-semibold hover:text-moss" to={`/items/${m.foundItem._id}`}>{m.foundItem.title}</Link> <span className="text-forest/60">({m.foundItem.location})</span></p>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {mineIsLost && !['approved', 'recovered', 'pending'].includes(m.claimStatus) && (
                      <Link to={`/items/${m.foundItem._id}?claim=1&lost=${m.lostItem._id}`} className="btn btn-primary btn-sm">Claim this item</Link>
                    )}
                    <Link to={`/chat/${m._id}`} className="btn btn-outline btn-sm">Chat about this match</Link>
                  </div>
                </div>
                <MatchBars breakdown={m.breakdown} />
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
