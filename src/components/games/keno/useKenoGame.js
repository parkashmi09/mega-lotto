import { useState, useCallback, useRef } from 'react';

// Payout multiplier tables per risk level for each number of picks (1-10)
// Each sub-array is [0 hits, 1 hit, 2 hits, ... N hits] where N = picks count
const PAYOUT_TABLES = {
  classic: {
    1: [0, 3.96],
    2: [0, 1.9, 4.36],
    3: [0, 1, 2.6, 15],
    4: [0, 0, 2, 6, 40],
    5: [0, 0, 1.5, 3, 12, 70],
    6: [0, 0, 1, 2, 5, 22, 100],
    7: [0, 0, 0.5, 2, 4, 13, 55, 250],
    8: [0, 0, 0, 2.2, 4, 13, 22, 55, 70],
    9: [0, 0, 0, 1.5, 3, 5, 20, 50, 200, 500],
    10: [0, 0, 0, 1, 2.5, 4, 10, 30, 100, 300, 1000],
  },
  low: {
    1: [0, 2.85],
    2: [0, 1.4, 3.6],
    3: [0, 1, 1.8, 5],
    4: [0, 0.5, 1.5, 3, 9],
    5: [0, 0, 1.2, 2, 5, 15],
    6: [0, 0, 1, 1.5, 3, 8, 25],
    7: [0, 0, 0.5, 1.5, 2.5, 5, 15, 50],
    8: [0, 0, 0.5, 1, 2, 4, 10, 25, 80],
    9: [0, 0, 0, 1, 1.5, 3, 6, 15, 50, 150],
    10: [0, 0, 0, 0.5, 1.5, 2, 4, 10, 30, 100, 300],
  },
  medium: {
    1: [0, 3.96],
    2: [0, 1, 4.8],
    3: [0, 0, 2.8, 20],
    4: [0, 0, 1.5, 6, 50],
    5: [0, 0, 1, 4, 15, 100],
    6: [0, 0, 0.5, 2, 8, 40, 200],
    7: [0, 0, 0, 2, 5, 20, 80, 400],
    8: [0, 0, 0, 1.5, 3, 10, 40, 100, 500],
    9: [0, 0, 0, 1, 2, 5, 20, 80, 300, 800],
    10: [0, 0, 0, 0, 2, 4, 10, 40, 150, 500, 1500],
  },
  high: {
    1: [0, 3.96],
    2: [0, 0, 12],
    3: [0, 0, 2, 50],
    4: [0, 0, 1, 8, 100],
    5: [0, 0, 0, 4, 30, 200],
    6: [0, 0, 0, 2, 10, 80, 500],
    7: [0, 0, 0, 1, 5, 30, 150, 800],
    8: [0, 0, 0, 0, 3, 15, 60, 300, 1000],
    9: [0, 0, 0, 0, 2, 8, 30, 150, 500, 2000],
    10: [0, 0, 0, 0, 1, 5, 20, 80, 300, 1000, 3000],
  },
};

const TOTAL_NUMBERS = 40;
const DRAW_COUNT = 10;
const MAX_PICKS = 10;
const MIN_PICKS = 1;

