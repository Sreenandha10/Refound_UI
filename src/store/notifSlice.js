import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

export const fetchNotifications = createAsyncThunk('notif/fetch', async () => (await api.get('/notifications')).data);
export const markAllRead = createAsyncThunk('notif/readAll', async () => { await api.patch('/notifications/read-all'); });
export const markRead = createAsyncThunk('notif/read', async (id) => { await api.patch(`/notifications/${id}/read`); return id; });

const slice = createSlice({
  name: 'notif',
  initialState: { items: [], toast: null },
  reducers: {
    addNotification(state, { payload }) { state.items.unshift(payload); },
    setToast(state, { payload }) { state.toast = payload; },
    clearToast(state) { state.toast = null; },
  },
  extraReducers: (b) => {
    b.addCase(fetchNotifications.fulfilled, (s, { payload }) => { s.items = payload; });
    b.addCase(markAllRead.fulfilled, (s) => { s.items.forEach((n) => { n.read = true; }); });
    b.addCase(markRead.fulfilled, (s, { payload }) => { const n = s.items.find((x) => x._id === payload); if (n) n.read = true; });
  },
});

export const { addNotification, setToast, clearToast } = slice.actions;
export default slice.reducer;
