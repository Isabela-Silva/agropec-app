import { Outlet } from 'react-router-dom';
import { AgropecLogo } from '../components/AgropecLogo';

export function AuthLayout() {
  return (
    <main className="flex min-h-screen w-screen flex-col items-center justify-center bg-base-white-light p-4 text-base-black md:p-6 lg:p-8">
      <div className="w-full max-w-sm space-y-6 md:max-w-md lg:max-w-lg">
        <div className="flex flex-col items-center">
          <AgropecLogo className="mb-6 w-44 sm:mb-8 md:mb-10 lg:w-80" />
        </div>

        <Outlet />
      </div>
    </main>
  );
}
