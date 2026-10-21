import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../store/authSlice';
import AuthShell from './AuthShell';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((s) => s.auth.loading);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    const { confirm, ...body } = form;
    const res = await dispatch(register(body));
    if (register.fulfilled.match(res)) navigate('/dashboard');
    else setError(res.payload);
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="It takes a minute."
      footer={<>Already registered? <Link to="/login" className="font-semibold text-moss underline">Log in</Link></>}
    >
      <form onSubmit={submit} className="space-y-4">
        <div><label className="label" htmlFor="name">Full name</label><input id="name" className="input" required value={form.name} onChange={set('name')} autoComplete="name" /></div>
        <div><label className="label" htmlFor="email">Email</label><input id="email" type="email" className="input" required value={form.email} onChange={set('email')} autoComplete="email" /></div>
        <div>
          <label className="label" htmlFor="phone">Phone <span className="font-normal text-forest/60">(shared only after a claim is approved)</span></label>
          <input id="phone" type="tel" className="input" value={form.phone} onChange={set('phone')} autoComplete="tel" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label" htmlFor="password">Password</label><input id="password" type="password" minLength={6} className="input" required value={form.password} onChange={set('password')} autoComplete="new-password" /></div>
          <div><label className="label" htmlFor="confirm">Confirm</label><input id="confirm" type="password" className="input" required value={form.confirm} onChange={set('confirm')} autoComplete="new-password" /></div>
        </div>
        {error && <p role="alert" className="rounded-lg bg-rust-soft px-3 py-2 text-sm text-rust">{error}</p>}
        <button className="btn btn-primary w-full" disabled={loading}>{loading ? 'Creating…' : 'Sign up'}</button>
      </form>
    </AuthShell>
  );
}
