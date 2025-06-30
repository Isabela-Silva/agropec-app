import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn, Shield } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import * as z from 'zod';
import { Button } from '../../components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { PasswordInput } from '../../components/ui/PasswordInput';
import { useUserAuth } from '../../hooks/useUserAuth';
import { toastUtils } from '../../utils/toast';

const formSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

export function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useUserAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const loadingToast = toastUtils.loading('Entrando...');

    try {
      setIsLoading(true);

      await login(values);

      toastUtils.success('Login realizado com sucesso!', {
        id: loadingToast,
      });

      // O redirecionamento já é feito automaticamente pelo hook useUserAuth
    } catch (err: unknown) {
      const error = err as Error;
      toastUtils.error(error.message || 'Ocorreu um erro ao fazer login. Por favor, tente novamente.', {
        id: loadingToast,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <h2 className="text-center text-xl font-bold sm:text-2xl md:text-3xl lg:text-4xl">Entre na sua conta</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-6 sm:space-y-5 md:space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-light sm:text-base">E-mail</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Digite seu e-mail"
                    className="h-10 bg-white text-sm text-base-black gradient-border focus-visible:ring-0 sm:h-11 sm:text-base md:h-12"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-light sm:text-base">Senha</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Digite sua senha"
                    className="h-10 bg-white text-sm text-base-black gradient-border focus-visible:ring-0 sm:h-11 sm:text-base md:h-12"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="mt-4 h-10 w-full bg-green-gradient text-sm sm:h-11 sm:text-base md:h-12"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                <span>Entrar</span>
              </>
            )}
          </Button>
        </form>
      </Form>

      <div className="mt-6 flex flex-col items-center gap-4">
        <p className="text-sm text-base-black">
          Não tem uma conta?{' '}
          <Link to="/signup" className="text-sm text-base-black hover:text-green-200">
            <span className="font-bold underline">Cadastre-se</span>
          </Link>
        </p>

        <hr className="w-full border-base-gray-light" />

        <Link
          to="/admin/login"
          className="group inline-flex items-center gap-2 rounded-lg bg-base-white-light px-4 py-2 text-sm font-medium text-base-black transition-colors hover:bg-green-100"
        >
          <Shield className="h-5 w-5 text-base-gray transition-colors group-hover:text-green-300" />
          Acesso Administrativo
        </Link>
      </div>
    </>
  );
}
