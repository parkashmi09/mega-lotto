import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSiteConfig } from '@/context/SiteConfigContext.jsx';
import { useScreenSize } from '@/hooks';

/* ── Sport icon paths ── */
const SPORT_ICONS = {
  cricket: 'M14.12 1.29a1 1 0 0 1 1.41 0l7.18 7.18a1 1 0 0 1 0 1.41l-1.42 1.42a1 1 0 0 1-1.41 0L12.7 4.12a1 1 0 0 1 0-1.41zM11.29 6.7a1 1 0 0 1 1.41 0l4.6 4.6a1 1 0 0 1 0 1.41l-5.66 5.66a3 3 0 0 1-2.52.87l-3.18-.32-.32-3.18a3 3 0 0 1 .87-2.52zm-3.54 7.07a1.25 1.25 0 1 0-1.77 1.77 1.25 1.25 0 0 0 1.77-1.77M2.64 19.95l-.93.93a1 1 0 0 0 1.41 1.41l.93-.93a3.5 3.5 0 0 0-1.41-1.41',
  football: 'M12 .25C5.51.25.25 5.51.25 12S5.51 23.75 12 23.75 23.75 18.49 23.75 12 18.49.25 12 .25m-.75 2.027A9.75 9.75 0 0 0 2.277 11.25H5.5l2.8-2.1.7-3.5zm1.5 0v1.346l2.95 1.477 3.1-.9a9.7 9.7 0 0 0-6.05-1.923m7.488 3.073-2.338.678-1.65 3.472 1.75 3 3.498.75a9.7 9.7 0 0 0 .74-3.25 9.7 9.7 0 0 0-2-4.65',
  soccer: 'M12 .25C5.51.25.25 5.51.25 12S5.51 23.75 12 23.75 23.75 18.49 23.75 12 18.49.25 12 .25m-.75 2.027A9.75 9.75 0 0 0 2.277 11.25H5.5l2.8-2.1.7-3.5zm1.5 0v1.346l2.95 1.477 3.1-.9a9.7 9.7 0 0 0-6.05-1.923m7.488 3.073-2.338.678-1.65 3.472 1.75 3 3.498.75a9.7 9.7 0 0 0 .74-3.25 9.7 9.7 0 0 0-2-4.65',
  tennis: 'M12 .25C5.51.25.25 5.51.25 12S5.51 23.75 12 23.75 23.75 18.49 23.75 12 18.49.25 12 .25m0 1.5c1.856 0 3.598.504 5.091 1.382a12.3 12.3 0 0 0-1.591 5.618 12.3 12.3 0 0 0 1.591 5.618A9.73 9.73 0 0 1 12 15.75a9.73 9.73 0 0 1-5.091-1.382',
  basketball: 'M12 .25C5.51.25.25 5.51.25 12S5.51 23.75 12 23.75 23.75 18.49 23.75 12 18.49.25 12 .25m-1 2.052v4.95l-4.243 4.242-4.704-1.57a9.72 9.72 0 0 1 8.947-7.622',
  esports: 'M6.5 1.25C4.16 1.25 2.25 3.16 2.25 5.5v2.55c0 3.55 1.17 7.02 3.34 9.86l1.29 1.7c.72.95 1.84 1.5 3.03 1.5h4.18c1.19 0 2.31-.55 3.03-1.5l1.29-1.7a15.88 15.88 0 0 0 3.34-9.86V5.5c0-2.34-1.91-4.25-4.25-4.25z',
};

const SPORT_LABELS = {
  cricket: 'app.cricket',
  football: 'app.football',
  soccer: 'app.football',
  tennis: 'app.tennis',
  basketball: 'app.basketball',
  esports: 'app.esports',
};

