import { useEffect, useRef } from 'react';

/**
 * Animated lottery ball tumbler — a physics-driven globe of numbered balls that
 * auto-spins on a loop. Ported from the Desktop/animations reference (canvas).
 * Self-contained: sized via `size`, accent ball colour via `accent`.
 */
const NUMS = [7, 3, 2, 5, 8, 4, 1];

function hx(h) {
  h = h.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
function mix(h1, h2, a) {
  const c1 = hx(h1), c2 = hx(h2);
  const r = Math.round(c1[0] + (c2[0] - c1[0]) * a);
  const g = Math.round(c1[1] + (c2[1] - c1[1]) * a);
  const b = Math.round(c1[2] + (c2[2] - c1[2]) * a);
  return `rgb(${r},${g},${b})`;
}
const lighten = (h, a) => mix(h, '#ffffff', a);
const darken = (h, a) => mix(h, '#000000', a);

export default function LotteryGlobe({ size = 96, accent = '#8b5cf6' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const palette = ['#22d3c4', accent];
    const W = size, H = size, cx = W / 2, cy = H / 2, R = W / 2 - 2, ballR = R * 0.205;
    let balls = NUMS.map((n, i) => ({
      n, c: palette[i % palette.length],
      x: cx + (Math.random() - 0.5) * R * 0.8,
      y: cy + R * 0.35 + (Math.random() - 0.5) * R * 0.3,
      vx: 0, vy: 0, spin: 0, rot: Math.random() * Math.PI * 2,
    }));
    let spinUntil = 0, lastT = 0, raf = 0;

    const spin = () => {
      spinUntil = performance.now() + 3000;
      for (const b of balls) {
        b.vx = (Math.random() - 0.5) * R * 9;
        b.vy = -Math.random() * R * 9 - R * 3;
        b.spin = (Math.random() - 0.5) * 18;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const b of balls) {
        const grad = ctx.createRadialGradient(b.x - ballR * 0.35, b.y - ballR * 0.4, ballR * 0.1, b.x, b.y, ballR);
        grad.addColorStop(0, lighten(b.c, 0.55));
        grad.addColorStop(0.5, b.c);
        grad.addColorStop(1, darken(b.c, 0.45));
        ctx.beginPath();
        ctx.arc(b.x, b.y, ballR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.beginPath();
        ctx.arc(0, 0, ballR * 0.62, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.92)';
        ctx.fill();
        ctx.fillStyle = '#1a1140';
        ctx.font = `800 ${Math.round(ballR * 0.78)}px Oxanium, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(b.n), 0, ballR * 0.04);
        ctx.restore();
        ctx.beginPath();
        ctx.arc(b.x - ballR * 0.32, b.y - ballR * 0.38, ballR * 0.28, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.45)';
        ctx.fill();
      }
    };

    const step = (t) => {
      const dt = Math.min(0.032, (t - lastT) / 1000 || 0.016);
      lastT = t;
      const spinning = t < spinUntil;
      const g = spinning ? R * 1.5 : R * 6;
      const damp = spinning ? 0.995 : 0.985;
      for (const b of balls) {
        if (spinning) {
          const dx = b.x - cx, dy = b.y - cy;
          b.vx += -dy * 9 * dt;
          b.vy += dx * 9 * dt;
          b.vx += (Math.random() - 0.5) * R * 6 * dt;
          b.vy += (Math.random() - 0.5) * R * 6 * dt;
        }
        b.vy += g * dt;
        b.vx *= damp; b.vy *= damp;
        b.x += b.vx * dt; b.y += b.vy * dt;
        b.rot += b.spin * dt; b.spin *= 0.97;
        const dx = b.x - cx, dy = b.y - cy;
        const dist = Math.hypot(dx, dy);
        const max = R - ballR;
        if (dist > max) {
          const nx = dx / dist, ny = dy / dist;
          b.x = cx + nx * max; b.y = cy + ny * max;
          const vn = b.vx * nx + b.vy * ny;
          b.vx -= 1.6 * vn * nx; b.vy -= 1.6 * vn * ny;
          b.vx *= 0.7; b.vy *= 0.7;
          b.spin += (Math.random() - 0.5) * 6;
        }
      }
      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          const a = balls[i], b = balls[j];
          const dx = b.x - a.x, dy = b.y - a.y;
          const d = Math.hypot(dx, dy);
          const min = ballR * 2;
          if (d > 0 && d < min) {
            const nx = dx / d, ny = dy / d;
            const overlap = (min - d) / 2;
            a.x -= nx * overlap; a.y -= ny * overlap;
            b.x += nx * overlap; b.y += ny * overlap;
            const dvx = b.vx - a.vx, dvy = b.vy - a.vy;
            const vn = dvx * nx + dvy * ny;
            if (vn < 0) { a.vx += vn * nx; a.vy += vn * ny; b.vx -= vn * nx; b.vy -= vn * ny; }
          }
        }
      }
      draw();
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame((t) => { lastT = t; step(t); });
    const kick = setTimeout(spin, 700);
    const loop = setInterval(spin, 5200);
    return () => { cancelAnimationFrame(raf); clearTimeout(kick); clearInterval(loop); };
  }, [size, accent]);

  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-full"
      style={{
        width: size, height: size,
        background:
          'radial-gradient(circle at 32% 28%, rgba(120,90,200,0.30), transparent 42%), radial-gradient(circle at 70% 80%, rgba(40,20,90,0.55), transparent 55%), linear-gradient(160deg, #16102f 0%, #0a0720 100%)',
        boxShadow: 'inset 0 0 24px rgba(150,110,255,0.35), inset 0 0 6px rgba(255,255,255,0.25)',
      }}
      aria-hidden
    >
      <canvas ref={canvasRef} style={{ width: size, height: size }} className="block" />
      {/* glossy reflection */}
      <span
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(ellipse 38% 26% at 33% 22%, rgba(255,255,255,0.40), transparent 60%)',
        }}
      />
    </div>
  );
}
