'use client';

import React from 'react';

const loadChatBot = () => import('@/components/ChatBot');

export default function ChatBotLoader() {
  const [ChatBot, setChatBot] = React.useState<React.ComponentType<{ initialOpen?: boolean }> | null>(null);
  const [initialOpen, setInitialOpen] = React.useState(false);

  const openChat = () => {
    setInitialOpen(true);
    loadChatBot().then((mod) => {
      setChatBot(() => mod.default);
    });
  };

  if (ChatBot) {
    return <ChatBot initialOpen={initialOpen} />;
  }

  return (
    <button
      type="button"
      onClick={openChat}
      aria-label="ჩატის გახსნა"
      style={{
        position: 'fixed',
        right: 24,
        bottom: 24,
        zIndex: 2000,
        width: 60,
        height: 60,
        borderRadius: '50%',
        border: 'none',
        background: '#0d6efd',
        color: '#fff',
        boxShadow: '0 4px 20px rgba(13,110,253,0.4)',
        cursor: 'pointer',
        fontSize: 28,
        lineHeight: 1,
      }}
    >
      ?
    </button>
  );
}
