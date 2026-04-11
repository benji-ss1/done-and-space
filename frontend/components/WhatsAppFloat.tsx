'use client';
import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

const WHATSAPP_NUMBER = '260971000000';
const DEFAULT_MESSAGE = 'Hello! I found your website and I\'m interested in learning more about your properties.';

export default function WhatsAppFloat() {
  const [hovered, setHovered] = useState(false);

  const openWhatsApp = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;
    window.open(url, '_blank', 'noopener noreferrer');
  };

  return (
    <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 800, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
      {/* Tooltip */}
      {hovered && (
        <div style={{
          background: 'rgba(10,6,7,0.92)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'white',
          padding: '8px 14px',
          borderRadius: 9,
          fontSize: 13,
          fontFamily: 'Outfit, sans-serif',
          whiteSpace: 'nowrap',
          backdropFilter: 'blur(10px)',
          animation: 'fadeIn 0.15s ease',
        }}>
          Chat with us on WhatsApp
        </div>
      )}

      <button
        onClick={openWhatsApp}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label="Chat on WhatsApp"
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: '#25D366',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          boxShadow: '0 4px 20px rgba(37,211,102,0.4)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          transform: hovered ? 'scale(1.08)' : 'scale(1)',
        }}
      >
        <MessageCircle size={26} fill="white" />
      </button>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
