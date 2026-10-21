import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Protected({ role }) {
  const user = useSelector((s) => s.auth.user);
  if (!user) return <Navigate to={role === 'admin' ? '/admin/login' : '/login'} replace />;
  if (user.role !== role) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  return <Outlet />;
}
