import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearToast } from '../store/notifSlice';

export default function Toast() {
  const toast = useSelector((s) => s.notif.toast);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => dispatch(clearToast()), 4500);
    return () => clearTimeout(t);
  }, [toast, dispatch]);

  if (!toast) return null;
  return (
    <div role="status" className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-xl bg-forest px-4 py-3 text-sm text-cream shadow-lg">
      {toast}
    </div>
  );
}