/* ── Mock match data ── */
const MOCK_MATCHES = {
  cricket: {
    inPlay: [
      {
        id: 'c1',
        teams: 'Canada v United Arab Emirates',
        matched: '4,767,138.75',
        hasStream: true,
        hasCashout: true,
        hasLM: true,
        hasBM: true,
        hasFM: true,
        odds: [
          { back: { price: '2.48', size: '4K' }, lay: { price: '2.5', size: '2K' } },
          { back: { price: '', size: '' }, lay: { price: '', size: '' } },
          { back: { price: '1.66', size: '8K' }, lay: { price: '1.67', size: '6K' } },
        ],
        tournamentWinner: false,
      },
    ],
    comingUp: [
      {
        id: 'c2',
        teams: 'USA v Netherlands',
        time: 'Today 19:00',
        matched: '51,030.88',
        hasStream: true,
        hasCashout: true,
        hasLM: true,
        hasBM: true,
        hasFM: true,
        odds: [
          { back: { price: '2.22', size: '137' }, lay: { price: '2.24', size: '2K' } },
          { back: { price: '', size: '' }, lay: { price: '', size: '' } },
          { back: { price: '1.8', size: '3K' }, lay: { price: '1.82', size: '367' } },
        ],
        tournamentWinner: false,
      },
      {
        id: 'c3',
        teams: 'South Africa W v Pakistan W',
        time: 'Today 21:30',
        matched: '48,262.64',
        hasStream: true,
        hasCashout: true,
        hasLM: true,
        hasBM: true,
        hasFM: true,
        odds: [
          { back: { price: '1.23', size: '214' }, lay: { price: '1.25', size: '2K' } },
          { back: { price: '', size: '' }, lay: { price: '', size: '' } },
          { back: { price: '5.1', size: '19' }, lay: { price: '5.3', size: '6' } },
        ],
        tournamentWinner: false,
      },
      {
        id: 'c4',
        teams: "ICC Men's T20 World Cup",
        time: '19:00 Sun 8',
        matched: '974,868.06',
        hasStream: true,
        hasCashout: true,
        hasLM: true,
        hasBM: true,
        hasFM: true,
        odds: [
          { back: { price: '2.44', size: '217' }, lay: { price: '2.46', size: '498' } },
          { back: { price: '', size: '' }, lay: { price: '', size: '' } },
          { back: { price: '10', size: '2K' }, lay: { price: '10.5', size: '257' } },
        ],
        tournamentWinner: true,
      },
    ],
  },
  football: {
    inPlay: [],
    comingUp: [
      {
        id: 'f1',
        teams: 'Rennes v Paris St-G',
        time: 'Today 23:30',
        matched: '149,721.92',
        hasStream: true,
        hasCashout: true,
        hasLM: false,
        hasBM: true,
        hasFM: true,
        odds: [
          { back: { price: '7.2', size: '269' }, lay: { price: '7.4', size: '97' } },
          { back: { price: '1.45', size: '7K' }, lay: { price: '1.46', size: '5K' } },
          { back: { price: '5.6', size: '489' }, lay: { price: '5.7', size: '602' } },
        ],
        tournamentWinner: false,
      },
      {
        id: 'f2',
        teams: 'Dortmund v Mainz',
        time: 'Today 01:00',
        matched: '80,205.18',
        hasStream: true,
        hasCashout: true,
        hasLM: false,
        hasBM: true,
        hasFM: true,
        odds: [
          { back: { price: '1.64', size: '75' }, lay: { price: '1.65', size: '1K' } },
          { back: { price: '5.7', size: '224' }, lay: { price: '5.9', size: '293' } },
          { back: { price: '4.5', size: '2K' }, lay: { price: '4.6', size: '24' } },
        ],
        tournamentWinner: false,
      },
    ],
  },
};

/* ── Sport SVG Icon ── */
function SportIcon({ sport, className = 'size-5' }) {
  const d = SPORT_ICONS[sport] || SPORT_ICONS.cricket;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path fillRule="evenodd" d={d} clipRule="evenodd" fill="currentColor" stroke="transparent" />
    </svg>
  );
}

/* ── Odds Cell (back or lay) ── */
function OddsCell({ type, price, size }) {
  const empty = !price;
  const bgVar = empty
    ? (type === 'back' ? '--color-back-bg-muted' : '--color-lay-bg-muted')
    : (type === 'back' ? '--color-back-bg' : '--color-lay-bg');

  return (
    <div
      className="flex flex-col items-center justify-center flex-1 min-w-0 px-1.5 py-1 rounded-sm text-[13px]"
      style={{ background: `var(${bgVar})`, color: 'var(--color-odds-text)' }}
    >
      <span className="font-semibold leading-tight">{price || '-'}</span>
      <span className="text-[10px] opacity-80 leading-tight">{size}</span>
    </div>
  );
}

