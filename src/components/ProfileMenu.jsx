import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Popover from '@radix-ui/react-popover';
import * as Dialog from '@radix-ui/react-dialog';
import { useTranslation } from 'react-i18next';
import { Ticket, Globe, Trophy } from 'lucide-react';
import { getSocket } from '@/utils';
import { C } from '@/constants';
import { LanguageModal } from './LanguageModal.jsx';
import Cookies from 'js-cookie';

const MENU_ITEMS = [
  {
    label: 'My Tickets',
    to: '/lottery/my-tickets',
    icon: <Ticket className="size-5" />,
  },
  {
    label: 'My Winnings',
    to: '/lottery/my-winnings',
    icon: <Trophy className="size-5" />,
  },
  {
    label: 'Preferences',
    to: '/account/preferences',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="size-5">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          fill="currentColor"
          stroke="transparent"
          d="M9.496.72C9.835.538 10.594.25 12 .25s2.164.288 2.503.47a.87.87 0 0 1 .366.4c.1.211.276.585.466 1.03.281.661.809 1.202 1.447 1.572.639.37 1.365.552 2.08.465a26 26 0 0 1 1.125-.111.87.87 0 0 1 .53.116c.328.202.956.716 1.659 1.933s.833 2.019.845 2.403a.87.87 0 0 1-.165.517 26 26 0 0 1-.66.921c-.432.575-.637 1.297-.637 2.034s.205 1.46.637 2.034c.292.389.529.728.66.921a.87.87 0 0 1 .165.517c-.012.385-.142 1.186-.845 2.403s-1.331 1.731-1.658 1.934a.87.87 0 0 1-.53.116 26 26 0 0 1-1.126-.112c-.715-.086-1.441.096-2.08.466-.638.37-1.166.91-1.447 1.571-.19.446-.365.82-.466 1.03a.87.87 0 0 1-.366.4c-.339.183-1.098.47-2.503.47s-2.165-.287-2.504-.47a.87.87 0 0 1-.366-.4c-.1-.21-.275-.584-.465-1.029-.282-.661-.81-1.202-1.449-1.572-.638-.37-1.365-.552-2.08-.466-.48.059-.89.094-1.123.112a.87.87 0 0 1-.53-.116c-.327-.203-.956-.716-1.659-1.934S.991 15.857.98 15.472a.87.87 0 0 1 .165-.517c.131-.193.367-.53.657-.917.433-.576.639-1.3.639-2.038s-.206-1.462-.639-2.038c-.29-.386-.526-.724-.657-.916a.87.87 0 0 1-.165-.518c.012-.384.142-1.185.845-2.403s1.332-1.73 1.659-1.933a.87.87 0 0 1 .53-.116c.232.018.643.053 1.123.111.715.087 1.441-.096 2.08-.466.64-.37 1.167-.91 1.45-1.572.189-.445.363-.818.464-1.028A.87.87 0 0 1 9.496.72M7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0"
        />
      </svg>
    ),
  },
];

const SUPPORT_ITEMS = [];

const LogOutIcon = (
  <svg viewBox="0 0 24 24" fill="none" className="size-5">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      fill="currentColor"
      stroke="transparent"
      d="M7.307 13.454c-.529.024-1.13.046-1.79.063a39 39 0 0 1-.1 1.868c-.049.616-.642.933-1.154.587a18 18 0 0 1-1.889-1.498C1.44 13.64.866 12.933.521 12.424c-.361-.534-.361-1.2 0-1.733.344-.51.92-1.217 1.853-2.05.79-.705 1.42-1.181 1.889-1.498.512-.346 1.105-.03 1.155.587.037.466.074 1.082.098 1.869 1.425.036 2.57.098 3.314.147.584.038 1.075.432 1.132 1.015q.036.34.038.797-.002.456-.038.797c-.04.414-.3.733-.658.897a1.4 1.4 0 0 1-.474.118c-.4.026-.913.056-1.523.084m2.156 4.579a91 91 0 0 1-.13-3.223 3 3 0 0 1-.405.057 78 78 0 0 1-1.592.087c.033 1.32.082 2.38.131 3.198.105 1.743 1.408 3.163 3.192 3.315a55 55 0 0 0 4.005.177c.185.787.845 1.39 1.671 1.342 1.95-.112 3.897-.868 5.48-1.913a3.4 3.4 0 0 0 .738-.528l.06-.047c.299-.235.517-.548.65-.897a3.6 3.6 0 0 0 .395-1.448c.088-1.46.174-3.69.174-6.8 0-3.671-.12-6.117-.221-7.517-.094-1.31-1.076-2.383-2.418-2.526-1.15-.123-2.991-.252-5.63-.252-2.141 0-3.757.085-4.904.182-1.784.152-3.087 1.572-3.192 3.315a96 96 0 0 0-.14 3.607c.642.028 1.182.06 1.6.087q.2.014.397.055c.032-1.535.086-2.736.14-3.63.047-.796.614-1.377 1.364-1.44 1.088-.093 2.647-.176 4.735-.176q1.146 0 2.083.03c-.79.386-1.527.851-2.176 1.362-.48.378-.751.952-.801 1.56a97 97 0 0 0-.165 13.632 53 53 0 0 1-3.676-.168c-.75-.064-1.317-.645-1.365-1.441m8.59-6.152a1 1 0 1 0-2 0v2.044a1 1 0 1 0 2 0z"
    />
  </svg>
);

