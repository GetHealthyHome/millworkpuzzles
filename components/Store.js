'use client';
// Cart + sound state. shortcut: in-memory only; swap for the commerce provider's cart API when the commerce plan lands.
import { createContext, useCallback, useContext, useRef, useState } from 'react';

const Ctx = createContext(null);
export const useStore = () => useContext(Ctx);

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(null); // { edition, thickness, addons[], engraving, giftNote }
  const [open, setOpen] = useState(false);
  const [sound, setSound] = useState(false); // muted by default per blueprint
  const audio = useRef(null);

  // Synthesised hardwood tap: short filtered noise burst. Replace with a recorded sample later.
  const tap = useCallback(() => {
    if (!sound) return;
    const ac = (audio.current ||= new (window.AudioContext || window.webkitAudioContext)());
    const len = Math.floor(ac.sampleRate * 0.06);
    const buf = ac.createBuffer(1, len, ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 6);
    const src = ac.createBufferSource();
    const bp = ac.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 4;
    const g = ac.createGain(); g.gain.value = 0.5;
    src.buffer = buf; src.connect(bp).connect(g).connect(ac.destination); src.start();
  }, [sound]);

  const reserve = (item) => { setCart(item); setOpen(true); tap(); };

  return (
    <Ctx.Provider value={{ cart, setCart, reserve, open, setOpen, sound, setSound, tap }}>
      {children}
    </Ctx.Provider>
  );
}
