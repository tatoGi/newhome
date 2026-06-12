'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Bot, Minus, Mic, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { BACKEND_BASE_URL } from '@/lib/api/assets';

interface ChatSource {
  title: string | null;
  url: string | null;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  sources?: ChatSource[];
  /** კითხვა, რომელზეც escalation-ის ხელახლა გაგზავნაა შესაძლებელი */
  escalateFor?: string;
}

interface AiChatResponse {
  answer: string;
  provider: string | null;
  reason?: string;
  sources?: ChatSource[];
}

const AI_CHAT_URL = `${BACKEND_BASE_URL}/api/ai-chat`;
const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '995557422942').replace(/\D+/g, '');
const GREETING_ID = 1;

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = sessionStorage.getItem('aic-session');
  if (!id) {
    id = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
    sessionStorage.setItem('aic-session', id);
  }
  return id;
}

function speak(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ka-GE';
  const ka = speechSynthesis.getVoices().find((v) => v.lang.startsWith('ka'));
  if (ka) u.voice = ka;
  speechSynthesis.speak(u);
}

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.886 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

export default function ChatBot({ initialOpen = false }: { initialOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: GREETING_ID,
      text: 'მოგესალმებით HomeSpace-ში! მკითხეთ პროდუქტებზე, ფასებზე ან საიტის ნებისმიერ ინფორმაციაზე — ტექსტით ან ხმით 🎙',
      sender: 'bot',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const addBotMessage = (msg: Omit<Message, 'id' | 'sender'>) => {
    setMessages((prev) => [...prev, { id: Date.now() + Math.random(), sender: 'bot', ...msg }]);
  };

  const send = async (text: string, escalate = false, voice = false) => {
    if (!text || isTyping) return;

    setMessages((prev) => {
      const next = escalate
        ? // escalation — კითხვა ეკრანზე უკვე ჩანს, ხელახლა აღარ ვამატებთ
          prev.map((m) => (m.escalateFor === text ? { ...m, escalateFor: undefined } : m))
        : [...prev, { id: Date.now(), text, sender: 'user' as const }];
      return next;
    });
    setIsTyping(true);

    // history — მისალმების გარეშე, ბოლო 16 სვლა
    const history = messages
      .filter((m) => m.id !== GREETING_ID && m.text)
      .map((m) => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }))
      .slice(-16);

    try {
      const res = await fetch(AI_CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          message: text,
          history,
          session_id: getSessionId(),
          escalate,
          voice,
        }),
      });

      const data = (await res.json()) as AiChatResponse;
      setIsTyping(false);

      if (!res.ok || !data.answer) {
        addBotMessage({ text: 'სამწუხაროდ, ამ წუთას პასუხის გაცემა ვერ ხერხდება. სცადეთ ცოტა ხანში.' });
        return;
      }

      addBotMessage({
        text: data.answer,
        sources: (data.sources ?? []).filter((s) => s.url).slice(0, 3),
        // „უკეთესი პასუხის" ღილაკი — მხოლოდ უფასო ჯაჭვის პასუხზე
        escalateFor: data.provider && data.reason === 'default' ? text : undefined,
      });

      if (ttsEnabled) speak(data.answer);
    } catch {
      setIsTyping(false);
      addBotMessage({ text: 'შეცდომა — სცადეთ ხელახლა.' });
    }
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    send(text);
  };

  // ── ხმოვანი ჩაწერა (Groq Whisper Laravel-ის გავლით) ──────────────
  const toggleRecording = async () => {
    if (isRecording) {
      recorderRef.current?.stop();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const chunks: Blob[] = [];
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        setIsRecording(false);
        stream.getTracks().forEach((t) => t.stop());

        const fd = new FormData();
        fd.append('audio', new Blob(chunks, { type: 'audio/webm' }), 'audio.webm');

        setIsTyping(true);
        try {
          const res = await fetch(`${AI_CHAT_URL}/transcribe`, { method: 'POST', body: fd });
          const data = (await res.json()) as { text: string | null; error?: string };
          setIsTyping(false);

          if (data.text) {
            send(data.text, false, true);
          } else {
            addBotMessage({ text: data.error || 'ხმის ამოცნობა ვერ მოხერხდა.' });
          }
        } catch {
          setIsTyping(false);
          addBotMessage({ text: 'ხმის ამოცნობა ვერ მოხერხდა.' });
        }
      };

      recorder.start();
      setIsRecording(true);
    } catch {
      addBotMessage({ text: 'მიკროფონზე წვდომა ვერ მოხერხდა — შეამოწმეთ ბრაუზერის ნებართვა.' });
    }
  };

  const toggleTts = () => {
    setTtsEnabled((v) => {
      if (v && typeof window !== 'undefined' && 'speechSynthesis' in window) speechSynthesis.cancel();
      return !v;
    });
  };

  const openWhatsApp = () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.sender === 'user')?.text?.trim();
    const intro = 'გამარჯობა, საიტიდან გწერთ.';
    const text = lastUserMsg ? `${intro}\n\n${lastUserMsg}` : intro;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
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
            aria-label="ჩატი გახსენი"
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
                  <div style={{ fontWeight: 600, fontSize: 14 }}>HomeSpace ასისტენტი</div>
                  <div style={{ fontSize: 11, opacity: 0.8 }}>ონლაინ</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  onClick={toggleTts}
                  aria-pressed={ttsEnabled}
                  title="პასუხების გახმოვანება"
                  style={{
                    background: ttsEnabled ? 'rgba(255,255,255,0.25)' : 'none',
                    border: 'none',
                    borderRadius: 6,
                    color: '#fff',
                    cursor: 'pointer',
                    padding: 4,
                  }}
                >
                  {ttsEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
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
                        {msg.text}
                        {msg.sources && msg.sources.length > 0 && (
                          <div style={{ fontSize: 12, marginTop: 6 }}>
                            იხილეთ:{' '}
                            {msg.sources.map((s, i) => (
                              <React.Fragment key={`${s.url}-${i}`}>
                                {i > 0 && ' · '}
                                <a href={s.url ?? '#'} style={{ color: '#0d6efd' }}>
                                  {s.title || 'ბმული'}
                                </a>
                              </React.Fragment>
                            ))}
                          </div>
                        )}
                        {msg.escalateFor && (
                          <button
                            onClick={() => send(msg.escalateFor!, true)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 5,
                              marginTop: 8,
                              fontSize: 12,
                              border: '1px solid #0d6efd',
                              color: '#0d6efd',
                              background: 'transparent',
                              borderRadius: 8,
                              padding: '4px 10px',
                              cursor: 'pointer',
                            }}
                          >
                            <Sparkles size={13} />
                            უკეთესი პასუხი მინდა
                          </button>
                        )}
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

                {/* Continue on WhatsApp */}
                {WHATSAPP_NUMBER && (
                  <button
                    onClick={openWhatsApp}
                    aria-label="WhatsApp-ზე გაგრძელება"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      margin: '0 12px',
                      padding: '9px 12px',
                      border: 'none',
                      borderRadius: 12,
                      background: '#25D366',
                      color: '#fff',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <WhatsAppIcon size={18} />
                    WhatsApp-ზე გაგრძელება
                  </button>
                )}

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
                  <button
                    onClick={toggleRecording}
                    aria-label="ხმით კითხვა"
                    title="ხმით კითხვა"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: 'none',
                      border: 'none',
                      color: isRecording ? '#c0392b' : '#6c757d',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      animation: isRecording ? 'aic-pulse 1.2s infinite' : undefined,
                    }}
                  >
                    <Mic size={18} />
                  </button>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={isRecording ? 'ვისმენ…' : 'დაწერეთ კითხვა…'}
                    disabled={isTyping}
                    maxLength={2000}
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
                    aria-label="გაგზავნა"
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
                <style>{'@keyframes aic-pulse { 50% { opacity: .4; } }'}</style>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
