import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header.jsx';
import { LeftNav } from '../components/LeftNav.jsx';
import { Footer } from '../components/Footer.jsx';
import { BottomNav } from '../components/BottomNav.jsx';
import { AuthModal } from '../components/auth/AuthModal.jsx';
import { MobileMenuDrawer } from '../components/MobileMenuDrawer.jsx';
import { LeftNavProvider, useLeftNav } from '../context/LeftNavContext.jsx';
import { MobileMenuProvider } from '../context/MobileMenuContext.jsx';
import { useSmoothScroll } from '../hooks/index.js';

function AppLayoutInner() {
  const { expanded } = useLeftNav();
  useSmoothScroll();

  // LeftNav is hidden below xl (see LeftNav: hidden xl:grid)
  // Collapsed = 100px + 12px padding = 112px; Expanded = 300px + 12px = 312px
  const navMargin = expanded
    ? 'xl:ml-[312px]'
    : 'xl:ml-[112px]';

  return (
    <>
      {/* Main content wrapper */}
      <div
        className={`
          min-h-dvh pt-[var(--bl-header-height)]
          mr-[var(--bl-right-panel-offset-x)]
          ${navMargin}
          [transition-property:margin-left,margin-right]
          duration-300 ease-in-out
          max-sm:pb-[var(--bl-bottom-nav-offset-y)]
        `}
      >
        <Header />
        <AuthModal />
        <main className="z-[var(--z-index-content)] mx-auto w-full max-w-[var(--bl-content-max-width)] px-[var(--bl-content-padding)] [container-type:inline-size] [container-name:page-content]">
          <Outlet />
        </main>
        <Footer />
      </div>

      {/* Left nav overlay (tablet) */}
      <div
        className="z-[var(--z-index-left-nav-overlay)] fixed top-0 left-0 h-dvh w-dvw max-sm:hidden lg:hidden pointer-events-none opacity-0 transition-opacity duration-300 ease-in-out gradient-menu-overlay"
        aria-hidden
      />
      <LeftNav />
      <BottomNav />
      <MobileMenuDrawer />
    </>
  );
}

export function AppLayout() {
  return (
    <LeftNavProvider>
      <MobileMenuProvider>
        <AppLayoutInner />
      </MobileMenuProvider>
    </LeftNavProvider>
  );
}

export default AppLayout;
