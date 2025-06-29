import { AgropecLogo } from '@/components/AgropecLogo';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import React, { useState } from 'react';
import { useAdminAuth } from '../../../../hooks/useAdminAuth';
import type { ILoginInput } from '../../../../services/interfaces/admin';

export function LoginForm() {
  const { login } = useAdminAuth();
  const [credentials, setCredentials] = useState<ILoginInput>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(credentials);
    } catch (error) {
      // O erro já é tratado no hook
      console.error('Erro no login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <div className="flex justify-center">
            <AgropecLogo className="w-full max-w-[280px] md:max-w-[320px]" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Acesse o painel administrativo</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Entre com suas credenciais de administrador</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={credentials.email}
                onChange={handleChange}
                className="input mt-1"
                placeholder="admin@agropec.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  className="input pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary flex w-full items-center justify-center space-x-2 px-4 py-3"
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                <span>Entrar</span>
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
