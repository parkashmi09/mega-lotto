import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useScreenSize } from '../hooks';

export function Sidebar({ isOpen, onClose }) {
  const { t } = useTranslation();
  const { isDesktop } = useScreenSize();

  const linkClass = ({ isActive }) =>
    'block rounded px-3 py-2 text-sm font-medium transition-colors ' +
    (isActive
      ? 'bg-[var(--color-surface)] text-[var(--color-primary)]'
      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]');

  const wrapperClass =
    'flex flex-col border-r border-[var(--color-border)] bg-[var(--color-background)] ' +
    (isDesktop
      ? 'w-[var(--bl-left-nav-width-default)] shrink-0'
      : 'fixed inset-y-0 left-0 z-[var(--z-index-left-nav)] w-64 pt-[var(--bl-header-height)] transition-transform ' +
        (isOpen ? 'translate-x-0' : '-translate-x-full'));

  return (
    <>
      {!isDesktop && isOpen && (
        <div
          className="fixed inset-0 z-[calc(var(--z-index-left-nav)-1)] bg-black/40"
          aria-hidden
          onClick={onClose}
        />
      )}
      <aside className={wrapperClass}>
        <nav className="flex flex-col gap-1 p-3" aria-label="Main">
          <NavLink to="/" end className={linkClass} onClick={!isDesktop ? onClose : undefined}>
            {t('app.home')}
          </NavLink>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
