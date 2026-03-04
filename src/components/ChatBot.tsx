'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Bot, Minus } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'მოგესალმებით NewHome-ში! მე ვარ თქვენი ასისტენტი. რით შემიძლია დაგეხმაროთ?',
      sender: 'bot',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: Message = { id: Date.now(), text, sender: 'user' };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput('');
    setIsTyping(true);

    // Build Gemini-format history (skip the initial bot greeting)
    const history = allMessages
      .filter((m) => !(m.id === 1 && m.sender === 'bot'))
      .map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

    const botId = Date.now() + 1;
    setMessages((prev) => [...prev, { id: botId, text: '', sender: 'bot' }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.body) throw new Error('No response body');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let botText = '';

      setIsTyping(false);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        botText += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) => (m.id === botId ? { ...m, text: botText } : m))
        );
      }
    } catch {
      setIsTyping(false);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botId
            ? { ...m, text: 'ბოდიში, შეცდომა მოხდა. სცადეთ მოგვიანებით.' }
            : m
        )
      );
    }
  };

  const fixedBase: React.CSSProperties = {
    position: 'fixed',
    bottom: 24,
    right: 24,
    zIndex: 2000,
  };

  return (
    <>
      {/* Trigger button — independent fixed position */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            style={{
              ...fixedBase,
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: '#0d6efd',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(13,110,253,0.4)',
            }}
          >
            <MessageCircle size={28} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window — independent fixed position */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 80, opacity: 0, scale: 0.85 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0, scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            style={{
              ...fixedBase,
              width: 340,
              maxHeight: 'calc(100vh - 48px)',
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
              background: '#fff',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div
              style={{
                background: '#0d6efd',
                color: '#fff',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Bot size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>NewHome ასისტენტი</div>
                  <div style={{ fontSize: 11, opacity: 0.8 }}>ონლაინ</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  onClick={() => setIsMinimized((v) => !v)}
                  style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 4 }}
                >
                  <Minus size={18} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 4 }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div
                  ref={scrollRef}
                  style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '12px 14px',
                    minHeight: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      style={{
                        display: 'flex',
                        justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <div
                        style={{
                          maxWidth: '80%',
                          padding: '8px 12px',
                          borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                          background: msg.sender === 'user' ? '#0d6efd' : '#f1f3f5',
                          color: msg.sender === 'user' ? '#fff' : '#212529',
                          fontSize: 13,
                          lineHeight: 1.5,
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {msg.text || (msg.sender === 'bot' && isTyping === false ? '…' : '')}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                      <div
                        style={{
                          padding: '10px 14px',
                          borderRadius: '16px 16px 16px 4px',
                          background: '#f1f3f5',
                          display: 'flex',
                          gap: 4,
                          alignItems: 'center',
                        }}
                      >
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              background: '#adb5bd',
                              display: 'block',
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div
                  style={{
                    padding: '10px 12px',
                    borderTop: '1px solid #dee2e6',
                    background: '#f8f9fa',
                    display: 'flex',
                    gap: 8,
                    alignItems: 'center',
                  }}
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="ჩაწერეთ შეტყობინება..."
                    disabled={isTyping}
                    style={{
                      flex: 1,
                      border: '1px solid #dee2e6',
                      borderRadius: 20,
                      padding: '8px 14px',
                      fontSize: 13,
                      outline: 'none',
                      background: '#fff',
                    }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={isTyping || !input.trim()}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: '#0d6efd',
                      border: 'none',
                      color: '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      opacity: isTyping || !input.trim() ? 0.5 : 1,
                    }}
                  >
                    <Send size={15} />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
