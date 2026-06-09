import { useTranslation } from 'react-i18next';
import { useSiteConfig } from '@/context/SiteConfigContext.jsx';
import { ThemeName } from '@/config/enums.js';

/* ── Icons ── */
const MoonIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="size-4 text-[var(--color-foreground-muted-3)]">
    <path d="M9.878 1.967A1.29 1.29 0 0 0 9.641.674 1.21 1.21 0 0 0 8.318.32C3.627 1.969.262 6.439.262 11.696c0 6.658 5.397 12.054 12.054 12.054 5.257 0 9.726-3.364 11.375-8.055a1.21 1.21 0 0 0-.353-1.323c-.33-.288-.82-.41-1.293-.236a9.5 9.5 0 0 1-3.269.578A9.48 9.48 0 0 1 9.3 5.237c0-1.15.204-2.252.579-3.27" className="fill-current stroke-transparent" />
  </svg>
);

const SunIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="size-4 text-[var(--color-foreground-muted-3)]">
    <path fillRule="evenodd" d="M11.573.257a13 13 0 0 1 .854 0c.782.027 1.29.643 1.313 1.386a19 19 0 0 1 0 1.214c-.023.743-.531 1.36-1.313 1.386a13 13 0 0 1-.854 0c-.782-.027-1.29-.643-1.313-1.386a19 19 0 0 1 0-1.214C10.283.9 10.79.283 11.573.257M3.998 3.395c.572-.534 1.368-.458 1.909.05a19 19 0 0 1 .859.86c.508.54.585 1.337.05 1.908a13 13 0 0 1-.603.604c-.571.534-1.367.457-1.908-.051a20 20 0 0 1-.86-.86c-.508-.54-.584-1.336-.05-1.908a13 13 0 0 1 .603-.603m16.004 0c-.572-.534-1.367-.458-1.909.05a20 20 0 0 0-.859.86c-.508.54-.585 1.337-.05 1.908a13 13 0 0 0 .603.604c.572.534 1.367.457 1.909-.051a19 19 0 0 0 .859-.86c.508-.54.585-1.336.05-1.908a13 13 0 0 0-.603-.603M1.642 10.26a19 19 0 0 1 1.215 0c.743.023 1.36.531 1.386 1.313a13 13 0 0 1 0 .854c-.027.782-.643 1.29-1.386 1.313a19 19 0 0 1-1.214 0C.9 13.717.283 13.21.257 12.427a13 13 0 0 1 0-.854c.027-.782.643-1.29 1.386-1.313m20.108-.01q-.33 0-.608.01c-.742.023-1.358.531-1.385 1.313a12 12 0 0 0 0 .854c.027.782.643 1.29 1.385 1.313a19 19 0 0 0 1.216 0c.742-.023 1.358-.531 1.385-1.313a12 12 0 0 0 0-.854c-.027-.782-.643-1.29-1.385-1.313q-.28-.01-.608-.01m-3.963 6.933c.572-.534 1.367-.457 1.909.051a19 19 0 0 1 .859.86c.508.54.585 1.336.05 1.908a13 13 0 0 1-.603.603c-.572.534-1.367.458-1.909-.05a20 20 0 0 1-.859-.86c-.508-.54-.585-1.337-.05-1.908a13 13 0 0 1 .603-.604m-11.574 0c-.571-.534-1.367-.457-1.908.051a20 20 0 0 0-.86.86c-.508.54-.584 1.336-.05 1.908a12 12 0 0 0 .603.603c.572.534 1.368.458 1.909-.05a20 20 0 0 0 .859-.86c.508-.54.585-1.337.05-1.908a13 13 0 0 0-.603-.604m5.36 2.574a12 12 0 0 1 .854 0c.782.027 1.29.643 1.313 1.385a19 19 0 0 1 0 1.216c-.023.742-.531 1.358-1.313 1.385a12 12 0 0 1-.854 0c-.782-.027-1.29-.643-1.313-1.385a19 19 0 0 1 0-1.216c.023-.742.531-1.358 1.313-1.385M6 12a6 6 0 1 1 12 0 6 6 0 0 1-12 0" clipRule="evenodd" className="fill-current stroke-transparent" />
  </svg>
);

