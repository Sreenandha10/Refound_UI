const item = {
  REPORTED: ['Reported', 'bg-mist text-forest'],
  POTENTIAL_MATCH: ['Potential match', 'bg-leaf text-forest'],
  UNDER_CLAIM: ['Under claim', 'bg-sand-soft text-sand'],
  RECOVERED: ['Recovered', 'bg-forest text-cream'],
};
const claim = {
  pending: ['Pending review', 'bg-sand-soft text-sand'],
  approved: ['Approved', 'bg-leaf text-forest'],
  rejected: ['Rejected', 'bg-rust-soft text-rust'],
  recovered: ['Recovered', 'bg-forest text-cream'],
};
const verification = {
  unverified: ['Unverified', 'bg-mist text-forest'],
  verified: ['Verified', 'bg-leaf text-forest'],
  rejected: ['Rejected', 'bg-rust-soft text-rust'],
};
const maps = { item, claim, verification };

export default function StatusBadge({ kind = 'item', value }) {
  const [label, cls] = maps[kind][value] || [value, 'bg-mist text-forest'];
  return <span className={`badge ${cls}`}>{label}</span>;
}

export const TypeBadge = ({ type }) => (
  <span className={`badge ${type === 'lost' ? 'bg-forest text-cream' : 'bg-moss text-white'}`}>{type === 'lost' ? 'Lost' : 'Found'}</span>
);
