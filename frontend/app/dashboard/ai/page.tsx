'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, RotateCcw, Settings, TrendingUp, Home, Users, DollarSign } from 'lucide-react';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `You are Simplify.AI, a specialized real estate intelligence assistant for Done & Space Properties Limited, a premium property company operating in Zambia.

Your expertise covers:
- Zambian real estate market — residential, commercial, and land
- Lead management and CRM strategy for property agents
- Property valuation, pricing strategy, and market trends in Lusaka, Copperbelt, and other provinces
- Sales pipeline optimization and deal conversion
- Tenant management, rental yields, and property investment analysis
- Zambian property law, conveyancing basics, and regulatory context
- Marketing strategies for property listings in the Zambian market

When analyzing data or answering questions:
1. Be specific to the Zambian context (ZMW currency, local areas, local regulations)
2. Provide actionable insights for agents, managers, and landlords
3. Use clear structure with bullet points or numbered steps where helpful
4. Reference common Zambian property areas: Lusaka (Kabulonga, Roma, Woodlands, Ibex Hill, Levy, Mass Media), Copperbelt (Kitwe, Ndola), etc.
5. Keep responses concise and business-focused

You have access to context about Done & Space's operations. Always sign off as "Simplify.AI — powered by Done & Space".`;

const QUICK_PROMPTS = [
  { icon: TrendingUp, label: 'Lead Analysis', prompt: 'Analyze our current lead pipeline. What strategies should we use to convert hot leads faster in the Zambian market?' },
  { icon: Home, label: 'Pricing Strategy', prompt: 'What are the current market rates for 3-bedroom houses in Lusaka areas like Kabulonga, Roma, and Woodlands? How should we price our listings?' },
  { icon: Users, label: 'Agent Performance', prompt: 'What KPIs should we track for our real estate agents in Zambia? How do we build accountability in our team?' },
  { icon: DollarSign, label: 'Rental Yields', prompt: 'What rental yields can clients expect from buy-to-let properties in Lusaka right now? What areas offer the best ROI?' },
];

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('groq_api_key');
    if (saved) setApiKey(saved);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;

    const key = apiKey || localStorage.getItem('groq_api_key');
    if (!key) {
      setMessages(prev => [...prev,
        { role: 'user', content },
        { role: 'assistant', content: '⚠️ No Groq API key found. Please add your key in **Dashboard → Settings** to start using Simplify.AI.' }
      ]);
      setInput('');
      return;
    }

    const newMessages: Message[] = [...messages, { role: 'user', content }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...newMessages.map(m => ({ role: m.role, content: m.content })),
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Groq API error');

      const reply = data.choices?.[0]?.message?.content || 'No response received.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `❌ Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const clearChat = () => setMessages([]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', maxHeight: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexShrink: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{ width: 32, height: 32, background: '#8B1A2F', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={16} color="white" />
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Simplify.AI
            </h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginLeft: 42 }}>
            Real estate intelligence for Done & Space Properties
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {messages.length > 0 && (
            <button onClick={clearChat} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: '1px solid var(--border)', color: 'var(--text-secondary)', padding: '7px 12px', borderRadius: 8, fontSize: 12.5, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
              <RotateCcw size={13} /> Clear
            </button>
          )}
          <Link href="/dashboard/settings" style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: '1px solid var(--border)', color: 'var(--text-secondary)', padding: '7px 12px', borderRadius: 8, fontSize: 12.5, textDecoration: 'none', fontFamily: 'Outfit, sans-serif' }}>
            <Settings size={13} /> API Key
          </Link>
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 0, minHeight: 0 }}>
        {messages.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ width: 60, height: 60, background: '#8B1A2F18', border: '1px solid #8B1A2F30', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <Sparkles size={28} color="#8B1A2F" />
            </div>
            <h2 style={{ color: 'var(--text-primary)', fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
              How can I help today?
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 13.5, maxWidth: 380, marginBottom: 32, lineHeight: 1.6 }}>
              Ask me anything about your leads, properties, market trends, or Zambian real estate strategy.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%', maxWidth: 520 }}>
              {QUICK_PROMPTS.map(({ icon: Icon, label, prompt }) => (
                <button
                  key={label}
                  onClick={() => sendMessage(prompt)}
                  style={{
                    background: 'var(--bg-surface)', border: '1px solid var(--border)',
                    borderRadius: 12, padding: '14px 16px', textAlign: 'left',
                    cursor: 'pointer', transition: 'border-color 0.15s, background 0.15s',
                    fontFamily: 'Outfit, sans-serif',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#8B1A2F50'; (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.background = 'var(--bg-surface)'; }}
                >
                  <Icon size={15} color="#8B1A2F" style={{ marginBottom: 8 }} />
                  <div style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{label}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 11.5, lineHeight: 1.4 }}>{prompt.slice(0, 60)}…</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '4px 0' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.role === 'assistant' && (
                  <div style={{ width: 28, height: 28, background: '#8B1A2F', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 10, flexShrink: 0, marginTop: 2 }}>
                    <Sparkles size={13} color="white" />
                  </div>
                )}
                <div style={{
                  maxWidth: '75%',
                  background: msg.role === 'user' ? '#8B1A2F' : 'var(--bg-surface)',
                  border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
                  color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
                  padding: '12px 16px',
                  fontSize: 13.5,
                  lineHeight: 1.65,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 28, height: 28, background: '#8B1A2F', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Sparkles size={13} color="white" />
                </div>
                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '4px 16px 16px 16px', padding: '12px 16px', display: 'flex', gap: 5, alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#8B1A2F', animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit} style={{ flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 10, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '10px 12px', alignItems: 'flex-end' }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
            placeholder="Ask about leads, properties, market insights, or strategy..."
            rows={1}
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: 'var(--text-primary)', fontSize: 14, fontFamily: 'Outfit, sans-serif',
              resize: 'none', maxHeight: 120, lineHeight: 1.5, padding: '4px 4px',
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            style={{
              background: input.trim() && !loading ? '#8B1A2F' : '#2a2025',
              border: 'none', color: 'white', width: 36, height: 36, borderRadius: 9,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              flexShrink: 0, transition: 'background 0.2s',
            }}
          >
            <Send size={15} />
          </button>
        </div>
        <p style={{ color: '#332830', fontSize: 11, textAlign: 'center', marginTop: 8 }}>
          Simplify.AI · Powered by Groq · Press Enter to send, Shift+Enter for new line
        </p>
      </form>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
