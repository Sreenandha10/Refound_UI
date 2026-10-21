// UI-preview stub: no real socket connection. Sending a chat message just echoes it locally.
const listeners = {};
const stub = {
  on: (e, fn) => { (listeners[e] ||= []).push(fn); },
  off: (e, fn) => { listeners[e] = (listeners[e] || []).filter((f) => f !== fn); },
  emit: (e, p) => {
    if (e === 'chat:send') {
      const m = { _id: `local-${Date.now()}`, match: p.matchId, sender: 'u1', text: p.text, createdAt: new Date().toISOString() };
      (listeners['chat:message'] || []).forEach((f) => f(m));
    }
  },
  disconnect: () => {},
};

export const getSocket = () => stub;
export const disconnectSocket = () => {};