export function useKenoGame() {
  const [selectedNumbers, setSelectedNumbers] = useState(new Set());
  const [drawnNumbers, setDrawnNumbers] = useState(new Set());
  const [betAmount, setBetAmount] = useState(0);
  const [riskLevel, setRiskLevel] = useState('classic');
  const [picksCount, setPicksCount] = useState(8);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gamePhase, setGamePhase] = useState('idle'); // idle | drawing | result
  const [hitCount, setHitCount] = useState(0);
  const [payout, setPayout] = useState(0);
  const [mode, setMode] = useState('manual'); // manual | autoplay
  const drawTimerRef = useRef(null);

  const payoutTable = PAYOUT_TABLES[riskLevel]?.[picksCount] || [];

  const toggleNumber = useCallback((num) => {
    if (gamePhase !== 'idle') return;
    setSelectedNumbers(prev => {
      const next = new Set(prev);
      if (next.has(num)) {
        next.delete(num);
      } else if (next.size < picksCount) {
        next.add(num);
      }
      return next;
    });
  }, [gamePhase, picksCount]);

  const clearPicks = useCallback(() => {
    if (gamePhase !== 'idle') return;
    setSelectedNumbers(new Set());
    setDrawnNumbers(new Set());
    setHitCount(0);
    setPayout(0);
    setGamePhase('idle');
  }, [gamePhase]);

  const autoPickNumbers = useCallback(() => {
    if (gamePhase !== 'idle') return;
    const available = [];
    for (let i = 1; i <= TOTAL_NUMBERS; i++) available.push(i);
    // Shuffle and pick
    for (let i = available.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [available[i], available[j]] = [available[j], available[i]];
    }
    setSelectedNumbers(new Set(available.slice(0, picksCount)));
  }, [gamePhase, picksCount]);

  const play = useCallback(({ playSound } = {}) => {
    if (gamePhase !== 'idle') return;
    if (selectedNumbers.size !== picksCount) return;

    setIsPlaying(true);
    setGamePhase('drawing');
    setDrawnNumbers(new Set());
    setHitCount(0);
    setPayout(0);

    // Generate draw
    const available = [];
    for (let i = 1; i <= TOTAL_NUMBERS; i++) available.push(i);
    for (let i = available.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [available[i], available[j]] = [available[j], available[i]];
    }
    const drawn = available.slice(0, DRAW_COUNT);

    // Animate draws one by one
    let idx = 0;
    const revealNext = () => {
      if (idx >= drawn.length) {
        // Done drawing
        const finalDrawn = new Set(drawn);
        let hits = 0;
        selectedNumbers.forEach(n => { if (finalDrawn.has(n)) hits++; });
        const table = PAYOUT_TABLES[riskLevel]?.[picksCount] || [];
        const mult = table[hits] || 0;
        setHitCount(hits);
        setPayout(betAmount * mult);
        setGamePhase('result');
        setIsPlaying(false);
        if (mult > 0 && playSound) playSound('win');
        return;
      }

      const currentNum = drawn[idx];
      const isMatch = selectedNumbers.has(currentNum);

      setDrawnNumbers(prev => {
        const next = new Set(prev);
        next.add(currentNum);
        return next;
      });

      if (playSound) {
        if (isMatch) {
          playSound('match');
        } else {
          playSound('reveal');
        }
        playSound('tick');
      }

      idx++;
      drawTimerRef.current = setTimeout(revealNext, 120);
    };
    drawTimerRef.current = setTimeout(revealNext, 200);
  }, [gamePhase, selectedNumbers, picksCount, riskLevel, betAmount]);

  const resetGame = useCallback(() => {
    if (drawTimerRef.current) clearTimeout(drawTimerRef.current);
    setDrawnNumbers(new Set());
    setHitCount(0);
    setPayout(0);
    setGamePhase('idle');
    setIsPlaying(false);
  }, []);

  const setPicksCountSafe = useCallback((count) => {
    const c = Math.max(MIN_PICKS, Math.min(MAX_PICKS, count));
    setPicksCount(c);
    // If current selections exceed new picks count, trim
    setSelectedNumbers(prev => {
      if (prev.size <= c) return prev;
      const arr = Array.from(prev).slice(0, c);
      return new Set(arr);
    });
    setDrawnNumbers(new Set());
    setHitCount(0);
    setPayout(0);
    setGamePhase('idle');
  }, []);

  const halveBet = useCallback(() => setBetAmount(prev => Math.max(0, +(prev / 2).toFixed(2))), []);
  const doubleBet = useCallback(() => setBetAmount(prev => +(prev * 2).toFixed(2)), []);

  return {
    // State
    selectedNumbers,
    drawnNumbers,
    betAmount,
    riskLevel,
    picksCount,
    isPlaying,
    gamePhase,
    hitCount,
    payout,
    payoutTable,
    mode,
    totalNumbers: TOTAL_NUMBERS,
    maxPicks: MAX_PICKS,
    minPicks: MIN_PICKS,
    // Actions
    toggleNumber,
    clearPicks,
    autoPickNumbers,
    play,
    resetGame,
    setBetAmount,
    setRiskLevel: (level) => { if (gamePhase === 'idle') setRiskLevel(level); },
    setPicksCount: setPicksCountSafe,
    setMode,
    halveBet,
    doubleBet,
  };
}
