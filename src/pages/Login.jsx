import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/authSlice';
import AuthShell from './AuthShell';

export default function Login({ mode }) {
  const isAdmin = mode === 'admin';
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((s) => s.auth.loading);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await dispatch(login({ ...form, as: mode }));
    if (login.fulfilled.match(res)) navigate(isAdmin ? '/admin' : '/dashboard');
    else setError(res.payload);
  };

  return (
    <AuthShell
      title={isAdmin ? 'Admin sign in' : 'Welcome back'}
      subtitle={isAdmin ? 'For REFOUND administrators only.' : 'Log in to track your reports and matches.'}
      footer={
        isAdmin ? <Link to="/login" className="underline">Back to user login</Link> : (
          <>New to REFOUND? <Link to="/register" className="font-semibold text-moss underline">Create an account</Link></>
        )
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" className="input" required autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" type="password" className="input" required autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        {error && <p role="alert" className="rounded-lg bg-rust-soft px-3 py-2 text-sm text-rust">{error}</p>}
        <button className="btn btn-primary w-full" disabled={loading}>{loading ? 'Signing in…' : isAdmin ? 'Sign in as admin' : 'Log in'}</button>
      </form>
    </AuthShell>
  );
}
