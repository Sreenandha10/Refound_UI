import { Link } from 'react-router-dom';
import { img } from '../api';
import { fmtDay } from '../utils';
import StatusBadge, { TypeBadge } from './StatusBadge';

export default function ItemCard({ item }) {
  return (
    <Link to={`/items/${item._id}`} className="group flex flex-col overflow-hidden rounded-2xl border border-forest/10 bg-white transition hover:border-moss focus-visible:outline focus-visible:outline-2 focus-visible:outline-moss">
      <div className="aspect-[4/3] bg-mist">
        {item.images?.[0] ? (
          <img src={img(item.images[0])} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-forest/50">No photo</div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <TypeBadge type={item.type} />
          <StatusBadge value={item.status} />
        </div>
        <h3 className="line-clamp-1 text-base font-semibold group-hover:text-moss">{item.title}</h3>
        <p className="text-sm text-forest/70">{item.category}{item.color ? ` · ${item.color}` : ''}</p>
        <p className="mt-auto text-xs text-forest/60">{item.location} · {fmtDay(item.dateTime)}</p>
      </div>
    </Link>
  );
}
