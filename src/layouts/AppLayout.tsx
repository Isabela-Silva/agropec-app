import { Outlet } from 'react-router-dom';
import BottomNavBar from '../components/BottomNavBar';
import Header from '../components/Header';
import { HeaderSpacer } from '../components/HeaderSpacer';
import { SafeNotificationProvider } from '../components/SafeNotificationProvider';
import { usePageHeader } from '../hooks/usePageHeader';

export function AppLayout() {
  const pageHeader = usePageHeader();

  return (
    <SafeNotificationProvider>
      <div className="min-h-screen bg-base-white-light pb-28">
        {!pageHeader.hasCustomHeader && (
          <>
            <Header />
            <HeaderSpacer />
          </>
        )}
        <Outlet />
        <BottomNavBar />
      </div>
    </SafeNotificationProvider>
  );
}
