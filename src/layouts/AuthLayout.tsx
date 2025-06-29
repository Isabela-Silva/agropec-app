import { Outlet } from 'react-router-dom';
import { AgropecLogo } from '../components/AgropecLogo';

export function AuthLayout() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-base-white-light p-4 text-base-black md:p-6 lg:p-8">
      <div className="w-full max-w-sm space-y-6 md:max-w-md lg:max-w-lg">
        <div className="flex flex-col items-center">
          <AgropecLogo className="w-full max-w-[280px] md:max-w-[320px]" />
        </div>

        <Outlet />
      </div>
    </main>
  );
}
