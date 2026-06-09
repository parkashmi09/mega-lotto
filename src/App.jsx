import { Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSiteConfig } from './context/SiteConfigContext.jsx';
import { AppLayout } from './layouts/AppLayout.jsx';
import { AccountLayout } from './layouts/AccountLayout.jsx';
import { ImplementationPage } from './pages/ImplementationPage.jsx';
import './App.css';
import HomePage from './pages/HomePage.jsx';
import { CasinoPage } from './pages/CasinoPage.jsx';
import { WalletPage } from './pages/WalletPage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';
import { AccountDetailsPage } from './pages/AccountDetailsPage.jsx';
import { PreferencesPage } from './pages/PreferencesPage.jsx';
import { SportsPage } from './pages/SportsPage.jsx';
import { KenoPage } from './pages/games/KenoPage.jsx';
import { LotteryPage } from './pages/LotteryPage.jsx';
import { LotteryPlayPage } from './pages/LotteryPlayPage.jsx';
import { LotteryAccountPage } from './pages/LotteryAccountPage.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';

function App() {
  const { t } = useTranslation();
  const { loading, error, isCasinoActive, isLotteryActive, config } = useSiteConfig();
  const hasSports = (config?.active_sports || []).length > 0;
  const defaultRoute = isLotteryActive ? '/lottery' : isCasinoActive ? '/casino' : hasSports ? '/sports' : '/lottery';

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)]">
        <p className="text-[var(--color-text-secondary)]">{t('common.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)]">
        <p className="text-[var(--color-danger)]">{t('common.error')}</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to={defaultRoute} replace />} />
        {/* /login & /signup keep the URL so AuthModal overlays the lottery page */}
        <Route path="login" element={isLotteryActive ? <LotteryPage /> : <Navigate to={defaultRoute} replace />} />
        <Route path="signup" element={isLotteryActive ? <LotteryPage /> : <Navigate to={defaultRoute} replace />} />
        {/* Lottery routes */}
        <Route path="lottery" element={isLotteryActive ? <LotteryPage /> : <Navigate to={defaultRoute} replace />} />
        <Route path="lottery/play/:lotteryId" element={isLotteryActive ? <ProtectedRoute><LotteryPlayPage /></ProtectedRoute> : <Navigate to={defaultRoute} replace />} />
        <Route path="lottery/results" element={isLotteryActive ? <LotteryAccountPage initialTab="results" /> : <Navigate to={defaultRoute} replace />} />
        <Route path="lottery/my-tickets" element={isLotteryActive ? <LotteryAccountPage initialTab="tickets" /> : <Navigate to={defaultRoute} replace />} />
        <Route path="lottery/my-winnings" element={isLotteryActive ? <LotteryAccountPage initialTab="winnings" /> : <Navigate to={defaultRoute} replace />} />
        {/* Casino routes – redirect to default if casino disabled */}
        <Route path="casino" element={isCasinoActive ? <CasinoPage /> : <Navigate to={defaultRoute} replace />} />
        <Route path="casino/:category" element={isCasinoActive ? <CasinoPage /> : <Navigate to={defaultRoute} replace />} />
        <Route path="casino/play/thrill-keno" element={<KenoPage />} />
        {/* Sports routes – redirect to casino if sports disabled */}
        <Route path="sports" element={hasSports ? <SportsPage /> : <Navigate to={defaultRoute} replace />} />
        <Route path="sports/:sport" element={hasSports ? <SportsPage /> : <Navigate to={defaultRoute} replace />} />
        <Route path="rewards" element={<Navigate to={defaultRoute} replace />} />
        <Route path="support" element={<ImplementationPage />} />
        <Route path="account" element={<AccountLayout />}>
          <Route index element={<Navigate to="/account/profile" replace />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="details" element={<AccountDetailsPage />} />
          <Route path="preferences" element={<PreferencesPage />} />
          <Route path="security" element={<ImplementationPage />} />
          <Route path="verification" element={<ImplementationPage />} />
          <Route path="transactions" element={<ImplementationPage />} />
        </Route>
        <Route path="affiliate" element={<ImplementationPage />} />
        <Route path="thrill-control" element={<ImplementationPage />} />
        <Route path="help" element={<ImplementationPage />} />
        <Route path="wallet" element={<WalletPage />} />
      </Route>
    </Routes>
  );
}

export default App;
