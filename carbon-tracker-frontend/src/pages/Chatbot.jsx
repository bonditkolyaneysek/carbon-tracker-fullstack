import { useState, useRef, useEffect } from 'react';
import api from '../api';
import Layout from '../components/Layout';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hello! I am EcoBot. Ask me anything about reducing your carbon footprint!' },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const text = input;
    setMessages((m) => [...m, { from: 'user', text }]);
    setInput('');
    try {
      const res = await api.post('/chatbot', { message: text });
      setMessages((m) => [...m, { from: 'bot', text: res.data.reply }]);
    } catch {
      setMessages((m) => [...m, { from: 'bot', text: 'Sorry, something went wrong.' }]);
    }
  };

  return (
    <Layout>
      <h1 style={{ fontSize: 34 }}>🤖 EcoBot Assistant Engine</h1>
      <p style={{ color: 'var(--text-muted)', marginTop: 12, fontSize: 16, marginBottom: 32 }}>
        Ask about electricity, transport, plastic, your eco score, or how to reduce your footprint.
      </p>

      <div style={{ minHeight: 300 }}>
        {messages.map((m, i) => (
          <div key={i} className="chat-bubble" style={{ flexDirection: m.from === 'user' ? 'row-reverse' : 'row' }}>
            <div className="chat-avatar" style={{ background: m.from === 'bot' ? '#E0A458' : '#3B82F6' }}>
              {m.from === 'bot' ? '🤖' : '🙂'}
            </div>
            <div className="chat-bubble-text">{m.text}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} style={{ position: 'fixed', bottom: 32, left: 280, right: 56, display: 'flex', gap: 10 }}>
        <input
          className="input"
          style={{ marginBottom: 0 }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask how to lower your footprint..."
        />
        <button type="submit" className="stepper-btn" style={{ width: 48, height: 48 }}>↑</button>
      </form>
    </Layout>
  );
}