/* ── Radio Button ── */
function RadioOption({ icon, label, checked, onChange }) {
  return (
    <label className="flex min-h-6 cursor-pointer items-center gap-3" onClick={onChange}>
      {icon}
      <span className="text-sm font-semibold text-[var(--color-foreground-primary)]">{label}</span>
      <div className="ml-auto">
        <button
          type="button"
          role="radio"
          aria-checked={checked}
          className={`relative aspect-square size-6 rounded-full transition-all duration-150 ${
            checked
              ? 'bg-[var(--color-button-primary)]'
              : 'bg-[var(--color-surface-5)]'
          }`}
        >
          {checked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="size-3 rounded-full bg-white" />
            </div>
          )}
        </button>
      </div>
    </label>
  );
}

/* ── Preferences Page ── */
export function PreferencesPage() {
  const { t } = useTranslation();
  const { themeName, config, setTheme } = useSiteConfig();
  const currentTheme = themeName ?? config?.theme_name;
  const isDark = currentTheme !== ThemeName.LIGHT;

  return (
    <div className="flex w-full flex-col gap-6 sm:gap-8">
      {/* Desktop page header */}
      <nav className="hidden w-full items-center gap-4 sm:flex">
        <div className="flex min-w-0 items-center gap-3 ml-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="size-6 shrink-0 text-[var(--color-control-primary-foreground-active)]">
            <path fillRule="evenodd" d="M9.496.72C9.835.538 10.594.25 12 .25s2.164.288 2.503.47a.87.87 0 0 1 .366.4c.1.211.276.585.466 1.03.281.661.809 1.202 1.447 1.572.639.37 1.365.552 2.08.465a26 26 0 0 1 1.125-.111.87.87 0 0 1 .53.116c.328.202.956.716 1.659 1.933s.833 2.019.845 2.403a.87.87 0 0 1-.165.517 26 26 0 0 1-.66.921c-.432.575-.637 1.297-.637 2.034s.205 1.46.637 2.034c.292.389.529.728.66.921a.87.87 0 0 1 .165.517c-.012.385-.142 1.186-.845 2.403s-1.331 1.731-1.658 1.934a.87.87 0 0 1-.53.116 26 26 0 0 1-1.126-.112c-.715-.086-1.441.096-2.08.466-.638.37-1.166.91-1.447 1.571-.19.446-.365.82-.466 1.03a.87.87 0 0 1-.366.4c-.339.183-1.098.47-2.503.47s-2.165-.287-2.504-.47a.87.87 0 0 1-.366-.4c-.1-.21-.275-.584-.465-1.029-.282-.661-.81-1.202-1.449-1.572-.638-.37-1.365-.552-2.08-.466-.48.059-.89.094-1.123.112a.87.87 0 0 1-.53-.116c-.327-.203-.956-.716-1.659-1.934S.991 15.857.98 15.472a.87.87 0 0 1 .165-.517c.131-.193.367-.53.657-.917.433-.576.639-1.3.639-2.038s-.206-1.462-.639-2.038c-.29-.386-.526-.724-.657-.916a.87.87 0 0 1-.165-.518c.012-.384.142-1.185.845-2.403s1.332-1.73 1.659-1.933a.87.87 0 0 1 .53-.116c.232.018.643.053 1.123.111.715.087 1.441-.096 2.08-.466.64-.37 1.167-.91 1.45-1.572.189-.445.363-.818.464-1.028A.87.87 0 0 1 9.496.72M7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0" clipRule="evenodd" className="fill-current stroke-transparent" />
          </svg>
          <h1 className="text-xl font-bold uppercase text-[var(--color-control-primary-foreground-active)]">
            {t('account.preferences')}
          </h1>
        </div>
      </nav>

      {/* Appearance Section */}
      <fieldset className="flex min-w-0 flex-col gap-2">
        <h3 className="px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-[var(--color-foreground-secondary)]">
          {t('preferences.appearance')}
        </h3>
        <div className="rounded-[20px] bg-[var(--color-surface-1)] sm:bg-[var(--color-surface-2)] flex flex-col gap-4 px-5 py-3.5">
          <RadioOption
            icon={MoonIcon}
            label={t('preferences.dark')}
            checked={isDark}
            onChange={() => setTheme(config?.theme_name ?? ThemeName.DARK)}
          />
          <RadioOption
            icon={SunIcon}
            label={t('preferences.light')}
            checked={!isDark}
            onChange={() => setTheme(ThemeName.LIGHT)}
          />
        </div>
      </fieldset>
    </div>
  );
}

export default PreferencesPage;
