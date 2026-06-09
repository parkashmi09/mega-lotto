import { useEffect, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft } from 'lucide-react';
import { getDrawById } from '../services/lottery/lotteryService.js';
import MegaLootSection from '../components/lottery/MegaLootSection.jsx';

/* Play page now reuses the exact same inline buy board as the home page
   (MegaLootSection) for whichever draw is opened — pick numbers, live countdown,
   confirm modal and purchase, all identical to the home experience. */
export function LotteryPlayPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lotteryId } = useParams();

  const [draw, setDraw] = useState(undefined); // undefined = loading, null = not found

  useEffect(() => {
    let alive = true;
    setDraw(undefined);
    getDrawById(lotteryId).then((d) => { if (alive) setDraw(d || null); });
    return () => { alive = false; };
  }, [lotteryId]);

  if (draw === null) return <Navigate to="/lottery" replace />;

  return (
    <div className="py-[16px] sm:py-[24px]">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate('/lottery')}
        className="mb-[16px] inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-foreground-muted-1)] hover:text-[var(--color-foreground-primary)] cursor-pointer"
      >
        <ChevronLeft size={16} /> {t('lottery.draws')}
      </button>

      {draw === undefined ? (
        <div className="flex min-h-[400px] items-center justify-center py-16 text-[var(--color-text-secondary)]">
          {t('common.loading', 'Loading…')}
        </div>
      ) : (
        <MegaLootSection lotteryId={lotteryId} />
      )}
    </div>
  );
}

export default LotteryPlayPage;
