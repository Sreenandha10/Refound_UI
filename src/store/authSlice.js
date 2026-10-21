import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { errMsg } from '../api';

const call = (name, fn) =>
  createAsyncThunk(name, async (arg, { rejectWithValue }) => {
    try {
      return await fn(arg);
    } catch (e) {
      return rejectWithValue(errMsg(e));
    }
  });

export const login = call('auth/login', async (body) => (await api.post('/auth/login', body)).data);
export const register = call('auth/register', async (body) => (await api.post('/auth/register', body)).data);
export const fetchMe = call('auth/me', async () => (await api.get('/auth/me')).data);
export const updateProfile = call('auth/profile', async (body) => (await api.put('/users/me', body)).data);

// UI preview: open any page directly; the role is picked from the URL (/admin/* = admin).
import { me, admin } from '../mock/data';
const path = window.location.pathname;
const isPublic = ['/', '/login', '/register', '/admin/login'].includes(path);
const previewUser = isPublic ? null : path.startsWith('/admin') ? admin : me;

const slice = createSlice({
  name: 'auth',
  initialState: { user: previewUser, token: null, ready: true, loading: false },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.ready = true;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (b) => {
    for (const thunk of [login, register]) {
      b.addCase(thunk.pending, (s) => { s.loading = true; });
      b.addCase(thunk.rejected, (s) => { s.loading = false; });
      b.addCase(thunk.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.user = payload.user;
        s.token = payload.token;
        s.ready = true;
        localStorage.setItem('token', payload.token);
      });
    }
    b.addCase(fetchMe.fulfilled, (s, { payload }) => { s.user = payload.user; s.ready = true; });
    b.addCase(fetchMe.rejected, (s) => { s.token = null; s.ready = true; localStorage.removeItem('token'); });
    b.addCase(updateProfile.fulfilled, (s, { payload }) => { s.user = payload.user; });
  },
});

export const { logout } = slice.actions;
export default slice.reducer;
