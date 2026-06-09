import confetti from 'canvas-confetti';

const COLORS = ['#22d3c4', '#8b5cf6', '#f0a020', '#e23b3b', '#5b8def', '#27c498', '#ffffff'];

/** Quick celebratory burst (e.g. on ticket purchase). */
export function celebrate() {
  try {
    confetti({ particleCount: 130, spread: 85, startVelocity: 45, origin: { y: 0.6 }, colors: COLORS });
    setTimeout(() => confetti({ particleCount: 70, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors: COLORS }), 160);
    setTimeout(() => confetti({ particleCount: 70, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors: COLORS }), 160);
  } catch { /* no-op */ }
}

/** Side-cannon confetti loop for `duration` ms (winning-number reveal). */
export function revealCelebrate(duration = 1600, colors = COLORS) {
  try {
    const end = Date.now() + duration;
    const frame = () => {
      confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0, y: 0.65 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1, y: 0.65 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  } catch { /* no-op */ }
}

export default celebrate;
