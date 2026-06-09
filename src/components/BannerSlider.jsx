import { useState, useRef, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { useScreenSize } from '@/hooks';
import 'swiper/css';

/* ── Badge Icons ── */
function StarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="size-[10px]">
      <path fillRule="evenodd" d="M12 .25C6.615.25 2.25 4.615 2.25 10s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385.25 12 .25m1.11 4.846a1.25 1.25 0 0 0-2.22 0L9.868 7.067l-2.188.431a1.25 1.25 0 0 0-.688 2.062l1.566 1.742-.286 2.318a1.25 1.25 0 0 0 1.799 1.272L12 13.929l1.93.963a1.25 1.25 0 0 0 1.798-1.272l-.286-2.318 1.566-1.742a1.25 1.25 0 0 0-.688-2.062l-2.188-.43zm6.937 12.765a11.22 11.22 0 0 1-6.214 3.24c.418 1.028.706 1.782.888 2.274.185.5.82.665 1.222.308l1.592-1.414a.25.25 0 0 1 .24-.053l2.505.771c.476.147.98-.208.924-.738-.09-.87-.359-2.479-1.157-4.388m-9.88 3.24a11.22 11.22 0 0 1-6.214-3.24c-.798 1.91-1.067 3.519-1.157 4.388-.055.53.448.885.925.738l2.505-.77a.25.25 0 0 1 .24.052l1.59 1.414a.765.765 0 0 0 1.223-.308c.182-.492.47-1.246.889-2.273" clipRule="evenodd" className="fill-current stroke-transparent" />
    </svg>
  );
}

function PercentIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="size-[10px]">
      <path fillRule="evenodd" d="M9.694 1.07a3.655 3.655 0 0 1 4.612 0l.511.415.65-.104a3.655 3.655 0 0 1 3.995 2.306l.235.616.616.234a3.655 3.655 0 0 1 2.306 3.995l-.104.65.415.512a3.655 3.655 0 0 1 0 4.612l-.415.511.104.65a3.655 3.655 0 0 1-2.306 3.995l-.616.235-.235.616a3.655 3.655 0 0 1-3.994 2.306l-.65-.104-.512.415a3.655 3.655 0 0 1-4.612 0l-.511-.415-.65.104a3.655 3.655 0 0 1-3.996-2.306l-.234-.616-.616-.235a3.655 3.655 0 0 1-2.306-3.994l.104-.65-.415-.512a3.655 3.655 0 0 1 0-4.612l.415-.511-.104-.65a3.655 3.655 0 0 1 2.306-3.996l.616-.234.234-.616a3.655 3.655 0 0 1 3.995-2.306l.65.104zM7 8.743c0-.523.132-.803.28-.967.164-.173.374-.276.72-.276.336 0 .544.101.711.28.154.164.289.442.289.963 0 .535-.137.815-.289.977-.167.178-.375.28-.711.28-.346 0-.556-.103-.72-.276C7.134 9.562 7 9.28 7 8.743M8 5.5c-.844 0-1.602.293-2.183.912l-.008.008C5.23 7.052 5 7.87 5 8.743c0 .879.228 1.702.81 2.336l.007.009c.58.62 1.34.912 2.183.912.84 0 1.593-.296 2.17-.912.595-.634.83-1.46.83-2.345 0-.88-.238-1.7-.83-2.33C9.594 5.795 8.84 5.5 8 5.5m7 9.743c0-.523.132-.803.28-.967.164-.173.374-.276.72-.276.336 0 .544.101.712.28.153.164.288.442.288.963 0 .535-.137.815-.288.977-.168.178-.376.28-.712.28-.346 0-.556-.103-.72-.276-.146-.162-.28-.445-.28-.981M16 12c-.844 0-1.602.293-2.183.912l-.008.008c-.579.632-.809 1.45-.809 2.323 0 .879.228 1.702.81 2.336l.007.009c.58.62 1.34.912 2.183.912.84 0 1.593-.296 2.17-.912.595-.634.83-1.46.83-2.345 0-.88-.238-1.7-.83-2.33C17.594 12.295 16.84 12 16 12m1.207-5.207a1 1 0 0 1 0 1.414l-9 9a1 1 0 1 1-1.414-1.414l9-9a1 1 0 0 1 1.414 0" clipRule="evenodd" className="fill-current stroke-transparent" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="size-[10px]">
      <path fillRule="evenodd" d="M5.051 2.04A1.125 1.125 0 1 0 3.45.46C1.573 2.364.344 5.1.128 8.17a1.125 1.125 0 0 0 2.244.16c.182-2.58 1.21-4.799 2.68-6.29M18.961.449a1.125 1.125 0 0 1 1.59.011c1.876 1.904 3.105 4.64 3.321 7.71a1.125 1.125 0 1 1-2.244.16c-.182-2.58-1.21-4.799-2.68-6.29A1.125 1.125 0 0 1 18.96.449M3.678 7.915a8.349 8.349 0 0 1 16.642 0l.27 3.277a7.25 7.25 0 0 0 1.055 3.214l.939 1.52c.395.64.544 1.393.296 2.07-.26.708-.89 1.165-1.692 1.287-1.588.241-4.358.467-9.189.467-4.83 0-7.6-.226-9.189-.467-.802-.123-1.433-.579-1.692-1.286-.248-.678-.099-1.43.296-2.07l.939-1.52a7.25 7.25 0 0 0 1.056-3.215zM12 21.25c-1.633 0-3.04-.026-4.252-.07a4.75 4.75 0 0 0 8.504 0c-1.212.044-2.618.07-4.252.07" clipRule="evenodd" className="fill-current stroke-transparent" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="size-[10px]">
      <path fillRule="evenodd" d="M7 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v1h3a2 2 0 0 1 2 2v2a4 4 0 0 1-3.5 3.97A7 7 0 0 1 13 14.92V18h2a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h2v-3.08A7 7 0 0 1 6.5 10.97 4 4 0 0 1 3 7V5a2 2 0 0 1 2-2h2z" clipRule="evenodd" className="fill-current stroke-transparent" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="size-[10px]">
      <path d="M22.351.385A1.23 1.23 0 0 0 21.334.32c-.311.107-.593.311-.823.53A557 557 0 0 0 12 9.153 556 556 0 0 0 3.49.849C3.26.63 2.978.426 2.667.32a1.23 1.23 0 0 0-1.018.066c-.221.12-.463.295-.715.548a3.1 3.1 0 0 0-.549.716C.2 1.992.21 2.349.32 2.666c.108.311.311.593.53.823A556 556 0 0 0 9.154 12 557 557 0 0 0 .85 20.51c-.219.23-.422.512-.53.823-.11.318-.12.675.066 1.018.12.221.296.463.549.716.252.252.494.428.715.548.343.186.7.176 1.018.066.31-.108.592-.311.823-.53A556 556 0 0 0 12 14.847c4.245 4.22 7.257 7.11 8.51 8.304.231.219.513.422.824.53.318.11.674.12 1.017-.066a3.1 3.1 0 0 0 .716-.548c.253-.253.428-.495.548-.716.187-.343.176-.7.066-1.017-.107-.311-.31-.593-.53-.824A556 556 0 0 0 14.847 12a556 556 0 0 0 8.304-8.51c.219-.23.423-.513.53-.824.11-.317.12-.674-.066-1.017a3.1 3.1 0 0 0-.548-.716 3.1 3.1 0 0 0-.716-.548" className="fill-current stroke-transparent" />
    </svg>
  );
}

const BADGE_ICONS = {
  star: StarIcon,
  percent: PercentIcon,
  bell: BellIcon,
  trophy: TrophyIcon,
};

