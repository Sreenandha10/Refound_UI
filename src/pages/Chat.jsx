import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../api';
import { getSocket } from '../socket';
import { timeAgo } from '../utils';
import PageHeader, { Empty, Spinner } from '../components/PageHeader';

export default function Chat() {
  const { matchId } = useParams();
  const me = useSelector((s) => s.auth.user);
  const [rooms, setRooms] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const endRef = useRef(null);

  useEffect(() => { api.get('/messages/rooms').then(({ data }) => setRooms(data)); }, [matchId]);

  useEffect(() => {
    if (!matchId) return;
    setMessages([]);
    api.get(`/messages/${matchId}`).then(({ data }) => setMessages(data)).catch(() => {});
    const socket = getSocket();
    const join = () => socket.emit('chat:join', matchId);
    const onMsg = (m) => { if (m.match === matchId) setMessages((prev) => (prev.some((x) => x._id === m._id) ? prev : [...prev, m])); };
    join();
    socket.on('connect', join);
    socket.on('chat:message', onMsg);
    return () => { socket.off('connect', join); socket.off('chat:message', onMsg); };
  }, [matchId]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    getSocket().emit('chat:send', { matchId, text });
    setText('');
  };

  if (!rooms) return <Spinner />;
  const room = rooms.find((r) => r._id === matchId);

  return (
    <>
      <PageHeader title="Messages" subtitle="Talk to the other person about a match. Phone numbers stay hidden until a claim is approved." />
      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <aside className={`${matchId ? 'hidden lg:block' : ''}`}>
          {rooms.length === 0 ? <Empty>Conversations appear here once you have a match.</Empty> : (
            <ul className="space-y-2">
              {rooms.map((r) => (
                <li key={r._id}>
                  <Link to={`/chat/${r._id}`} className={`block rounded-xl border p-4 ${r._id === matchId ? 'border-moss bg-mist' : 'border-forest/10 bg-white hover:border-moss'}`}>
                    <p className="flex justify-between font-semibold"><span className="truncate">{r.other?.name}</span><span className="text-moss">{r.percentage}%</span></p>
                    <p className="truncate text-sm text-forest/70">{r.lostTitle} / {r.foundTitle}</p>
                    <p className="mt-1 truncate text-xs text-forest/50">{r.last ? `${r.last.text} · ${timeAgo(r.last.createdAt)}` : 'No messages yet'}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <section className={`${matchId ? '' : 'hidden lg:flex'} card flex h-[70vh] min-h-[420px] flex-col p-0`}>
          {!room ? (
            <div className="flex flex-1 items-center justify-center p-6 text-forest/60">Select a conversation</div>
          ) : (
            <>
              <header className="flex items-center justify-between gap-3 border-b border-forest/10 px-5 py-4">
                <div className="min-w-0"><p className="font-semibold">{room.other?.name}</p><p className="truncate text-sm text-forest/70">{room.lostTitle} / {room.foundTitle}</p></div>
                <Link to="/chat" className="btn btn-outline btn-sm lg:hidden">Back</Link>
              </header>
              <div className="flex-1 space-y-2 overflow-y-auto px-5 py-4" aria-live="polite">
                {messages.length === 0 && <p className="text-center text-sm text-forest/50">Say hello to start the conversation.</p>}
                {messages.map((m) => {
                  const mine = m.sender === me._id;
                  return (
                    <div key={m._id} className={`flex ${mine ? 'justify-end' : ''}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${mine ? 'rounded-br-sm bg-moss text-white' : 'rounded-bl-sm bg-mist'}`}>
                        {m.text}
                        <span className={`mt-0.5 block text-[11px] ${mine ? 'text-white/70' : 'text-forest/50'}`}>{timeAgo(m.createdAt)}</span>
                      </div>
                    </div>
                  );
                })}
                <div ref={endRef} />
              </div>
              <form onSubmit={send} className="flex gap-2 border-t border-forest/10 p-3">
                <input className="input" aria-label="Message" placeholder="Write a message" value={text} onChange={(e) => setText(e.target.value)} maxLength={1000} />
                <button className="btn btn-primary" disabled={!text.trim()}>Send</button>
              </form>
            </>
          )}
        </section>
      </div>
    </>
  );
}
