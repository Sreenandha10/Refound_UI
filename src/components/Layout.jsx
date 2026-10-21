import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Brand from './Brand';
import Toast from './Toast';
import { Bell, Close, Menu } from './Icons';
import { logout } from '../store/authSlice';
import { addNotification, fetchNotifications, setToast } from '../store/notifSlice';
import { disconnectSocket, getSocket } from '../socket';

const userLinks = [
  ['/dashboard', 'Dashboard'],
  ['/browse', 'Browse items'],
  ['/report/lost', 'Report lost'],
  ['/report/found', 'Report found'],
  ['/my-items', 'My reports'],
  ['/matches', 'Matches'],
  ['/claims', 'Claims'],
  ['/chat', 'Messages'],
];
const adminLinks = [
  ['/admin', 'Overview'],
  ['/admin/users', 'Users'],
  ['/admin/items', 'Reports'],
  ['/admin/claims', 'Claims'],
  ['/admin/categories', 'Categories'],
];

export default function Layout() {
  const { user } = useSelector((s) => s.auth);
  const unread = useSelector((s) => s.notif.items.filter((n) => !n.read).length);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const isAdmin = user.role === 'admin';
  const links = isAdmin ? adminLinks : userLinks;

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (isAdmin) return;
    dispatch(fetchNotifications());
    const socket = getSocket();
    const onNote = (n) => {
      dispatch(addNotification(n));
      dispatch(setToast(`${n.title}: ${n.message}`));
    };
    socket.on('notification', onNote);
    return () => {
      socket.off('notification', onNote);
      disconnectSocket();
    };
  }, [isAdmin, dispatch]);

  const signOut = () => {
    disconnectSocket();
    dispatch(logout());
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `block rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-leaf text-forest' : 'text-cream/80 hover:bg-white/10 hover:text-white'}`;

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[250px_1fr]">
      {open && <div className="fixed inset-0 z-30 bg-forest/50 lg:hidden" onClick={() => setOpen(false)} />}

      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-forest p-4 transition-transform lg:sticky lg:top-0 lg:h-screen lg:w-auto lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-6 flex items-center justify-between px-2 pt-2">
          <Brand to={isAdmin ? '/admin' : '/dashboard'} light />
          <button className="text-cream lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu"><Close /></button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto" aria-label="Main">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/admin'} className={linkClass}>{label}</NavLink>
          ))}
        </nav>
        <div className="mt-4 border-t border-white/15 pt-4">
          {!isAdmin && <NavLink to="/profile" className={linkClass}>Profile</NavLink>}
          <button onClick={signOut} className="mt-1 w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-cream/80 hover:bg-white/10 hover:text-white">Sign out</button>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-forest/10 bg-cream/90 px-4 py-3 backdrop-blur sm:px-8">
          <button className="rounded-lg p-1.5 hover:bg-mist lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></button>
          <span className="hidden text-sm text-forest/70 lg:block">{isAdmin ? 'Admin console' : `Hello, ${user.name.split(' ')[0]}`}</span>
          <div className="flex items-center gap-3">
            {!isAdmin && (
              <Link to="/notifications" className="relative rounded-lg p-2 hover:bg-mist" aria-label={`Notifications, ${unread} unread`}>
                <Bell />
                {unread > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-moss px-1 text-[11px] font-bold text-white">{unread}</span>}
              </Link>
            )}
            <span className="text-sm font-medium lg:hidden">{user.name.split(' ')[0]}</span>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8"><Outlet /></main>
      </div>
      <Toast />
    </div>
  );
}
