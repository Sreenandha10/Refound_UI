import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe } from './store/authSlice';
import Protected from './components/Protected';
import Layout from './components/Layout';
import { Spinner } from './components/PageHeader';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ReportItem from './pages/ReportItem';
import Browse from './pages/Browse';
import ItemDetail from './pages/ItemDetail';
import MyItems from './pages/MyItems';
import Matches from './pages/Matches';
import Claims from './pages/Claims';
import Chat from './pages/Chat';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminItems from './pages/admin/AdminItems';
import AdminClaims from './pages/admin/AdminClaims';
import AdminCategories from './pages/admin/AdminCategories';

export default function App() {
  const dispatch = useDispatch();
  const { token, ready } = useSelector((s) => s.auth);

  useEffect(() => {
    if (token) dispatch(fetchMe());
  }, []);

  if (!ready) return <Spinner />;

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login mode="user" />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin/login" element={<Login mode="admin" />} />

      <Route element={<Protected role="user" />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/report/:type" element={<ReportItem />} />
          <Route path="/edit/:id" element={<ReportItem />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/items/:id" element={<ItemDetail />} />
          <Route path="/my-items" element={<MyItems />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/claims" element={<Claims />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:matchId" element={<Chat />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route element={<Protected role="admin" />}>
        <Route element={<Layout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/items" element={<AdminItems />} />
          <Route path="/admin/claims" element={<AdminClaims />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
