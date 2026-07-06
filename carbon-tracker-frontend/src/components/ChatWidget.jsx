import { useState, useRef, useEffect } from 'react';
import api from '../api';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hi! Ask me about your carbon footprint, eco score, or tips to reduce emissions." },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { from: 'user', text: userMessage }]);
    setInput('');

    try {
      const res = await api.post('/chatbot', { message: userMessage });
      setMessages((prev) => [...prev, { from: 'bot', text: res.data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { from: 'bot', text: 'Sorry, something went wrong.' }]);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{ position: 'fixed', bottom: 20, right: 20, padding: '12px 18px', borderRadius: 24, background: '#22c55e', color: 'white', border: 'none', cursor: 'pointer' }}
      >
        💬 Chat
      </button>
    );
  }

  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, width: 320, height: 420, background: 'white', border: '1px solid #ccc', borderRadius: 8, display: 'flex', flexDirection: 'column', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
      <div style={{ padding: 10, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>Eco Assistant</strong>
        <button onClick={() => setOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>✕</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 8, textAlign: m.from === 'user' ? 'right' : 'left' }}>
            <span style={{
              display: 'inline-block',
              padding: '6px 10px',
              borderRadius: 10,
              background: m.from === 'user' ? '#22c55e' : '#f1f1f1',
              color: m.from === 'user' ? 'white' : 'black',
              maxWidth: '80%',
              fontSize: 13,
            }}>
              {m.text}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} style={{ display: 'flex', borderTop: '1px solid #eee' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          style={{ flex: 1, border: 'none', padding: 10, outline: 'none' }}
        />
        <button type="submit" style={{ border: 'none', background: '#22c55e', color: 'white', padding: '0 16px' }}>Send</button>
      </form>
    </div>
  );
}