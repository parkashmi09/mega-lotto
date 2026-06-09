import { useEffect, useRef } from 'react';

/** Same payment icons + auto-scroll marquee as the lagaobet footer. */
const PAYMENT_ICONS = [
  { src: '/assets/new-payment-assets/bhim.svg', size: 'w-8 h-8' },
  { src: '/assets/new-payment-assets/googlepay.svg', size: 'w-8 h-8' },
  { src: '/assets/new-payment-assets/imps.png', size: 'w-11 h-11' },
  { src: '/assets/new-payment-assets/master.png', size: 'w-8 h-8' },
  { src: '/assets/new-payment-assets/phonepay.svg', size: 'w-8 h-8' },
  { src: '/assets/new-payment-assets/visa.svg', size: 'w-8 h-8' },
];

export function PaymentMarquee() {
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let pos = 0;
    let animId;
    const speed = 0.4;
    const totalWidth = el.scrollWidth / 2;

    function animate() {
      pos -= speed;
      if (Math.abs(pos) >= totalWidth) pos = 0;
      el.style.transform = `translate3d(${pos}px, 0, 0)`;
      animId = requestAnimationFrame(animate);
    }
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  const icons = [...PAYMENT_ICONS, ...PAYMENT_ICONS, ...PAYMENT_ICONS, ...PAYMENT_ICONS];

  return (
    <div className="relative w-full">
      {/* left fade */}
      <div className="pointer-events-none absolute top-0 left-0 z-20 h-full w-10 bg-gradient-to-r from-[var(--color-surface-1)] to-transparent" />
      <div className="relative w-full overflow-hidden">
        <div ref={scrollRef} className="flex items-center gap-5 will-change-transform">
          {icons.map((icon, i) => (
            <img
              key={`${icon.src}-${i}`}
              alt="Payment method"
              draggable="false"
              loading="lazy"
              className={`${icon.size} flex-shrink-0 object-contain`}
              src={icon.src}
            />
          ))}
        </div>
      </div>
      {/* right fade */}
      <div className="pointer-events-none absolute top-0 right-0 z-20 h-full w-10 bg-gradient-to-l from-[var(--color-surface-1)] to-transparent" />
    </div>
  );
}

export default PaymentMarquee;
