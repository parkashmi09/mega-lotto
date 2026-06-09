import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { useSiteConfig } from '@/context/SiteConfigContext.jsx';
import { Logo } from '@/components/Logo.jsx';
import { LoginForm } from './LoginForm.jsx';
import { RegisterForm } from './RegisterForm.jsx';

/**
 * Auth modal – Radix Dialog, opens on /login or /signup. Thrill UI: Back, Close, logo, form.
 */
export function AuthModal() {
  const navigate = useNavigate();
  const location = useLocation();
  const { platformName } = useSiteConfig() || {};
  const open = location.pathname === '/login' || location.pathname === '/signup';

  useEffect(() => {
    if (open) document.body.classList.add('modal-open');
    else document.body.classList.remove('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, [open]);

  const handleOpenChange = (next) => {
    if (!next) {
      document.body.classList.remove('modal-open');
      navigate(-1);
    }
  };

  const handleBack = () => {
    document.body.classList.remove('modal-open');
    navigate(-1);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          aria-hidden
        />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-[101] w-[min(420px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[var(--color-background-secondary)] p-6 shadow-xl outline-none focus:outline-none"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={() => handleOpenChange(false)}
          aria-describedby={undefined}
        >
          {/* Header: Back | Logo area | Close */}
          <div className="mb-6 flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1 text-sm font-medium text-[var(--color-foreground-primary)] hover:opacity-90"
              aria-label="Back"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <div className="absolute left-1/2 flex -translate-x-1/2 items-center justify-center">
              <Logo className="w-[84px]" />
            </div>
            <Dialog.Close
              asChild
            >
              <button
                type="button"
                className="flex size-10 items-center justify-center rounded-full text-[var(--color-foreground-primary)] hover:bg-[var(--color-surface-2)]"
                aria-label="Close"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </Dialog.Close>
          </div>

          {location.pathname === '/signup' ? (
            <RegisterForm onSwitchToSignin={() => navigate('/login')} />
          ) : (
            <LoginForm onClose={() => handleOpenChange(false)} onSwitchToSignup={() => navigate('/signup')} />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default AuthModal;