/* ── Single Banner Card ── */
function BannerCard({ banner, onDismiss }) {
  const style = {
    '--banner-bg': banner.bannerBg,
    '--banner-fg': banner.bannerFg,
    '--banner-gradient': `linear-gradient(to right, ${banner.bannerBg}, 80%, ${banner.bannerBg}00)`,
    '--banner-badge-bg': banner.badgeBg,
    '--banner-badge-fg': banner.badgeFg,
    '--banner-icon-bg': banner.iconBg,
    '--banner-icon-fg': banner.iconFg,
  };

  const BadgeIcon = BADGE_ICONS[banner.badgeIcon] || StarIcon;

  const linkProps = banner.external
    ? { href: banner.href, target: '_blank', rel: 'noopener noreferrer' }
    : { href: banner.href };

  return (
    <a
      {...linkProps}
      draggable="false"
      className="group/banner relative flex h-[135px] min-w-px flex-col items-start overflow-clip rounded-[24px] transition-all duration-200 cursor-pointer sm:h-[179px] sm:rounded-[32px]"
      style={{ ...style, backgroundColor: 'var(--banner-bg)', color: 'var(--banner-fg)' }}
    >
      {/* Right-side image */}
      <img
        className="pointer-events-none absolute top-0 right-[-30px] w-[249px] select-none sm:right-[-50px] sm:w-[330px]"
        src={banner.image}
        alt={banner.title}
      />

      {/* Left content with gradient */}
      <div
        className="relative box-border flex h-full w-[260px] flex-col items-start px-[20px] py-[18px] sm:w-[288px] sm:px-[24px] sm:py-[24px]"
        style={{ backgroundImage: 'var(--banner-gradient)' }}
      >
        {/* Badge */}
        <div
          className="flex items-center gap-[6px] rounded-full p-[3px] pr-[11px]"
          style={{ backgroundColor: 'var(--banner-badge-bg)', color: 'var(--banner-badge-fg)' }}
        >
          <div
            className="flex size-[18px] items-center justify-center rounded-full"
            style={{ backgroundColor: 'var(--banner-icon-bg)', color: 'var(--banner-icon-fg)' }}
          >
            <BadgeIcon />
          </div>
          <span className="text-[10px] font-extrabold uppercase leading-tight">{banner.badgeLabel}</span>
        </div>

        {/* Title */}
        <p className="mt-[12px] text-[20px] font-extrabold uppercase leading-[100%] sm:mt-[16px] sm:text-[30px]">
          {banner.title.split('\n').map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </p>

        {/* Subtitle */}
        <p className="mt-[10px] text-[10px] font-semibold uppercase leading-tight sm:mt-[14px] sm:text-[12px]">
          {banner.subtitle.split('\n').map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </p>
      </div>

      {/* Close/dismiss button */}
      {onDismiss && (
        <button
          aria-label="Close banner"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDismiss(banner.id);
          }}
          className="absolute top-[16px] right-[16px] cursor-pointer rounded-full bg-[#3C4357] p-[8px] text-[#FFFFFF] opacity-70 transition-all duration-200 hover:scale-105 sm:opacity-0 sm:group-hover/banner:opacity-70"
        >
          <CloseIcon />
        </button>
      )}
    </a>
  );
}

/* ── Reusable Banner Slider ── */
export default function BannerSlider({ banners }) {
  const { isMobile } = useScreenSize();
  const [dismissed, setDismissed] = useState([]);
  const swiperRef = useRef(null);

  const visibleBanners = banners.filter(b => !dismissed.includes(b.id));

  const handleDismiss = useCallback((id) => {
    setDismissed(prev => [...prev, id]);
  }, []);

  if (visibleBanners.length === 0) return null;

  const slidesPerView = isMobile ? 1 : 2;

  return (
    <div className="banner-slider relative w-full">
      <Swiper
        ref={swiperRef}
        modules={[Autoplay]}
        spaceBetween={16}
        slidesPerView={slidesPerView}
        slidesPerGroup={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={visibleBanners.length > slidesPerView}
        speed={800}
        className="w-full"
      >
        {visibleBanners.map((banner) => (
          <SwiperSlide key={banner.id} className="h-auto">
            <BannerCard banner={banner} onDismiss={handleDismiss} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
