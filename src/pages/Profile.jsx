import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../store/authSlice';
import { setToast } from '../store/notifSlice';
import PageHeader from '../components/PageHeader';

export default function Profile() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: user.name, phone: user.phone || '', currentPassword: '', newPassword: '' });
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    const body = { name: form.name, phone: form.phone };
    if (form.newPassword) Object.assign(body, { currentPassword: form.currentPassword, newPassword: form.newPassword });
    const res = await dispatch(updateProfile(body));
    if (updateProfile.fulfilled.match(res)) {
      dispatch(setToast('Profile saved'));
      setForm({ ...form, currentPassword: '', newPassword: '' });
    } else setError(res.payload);
  };

  return (
    <>
      <PageHeader title="Profile" subtitle="Your phone number is shared only with the other side of an approved claim." />
      <form onSubmit={submit} className="card max-w-xl space-y-5">
        <div><label className="label" htmlFor="email">Email</label><input id="email" className="input bg-cream" value={user.email} disabled /></div>
        <div><label className="label" htmlFor="name">Full name</label><input id="name" className="input" required value={form.name} onChange={set('name')} /></div>
        <div><label className="label" htmlFor="phone">Phone</label><input id="phone" type="tel" className="input" value={form.phone} onChange={set('phone')} /></div>
        <fieldset className="space-y-3 border-t border-forest/10 pt-5">
          <legend className="label">Change password <span className="font-normal text-forest/60">(optional)</span></legend>
          <input type="password" className="input" aria-label="Current password" placeholder="Current password" autoComplete="current-password" value={form.currentPassword} onChange={set('currentPassword')} />
          <input type="password" className="input" aria-label="New password" placeholder="New password (6+ characters)" autoComplete="new-password" minLength={form.newPassword ? 6 : undefined} value={form.newPassword} onChange={set('newPassword')} />
        </fieldset>
        {error && <p role="alert" className="rounded-lg bg-rust-soft px-3 py-2 text-sm text-rust">{error}</p>}
        <button className="btn btn-primary">Save changes</button>
      </form>
    </>
  );
}
