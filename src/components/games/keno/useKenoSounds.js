import { useRef, useCallback } from 'react';

const SOUND_CONFIG = {
  bet:    { src: '/sounds/keno/bet.mp3',    volume: 0.6 },
  tick:   { src: '/sounds/keno/tick.mp3',   volume: 0.4 },
  pick:   { src: '/sounds/keno/pick.mp3',   volume: 1.0 },
  match:  { src: '/sounds/keno/match.mp3',  volume: 1.0 },
  reveal: { src: '/sounds/keno/reveal.mp3', volume: 1.0 },
  win:    { src: '/sounds/keno/win.mp3',    volume: 0.3 },
};

export function useKenoSounds() {
  const poolRef = useRef({});

  const play = useCallback((name) => {
    const config = SOUND_CONFIG[name];
    if (!config) return;

    if (!poolRef.current[name]) {
      poolRef.current[name] = [];
    }

    const pool = poolRef.current[name];
    let audio = pool.find(a => a.paused || a.ended);

    if (!audio) {
      audio = new Audio(config.src);
      audio.volume = config.volume;
      pool.push(audio);
    }

    audio.currentTime = 0;
    audio.play().catch(() => {});
  }, []);

  return { play };
}