function MenuItem({ to, icon, label, onClick, onClose }) {
  if (to) {
    return (
      <Link
        to={to}
        onClick={onClose}
        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg font-semibold text-sm text-[var(--color-foreground-muted-3)] hover:bg-[var(--color-control-primary)] hover:text-[var(--color-foreground-primary)] transition-colors"
      >
        {icon}
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg font-semibold text-sm text-[var(--color-foreground-muted-3)] hover:bg-[var(--color-control-primary)] hover:text-[var(--color-foreground-primary)] transition-colors cursor-pointer"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export function ProfileMenu({ side = 'bottom', align = 'end', trigger }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setOpen(false);
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    const socket = getSocket();
    if (socket) {
      socket.emit(C.LOGOUT_USER);
    }
    Cookies.remove('token');
    Cookies.remove('uid');
    Cookies.remove('session');
    Cookies.remove('auth');
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  const handleClose = () => setOpen(false);

  return (
    <>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          {trigger || (
            <button type="button" className="cursor-pointer" aria-label="Profile menu">
              <img
                src="https://thrill.com/core/img/avatar.webp"
                alt="avatar"
                className="h-8 w-auto cursor-pointer"
              />
            </button>
          )}
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className="z-[var(--z-index-popover-portal)] w-[240px] max-h-[85vh] overflow-y-auto rounded-[var(--radius-lg)] bg-[var(--color-surface-1)] border border-[var(--color-border)] shadow-[0_4px_12px_rgba(0,0,0,0.2),0_1px_3px_rgba(0,0,0,0.1)] outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
            side={side}
            align={align}
            sideOffset={8}
            collisionPadding={12}
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            {/* Main menu items */}
            <div className="p-1.5">
              {MENU_ITEMS.map((item) => (
                <MenuItem
                  key={item.label}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  onClose={handleClose}
                />
              ))}
            </div>

            {/* Separator */}
            <div className="mx-3 border-t border-[var(--color-border)]" />

            {/* Support items + Language switcher */}
            <div className="p-1.5">
              <MenuItem
                icon={<Globe className="size-5" />}
                label={t('app.language', 'Language')}
                onClick={() => { setOpen(false); setLangOpen(true); }}
              />
              {SUPPORT_ITEMS.map((item) => (
                <MenuItem
                  key={item.label}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  onClose={handleClose}
                />
              ))}
            </div>

            {/* Separator */}
            <div className="mx-3 border-t border-[var(--color-border)]" />

            {/* Log Out */}
            <div className="p-1.5">
              <MenuItem
                icon={LogOutIcon}
                label="Log Out"
                onClick={handleLogoutClick}
              />
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {/* Logout Confirmation Modal */}
      <Dialog.Root open={showLogoutModal} onOpenChange={(v) => !v && setShowLogoutModal(false)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[var(--z-index-drawer-portal)] bg-black/60 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[var(--z-index-drawer-portal)] w-[min(380px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-lg)] bg-[var(--color-surface-1)] border border-[var(--color-border)] p-5 shadow-xl outline-none">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-lg font-semibold text-[var(--color-foreground-primary)]">
                Signing Out
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="flex size-8 items-center justify-center rounded-full text-[var(--color-foreground-muted-1)] hover:bg-[var(--color-control-primary)] hover:text-[var(--color-foreground-primary)]"
                  aria-label="Close"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </Dialog.Close>
            </div>
            <p className="text-sm text-[var(--color-foreground-muted-1)] mb-6">
              Are you sure you want to log out? Check our great promotions and bonuses before you leave!
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                className="flex-1 py-2.5 rounded-[var(--radius-md)] text-sm font-semibold bg-[var(--color-control-primary)] text-[var(--color-foreground-primary)] hover:bg-[var(--color-control-primary-active)] transition-colors"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="flex-1 py-2.5 rounded-[var(--radius-md)] text-sm font-semibold bg-[var(--color-button-primary)] text-[var(--color-button-primary-foreground)] hover:opacity-90 transition-opacity"
                onClick={handleLogoutConfirm}
              >
                Sign Out
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Language switcher modal */}
      <LanguageModal open={langOpen} onClose={() => setLangOpen(false)} />
    </>
  );
}

export default ProfileMenu;
