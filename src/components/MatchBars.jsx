import { LABELS, WEIGHTS } from '../utils';

export default function MatchBars({ breakdown = {} }) {
  return (
    <ul className="space-y-2">
      {Object.keys(WEIGHTS).map((key) => (
        <li key={key} className="grid grid-cols-[88px_1fr_52px] items-center gap-3 text-sm">
          <span>{LABELS[key]}</span>
          <div className="h-2 overflow-hidden rounded-full bg-mist">
            <div className="h-full rounded-full bg-moss" style={{ width: `${((breakdown[key] || 0) / WEIGHTS[key]) * 100}%` }} />
          </div>
          <span className="text-right tabular-nums text-forest/60">{breakdown[key] || 0}/{WEIGHTS[key]}</span>
        </li>
      ))}
    </ul>
  );
}