/* ── Match Card Row ── */
function MatchCard({ match, isInPlay, isMobile }) {
  // On mobile: show only the first odds pair (1 back + 1 lay)
  const oddsToShow = isMobile ? match.odds.slice(0, 1) : match.odds;

  return (
    <div className="border-b border-[var(--color-match-card-border)]">
      <div
        className="grid items-center m-0"
        style={{
          gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 95px 160px 1fr',
          background: 'var(--color-match-card-bg)',
          color: 'var(--color-match-card-text)',
        }}
      >
        {/* Match info */}
        <div className="flex items-center min-w-0 gap-1">
          {isInPlay ? (
            <span
              className="shrink-0 flex items-center justify-center w-[57px] sm:w-[67px] min-h-[43px] rounded-none text-[11px] sm:text-[12px] font-medium"
              style={{ background: 'var(--color-score-bg)', color: 'var(--color-score-text)' }}
            >
              In-play
            </span>
          ) : (
            <span
              className="shrink-0 flex items-center justify-center w-[44px] sm:w-[50px] min-h-[43px] text-center border-r border-[var(--color-match-card-border)]"
              style={{ background: 'var(--color-time-remaining-bg)', color: 'var(--color-time-remaining-text)' }}
            >
              <span className="whitespace-normal break-words leading-tight text-[10px] sm:text-[11px]">{match.time || ''}</span>
            </span>
          )}
          <div className="min-w-0 py-1 px-1">
            <span className="text-[12px] font-semibold block truncate" style={{ color: 'var(--color-match-teams-text)' }}>
              {match.teams}
            </span>
            {/* Mobile: show market badges inline below team name */}
            {isMobile && (
              <div className="flex items-center gap-1 mt-0.5">
                {match.hasCashout && (
                  <span className="text-[8px] rounded-sm px-1 py-px" style={{ background: 'var(--color-cashout-bg)', color: 'var(--color-cashout-text)' }}>C</span>
                )}
                {match.hasLM && (
                  <span className="text-[8px] rounded-sm px-1 py-px" style={{ background: 'var(--color-market-badge-bg)', color: 'var(--color-market-badge-text)' }}>LM</span>
                )}
                {match.hasBM && (
                  <span className="text-[8px] rounded-sm px-1 py-px" style={{ background: 'var(--color-market-badge-bg)', color: 'var(--color-market-badge-text)' }}>BM</span>
                )}
                {match.hasFM && (
                  <span className="text-[8px] rounded-sm px-1 py-px" style={{ background: 'var(--color-market-badge-bg)', color: 'var(--color-market-badge-text)' }}>FM</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Desktop only: Matched amount */}
        {!isMobile && (
          <div className="flex flex-col items-center justify-center gap-[3px] text-[10px]">
            {match.matched && <span>{match.matched}</span>}
          </div>
        )}

        {/* Desktop only: Market icons */}
        {!isMobile && (
          <div className="flex items-center gap-1 px-1 justify-start">
            {match.hasStream && (
              <span
                className="inline-block w-[18px] h-[18px] shrink-0"
                style={{
                  backgroundColor: 'var(--color-match-card-text)',
                  maskImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='currentColor'%3E%3Cpath d='M0 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3zm2 1a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H2z'/%3E%3C/svg%3E\")",
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  WebkitMaskImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='currentColor'%3E%3Cpath d='M0 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3zm2 1a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H2z'/%3E%3C/svg%3E\")",
                  WebkitMaskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                }}
                title="Live stream"
              />
            )}
            {match.hasCashout && (
              <span className="text-[10px] rounded-sm px-1 py-0.5 min-w-[20px] text-center" style={{ background: 'var(--color-cashout-bg)', color: 'var(--color-cashout-text)' }}>C</span>
            )}
            {match.hasLM && (
              <span className="text-[10px] rounded-sm px-1 py-0.5 min-w-[20px] text-center" style={{ background: 'var(--color-market-badge-bg)', color: 'var(--color-market-badge-text)' }}>LM</span>
            )}
            {match.hasBM && (
              <span className="text-[10px] rounded-sm px-1 py-0.5 min-w-[20px] text-center" style={{ background: 'var(--color-market-badge-bg)', color: 'var(--color-market-badge-text)' }}>BM</span>
            )}
            {match.hasFM && (
              <span className="text-[10px] rounded-sm px-1 py-0.5 min-w-[20px] text-center" style={{ background: 'var(--color-market-badge-bg)', color: 'var(--color-market-badge-text)' }}>FM</span>
            )}
          </div>
        )}

        {/* Odds */}
        <div className="flex gap-[3px] m-[1px] relative min-w-0">
          {match.tournamentWinner && (
            <div
              className="absolute inset-0 z-[3] flex items-center justify-center px-2.5 rounded-[5px] text-[12px] sm:text-sm font-semibold pointer-events-none backdrop-blur-[5px]"
              style={{ background: 'var(--color-tournament-overlay)', color: 'var(--color-tournament-text)' }}
            >
              Tournament Winner
            </div>
          )}
          {oddsToShow.map((pair, i) => (
            <span key={i} className="flex gap-0.5 flex-1 min-w-0">
              <OddsCell type="back" price={pair.back.price} size={pair.back.size} />
              <OddsCell type="lay" price={pair.lay.price} size={pair.lay.size} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Section Header (In Play / Coming Up) ── */
function SectionHeader({ label, isMobile }) {
  return (
    <div
      className="grid items-center gap-x-3 text-[13px] font-bold px-2 py-1"
      style={{
        gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 95px 160px 1fr',
        background: 'var(--color-sport-heading-bg)',
      }}
    >
      <div className="text-left text-[13px] font-semibold px-1 py-1" style={{ color: 'var(--color-sport-heading-text)' }}>
        {label}
      </div>
      {!isMobile && (
        <strong className="text-[12px] font-normal text-center" style={{ color: 'var(--color-sport-heading-text)' }}>
          Matched
        </strong>
      )}
      {!isMobile && <div />}
      <div className="flex justify-between items-center min-w-0">
        {isMobile ? (
          <>
            <span className="text-center flex-1 min-w-0 font-normal text-[12px]" style={{ color: 'var(--color-sport-heading-text)' }}>Back</span>
            <span className="text-center flex-1 min-w-0 font-normal text-[12px]" style={{ color: 'var(--color-sport-heading-text)' }}>Lay</span>
          </>
        ) : (
          ['1', 'X', '2'].map(v => (
            <span key={v} className="text-center flex-1 min-w-0 font-normal text-[12px]" style={{ color: 'var(--color-sport-heading-text)' }}>
              {v}
            </span>
          ))
        )}
      </div>
    </div>
  );
}

/* ── Sport Block (tab header + heading rows + match cards) ── */
function SportBlock({ sportId, data, isMobile }) {
  const { t } = useTranslation();
  const hasInPlay = data.inPlay?.length > 0;
  const hasComingUp = data.comingUp?.length > 0;
  const labelKey = SPORT_LABELS[sportId] || sportId;

  return (
    <div className="mt-2 rounded-lg overflow-hidden">
      {/* Sport tab header */}
      <div
        className="flex justify-between items-center gap-4 min-h-[44px] px-3"
        style={{ background: 'var(--color-sport-tab-bg)', color: 'var(--color-sport-tab-text)' }}
      >
        <div className="flex items-center gap-2">
          <SportIcon sport={sportId} className="size-5 shrink-0" />
          <span className="text-sm font-semibold">{t(labelKey)}</span>
        </div>
        <Link
          to={`/sports/${sportId}`}
          className="inline-flex items-center gap-0.5 px-2 py-1 rounded-[5px] text-sm font-normal no-underline cursor-pointer transition-opacity hover:opacity-90"
          style={{ background: 'var(--color-see-all-bg)', color: 'var(--color-see-all-text)' }}
        >
          See all <span className="text-[15px]" aria-hidden>›</span>
        </Link>
      </div>

      {/* Match sections */}
      <div className="relative">
        {hasInPlay && (
          <>
            <SectionHeader label="In Play" isMobile={isMobile} />
            {data.inPlay.map(m => <MatchCard key={m.id} match={m} isInPlay isMobile={isMobile} />)}
          </>
        )}
        {hasComingUp && (
          <>
            <SectionHeader label="Coming up" isMobile={isMobile} />
            {data.comingUp.map(m => <MatchCard key={m.id} match={m} isInPlay={false} isMobile={isMobile} />)}
          </>
        )}
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function HomeSportsSection() {
  const { config } = useSiteConfig();
  const { isMobile } = useScreenSize();
  const activeSports = config?.active_sports || [];

  const sportsWithData = useMemo(() => {
    return activeSports
      .filter(s => MOCK_MATCHES[s])
      .map(s => ({ id: s, data: MOCK_MATCHES[s] }));
  }, [activeSports]);

  if (sportsWithData.length === 0) return null;

  return (
    <div className="mt-2 mb-8 space-y-4">
      {sportsWithData.map(({ id, data }) => (
        <SportBlock key={id} sportId={id} data={data} isMobile={isMobile} />
      ))}
    </div>
  );
}
