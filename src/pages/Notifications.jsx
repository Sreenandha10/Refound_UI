import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { markAllRead, markRead } from '../store/notifSlice';
import { timeAgo } from '../utils';
import PageHeader, { Empty } from '../components/PageHeader';

export default function Notifications() {
  const items = useSelector((s) => s.notif.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const unread = items.filter((n) => !n.read).length;

  const open = (n) => {
    if (!n.read) dispatch(markRead(n._id));
    if (n.link) navigate(n.link);
  };

  return (
    <>
      <PageHeader title="Notifications" subtitle={unread ? `${unread} unread` : 'You are all caught up.'}>
        {unread > 0 && <button className="btn btn-outline btn-sm" onClick={() => dispatch(markAllRead())}>Mark all as read</button>}
      </PageHeader>
      {items.length === 0 ? <Empty>No notifications yet.</Empty> : (
        <ul className="divide-y divide-forest/10 overflow-hidden rounded-2xl border border-forest/10 bg-white">
          {items.map((n) => (
            <li key={n._id}>
              <button onClick={() => open(n)} className={`flex w-full items-start gap-3 px-5 py-4 text-left hover:bg-mist/50 ${n.read ? '' : 'bg-leaf/20'}`}>
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? 'bg-transparent' : 'bg-moss'}`} aria-hidden />
                <span className="min-w-0 flex-1"><span className="block font-semibold">{n.title}</span><span className="block text-sm text-forest/70">{n.message}</span></span>
                <span className="shrink-0 text-xs text-forest/50">{timeAgo(n.createdAt)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
