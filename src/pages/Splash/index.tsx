import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AgropecLogo } from '../../components/AgropecLogo';

export function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/explore');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-sm px-4 md:max-w-md lg:max-w-lg">
        <div className="mb-8 flex justify-center sm:mb-12">
          <AgropecLogo className="w-full max-w-[280px] animate-zoom-in md:max-w-[320px] lg:max-w-[400px]" />
        </div>

        <h1
          className="mb-4 animate-fade-in-up text-center text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl"
          style={{ animationDelay: '0.5s', opacity: 0, animationFillMode: 'forwards' }}
        >
          Bem-Vindo(a) a AgroPec
        </h1>
        <p
          className="mx-auto mb-8 animate-fade-in-up text-center text-sm text-gray-300 sm:text-base md:text-lg"
          style={{ animationDelay: '0.8s', opacity: 0, animationFillMode: 'forwards' }}
        >
          Conheça as últimas novidades em agricultura e pecuária no principal evento de Paragominas.
        </p>
      </div>
    </main>
  );
}
