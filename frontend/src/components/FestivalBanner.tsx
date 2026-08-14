import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useFestivalTheme } from '../hooks/useFestivalTheme';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Decorations per type
const DECORATION_EMOJIS: Record<string, string[]> = {
  diya:      ['🪔', '✨', '🪔', '⭐', '🪔'],
  tricolor:  ['🇮🇳', '🎉', '🇮🇳', '⭐', '🇮🇳'],
  colors:    ['🎨', '🌈', '🎭', '🎊', '🌸'],
  snow:      ['❄️', '🎄', '⛄', '🎁', '❄️'],
  fireworks: ['🎆', '✨', '🎇', '⭐', '🎆'],
  crescent:  ['🌙', '⭐', '🌙', '✨', '🌙'],
  floral:    ['🌸', '🌺', '🌼', '🌸', '🌺'],
  harvest:   ['🌾', '🌻', '🎊', '🌾', '🌻'],
  dandiya:   ['🪷', '💃', '🥁', '🎉', '🪷'],
  ganesh:    ['🐘', '🪔', '🌸', '✨', '🐘'],
  gudi:      ['🪔', '🌸', '🎊', '⭐', '🪔'],
  bow:       ['🏹', '🔥', '⭐', '🎆', '🏹'],
};

function FloatingParticles({ decoration }: { decoration: string }) {
  const emojis = DECORATION_EMOJIS[decoration] || ['✨', '⭐', '🎉', '✨', '⭐'];

  return (
    <div className="festival-particles" aria-hidden="true">
      {emojis.map((emoji, i) => (
        <span
          key={i}
          className="festival-particle"
          style={{
            left: `${10 + i * 20}%`,
            animationDelay: `${i * 0.4}s`,
            animationDuration: `${3 + i * 0.5}s`,
          }}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}

export default function FestivalBanner() {
  const festival = useFestivalTheme();
  const [dismissedKey, setDismissedKey] = useLocalStorage<string>('festival_dismissed', '');

  if (!festival) return null;
  // If user dismissed this festival's banner today
  if (dismissedKey === `${festival.key}_${festival.date}`) return null;

  return (
    <>
      <style>{`
        .festival-banner {
          background: var(--festival-banner-bg, var(--festival-primary));
          position: relative;
          overflow: hidden;
        }
        .festival-particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .festival-particle {
          position: absolute;
          top: -20px;
          font-size: 20px;
          animation: festivalFall linear infinite;
          opacity: 0.7;
        }
        @keyframes festivalFall {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.7; }
          90%  { opacity: 0.7; }
          100% { transform: translateY(80px) rotate(360deg); opacity: 0; }
        }
        [data-festival] .festival-teal-override {
          color: var(--festival-primary) !important;
        }
      `}</style>

      <div
        className="festival-banner text-white py-2.5 px-4 text-center text-sm font-medium relative"
        role="banner"
      >
        <FloatingParticles decoration={festival.decoration} />
        <span className="relative z-10">
          {festival.emoji} {festival.email_headline} — Wishing you and your family a joyful {festival.name}! {festival.emoji}
        </span>
        <button
          onClick={() => setDismissedKey(`${festival.key}_${festival.date}`)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-10"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </>
  );
}
