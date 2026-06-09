import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSiteConfig } from '../context/SiteConfigContext.jsx';
import { Logo } from './Logo.jsx';

/* Decorative corner SVG – mobile */
function CornerSvgMobile() {
  return (
    <svg
      className="fill-background-secondary sm:hidden"
      width="145"
      height="96"
      viewBox="0 0 145 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M-4.19629e-06 0L0 96L145 96L145 94C145 77.4315 131.569 64 115 64L62 64C45.4315 64 32 50.5685 32 34L32 30C32 13.4315 18.5685 -8.11657e-07 2 -8.74228e-08L-4.19629e-06 0Z" />
    </svg>
  );
}

/* Decorative corner SVG – desktop */
function CornerSvgDesktop() {
  return (
    <svg
      className="fill-background-secondary max-sm:hidden"
      width="163"
      height="102"
      viewBox="0 0 163 102"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M-4.45856e-06 0L0 102L163 102L163 100C163 83.4315 149.569 70 133 70L62 70C45.4315 70 32 56.5685 32 40L32 30C32 13.4315 18.5685 -8.11657e-07 2 -8.74228e-08L-4.45856e-06 0Z" />
    </svg>
  );
}

export function Footer() {
  const { t } = useTranslation();
  const { config } = useSiteConfig();
  return (
    <footer
      data-testid="footer"
      className="mx-auto mt-[56px] mb-[100px] w-full max-w-[var(--bl-content-max-width)] px-[var(--bl-content-padding)] sm:mb-[40px]"
    >
      <div className="flex flex-col items-center justify-start gap-[48px]">
        <div className="bg-background-secondary rounded-32 relative flex w-full flex-col local-z-stack">
          {/* Top-right decoration + logo */}
          <div className="bg-background-primary absolute top-0 right-0">
            <CornerSvgMobile />
            <CornerSvgDesktop />
            <Logo className="absolute top-[14px] right-[24px] w-[78px] sm:w-[96px]" />
          </div>

          {/* About Mega Lotto */}
          <div className="flex w-full flex-col items-start gap-[20px] px-[40px] pb-[48px] pt-[80px] pr-[40px] sm:pt-[48px] sm:pr-[64px] lg:pr-[134px] local-z-1">
            <p className="typ-paragraph-large lg:typ-label-medium text-foreground-tertiary max-w-[760px] leading-relaxed">
              Mega Lotto is a next-generation online lottery platform where players from around the world join the biggest global draws — Powerball, Mega Loot, EuroJackpot and daily games. Pick your lucky numbers, buy tickets in seconds, and follow live draw countdowns and instant results, all in one place. Built on fairness, transparency and responsible play, with secure payments and round-the-clock support, Mega Lotto keeps playing simple, safe and fun. Whether you are chasing a life-changing jackpot or simply love the thrill of the draw, your next big win could be just one ticket away.
            </p>
          </div>
        </div>

        {/* How can we help + Contact + Socials */}
        <div className="lg:border-surface-1 flex w-full flex-col items-center justify-start gap-[48px] px-[16px] lg:flex-row lg:justify-between lg:border-t-1 lg:border-b-1 lg:px-[24px] lg:py-[48px]">
          <div className="flex flex-col items-center justify-start gap-[32px] lg:flex-row lg:gap-[16px]">
            <div className="typ-display-xsmall lg:typ-display-small text-foreground-primary font-bold uppercase">
              {t('footer.howCanWeHelp', 'How can we help?')}
            </div>
            <a
              href={`mailto:${config?.site_email_address || 'support@thrill.com'}`}
              className="tActionButton tActionButton--with-text tActionButton--primary tActionButton--small min-w-max grid grid-cols-1 grid-rows-1 place-items-center focusable cursor-pointer int-hover-scale"
              aria-label={t('footer.contactUs', 'Contact Us')}
            >
              <span className="tActionButton__container rounded-40 col-start-1 col-end-2 row-start-1 row-end-2 flex items-center justify-center w-full">
                <span className="tActionButton__content flex items-center justify-center">
                  <span className="tActionButton__text whitespace-nowrap uppercase">
                    {t('footer.contactUs', 'Contact Us')}
                  </span>
                </span>
              </span>
            </a>
          </div>
          <div className="footer-social-links max-lg:border-b-surface-1 flex items-center justify-center gap-[16px] max-lg:w-full max-lg:border-b-1 max-lg:pb-[48px]">
            <a
              href="https://t.me/Thrillcom"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
              className="tActionButton tActionButton--icon-only tActionButton--secondary tActionButton--medium min-w-max grid grid-cols-1 grid-rows-1 place-items-center focusable cursor-pointer int-hover-scale-plus"
            >
              <span className="tActionButton__container rounded-64 aspect-square col-start-1 col-end-2 row-start-1 row-end-2 flex items-center justify-center w-full">
                <span className="tActionButton__content flex items-center justify-center">
                  <TelegramIcon />
                </span>
              </span>
            </a>
            <a
              href="https://discord.gg/thrillcom"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
              className="tActionButton tActionButton--icon-only tActionButton--secondary tActionButton--medium min-w-max grid grid-cols-1 grid-rows-1 place-items-center focusable cursor-pointer int-hover-scale-plus"
            >
              <span className="tActionButton__container rounded-64 aspect-square col-start-1 col-end-2 row-start-1 row-end-2 flex items-center justify-center w-full">
                <span className="tActionButton__content flex items-center justify-center">
                  <DiscordIcon />
                </span>
              </span>
            </a>
            <a
              href="https://www.instagram.com/thrill_com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="tActionButton tActionButton--icon-only tActionButton--secondary tActionButton--medium min-w-max grid grid-cols-1 grid-rows-1 place-items-center focusable cursor-pointer int-hover-scale-plus"
            >
              <span className="tActionButton__container rounded-64 aspect-square col-start-1 col-end-2 row-start-1 row-end-2 flex items-center justify-center w-full">
                <span className="tActionButton__content flex items-center justify-center">
                  <InstagramIcon />
                </span>
              </span>
            </a>
            <a
              href="https://x.com/Thrill_com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className="tActionButton tActionButton--icon-only tActionButton--secondary tActionButton--medium min-w-max grid grid-cols-1 grid-rows-1 place-items-center focusable cursor-pointer int-hover-scale-plus"
            >
              <span className="tActionButton__container rounded-64 aspect-square col-start-1 col-end-2 row-start-1 row-end-2 flex items-center justify-center w-full">
                <span className="tActionButton__content flex items-center justify-center">
                  <XIcon />
                </span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function PaymentIcon({ title }) {
  return (
    <div
      className="bg-[var(--color-control-secondary)] flex h-7 w-7 shrink-0 items-center justify-center rounded-full lg:h-6 lg:w-6"
      title={title}
      aria-hidden
    >
      <span className="text-foreground-muted-1 max-w-full truncate px-0.5 text-[10px] font-bold uppercase">
        {title.slice(0, 2)}
      </span>
    </div>
  );
}

function TelegramIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width="24"
      height="24"
      className="tActionButton__icon fill-current stroke-transparent"
    >
      <path
        fillRule="evenodd"
        d="M22.497 1.943C22.534 1.25 21.966.664 21.25.76c-2.626.354-6.82 1.889-10.836 3.646C6.39 6.166 2.508 8.168.496 9.474c-.379.246-.54.638-.486 1.018.053.375.31.716.713.886l5.788 2.444a.75.75 0 0 0 .76-.106l.306-.245c1.944-1.555 4.538-3.631 6.696-5.27 1.08-.82 2.046-1.528 2.765-2.005.333-.222.607-.39.812-.496q-.06.1-.144.23c-.25.375-.645.888-1.146 1.5-1 1.22-2.396 2.81-3.83 4.441v.001a331 331 0 0 0-2.97 3.41.75.75 0 0 0 .044 1.019l6.71 6.609c.24.236.556.36.864.338a.94.94 0 0 0 .776-.513c.477-.91.968-2.338 1.438-4.034.473-1.7.93-3.688 1.336-5.727.814-4.076 1.43-8.376 1.57-11.03"
        clipRule="evenodd"
      />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width="24"
      height="24"
      className="tActionButton__icon fill-current stroke-transparent"
    >
      <path
        fillRule="evenodd"
        d="M8.627 2.756c.33-.01.62.203.72.509l.28.844c.043.129.192.219.349.19.43-.082 1.122-.176 2.031-.176.904 0 1.588.093 2.015.174.159.03.309-.06.352-.19l.278-.842c.101-.305.39-.52.722-.507 1.818.072 3.644.647 4.421.92.307.11.572.311.751.59.801 1.25 3.29 5.733 3.202 13.056-.006.44-.185.872-.541 1.161-.746.605-2.417 1.764-5.1 2.589-.434.134-.938.012-1.215-.394-.367-.538-.687-1.222-.903-1.733a.283.283 0 0 0-.342-.157c-.935.278-2.14.49-3.64.49-1.505 0-2.715-.214-3.653-.493a.283.283 0 0 0-.342.157c-.216.512-.537 1.197-.904 1.736-.277.406-.78.528-1.216.394C3.21 20.249 1.54 19.09.793 18.485a1.5 1.5 0 0 1-.54-1.16C.162 9.94 2.693 5.444 3.472 4.237c.167-.258.407-.448.69-.557.726-.277 2.464-.859 4.464-.925M10 12.5c0 1.38-1.007 2.5-2.25 2.5S5.5 13.88 5.5 12.5 6.507 10 7.75 10 10 11.12 10 12.5m4 0c0 1.38 1.007 2.5 2.25 2.5s2.25-1.12 2.25-2.5-1.007-2.5-2.25-2.5S14 11.12 14 12.5"
        clipRule="evenodd"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width="24"
      height="24"
      className="tActionButton__icon fill-current stroke-transparent"
    >
      <path
        fillRule="evenodd"
        d="M6.229.882C7.728.807 9.639.75 12 .75s4.272.057 5.772.132c2.945.148 5.198 2.402 5.346 5.347.075 1.499.132 3.41.132 5.771s-.057 4.272-.132 5.772c-.148 2.945-2.401 5.198-5.346 5.346-1.5.075-3.41.132-5.772.132s-4.272-.057-5.771-.132C3.284 22.97 1.03 20.717.882 17.772.807 16.272.75 14.362.75 12s.057-4.272.132-5.771C1.03 3.283 3.284 1.03 6.23.882M17.5 5a1 1 0 0 1 1-1h.5a1 1 0 1 1 0 2h-.5a1 1 0 0 1-1-1M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8m-6 4a6 6 0 1 1 12 0 6 6 0 0 1-12 0"
        clipRule="evenodd"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width="24"
      height="24"
      className="tActionButton__icon fill-current stroke-transparent"
    >
      <path
        fillRule="evenodd"
        d="M7.061 1.977a25 25 0 0 0-2.358-.042c-1.395.043-2.1 1.606-1.347 2.702 2.162 3.15 3.955 5.69 5.746 8.095l-6.388 7.097A1.25 1.25 0 1 0 4.573 21.5l6.065-6.74c1.54 2 3.153 3.999 5.061 6.28a2.68 2.68 0 0 0 1.811.956c.898.08 1.65.098 2.488.058 1.386-.067 2.035-1.62 1.305-2.689-2.522-3.69-4.538-6.56-6.526-9.203l5.436-6.04a1.25 1.25 0 0 0-1.859-1.672l-5.123 5.693a146 146 0 0 0-4.29-5.227 2.7 2.7 0 0 0-1.88-.94"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default Footer;
