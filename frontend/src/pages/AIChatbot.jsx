import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';

const AIChatbot = () => {
    const [messages, setMessages] = useState([
        { role: 'ai', text: 'Hello! I am your AI farming assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setLoading(true);

        try {
            const res = await api.post('/ai/chat', { message: userMsg });
            setMessages(prev => [...prev, { role: 'ai', text: res.data.aiReply }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I am having trouble connecting to the server.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 0', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
            <h1 style={{ marginBottom: '1rem', color: 'var(--primary-dark)' }}>AI Assistant</h1>

            <div className="card glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
                {/* Chat Messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {messages.map((msg, idx) => (
                        <div key={idx} style={{
                            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            background: msg.role === 'user' ? 'var(--primary)' : 'var(--background)',
                            color: msg.role === 'user' ? 'white' : 'var(--text-main)',
                            padding: '0.75rem 1rem',
                            borderRadius: '1rem',
                            maxWidth: '75%',
                            borderBottomRightRadius: msg.role === 'user' ? '0' : '1rem',
                            borderBottomLeftRadius: msg.role === 'ai' ? '0' : '1rem',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}>
                            {msg.text}
                        </div>
                    ))}
                    {loading && (
                        <div style={{ alignSelf: 'flex-start', background: 'var(--background)', padding: '0.75rem 1rem', borderRadius: '1rem', borderBottomLeftRadius: '0' }}>
                            <span style={{ fontStyle: 'italic', opacity: 0.7 }}>Thinking...</span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem', padding: '1rem', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
                    <input
                        type="text"
                        className="form-input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask me about crops, pests, market trends..."
                        style={{ flex: 1 }}
                    />
                    <button type="submit" className="btn-primary" disabled={loading}>
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AIChatbot;
