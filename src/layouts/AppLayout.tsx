import { Outlet } from 'react-router-dom';
import BottomNavBar from '../components/BottomNavBar';
import { DesktopSidebar } from '../components/DesktopSidebar';
import Header from '../components/Header';
import { SafeNotificationProvider } from '../components/SafeNotificationProvider';
import { usePageHeader } from '../hooks/usePageHeader';

export function AppLayout() {
  const pageHeader = usePageHeader();

  return (
    <SafeNotificationProvider>
      <div className="min-h-screen bg-base-white-light">
        <DesktopSidebar />

        <div className="flex flex-col lg:ml-64">
          {!pageHeader.hasCustomHeader && <Header />}

          <main className={`flex-1 pb-20 lg:pb-8 ${!pageHeader.hasCustomHeader ? 'pt-14 lg:pt-16' : ''}`}>
            <div className="mx-auto max-w-6xl px-4 pt-4 lg:px-8">
              <Outlet />
            </div>
          </main>

          <div className="lg:hidden">
            <BottomNavBar />
          </div>
        </div>
      </div>
    </SafeNotificationProvider>
  );
}
