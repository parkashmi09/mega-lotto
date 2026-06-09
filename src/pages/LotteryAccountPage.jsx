import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AccountTabs from '../components/lottery/AccountTabs.jsx';
import { MyTicketsPage } from './MyTicketsPage.jsx';
import { MyWinningsPage } from './MyWinningsPage.jsx';
import { LotteryResultsPage } from './LotteryResultsPage.jsx';
import { getMyTickets } from '../services/lottery/lotteryService.js';

const ROUTE_BY_TAB = {
  tickets: '/lottery/my-tickets',
  winnings: '/lottery/my-winnings',
  results: '/lottery/results',
};

/**
 * Account hub — segmented pill tabs (My Tickets / My Winnings / Last Result)
 * over a single page. `initialTab` is set per route; switching a tab keeps the
 * URL in sync so the bottom-nav / profile links land on the right tab.
 */
export function LotteryAccountPage({ initialTab = 'tickets' }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tab, setTab] = useState(initialTab);
  const [ticketCount, setTicketCount] = useState(0);

  useEffect(() => setTab(initialTab), [initialTab]);
  useEffect(() => { setTicketCount(getMyTickets().length); }, [tab]);

  const onChange = (key) => {
    setTab(key);
    if (ROUTE_BY_TAB[key]) navigate(ROUTE_BY_TAB[key], { replace: true });
  };

  const tabs = [
    { key: 'tickets', label: t('lottery.myTickets', 'My Tickets'), count: ticketCount },
    { key: 'winnings', label: t('lottery.myWinnings', 'My Winnings') },
    { key: 'results', label: t('lottery.result', 'Result') },
  ];

  return (
    <div className="space-y-5 py-4">
      <AccountTabs tabs={tabs} active={tab} onChange={onChange} />

      {tab === 'tickets' && <MyTicketsPage embedded />}
      {tab === 'winnings' && <MyWinningsPage embedded />}
      {tab === 'results' && <LotteryResultsPage embedded />}
    </div>
  );
}

export default LotteryAccountPage;
