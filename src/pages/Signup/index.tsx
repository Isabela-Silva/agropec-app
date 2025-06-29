import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as z from 'zod';

import { Button } from '../../components/ui/button/index';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form/index';
import { Input } from '../../components/ui/input';
import { PasswordInput } from '../../components/ui/PasswordInput';
import { AuthService, type ApiError } from '../../services';
import { toastUtils } from '../../utils/toast';

const formSchema = z
  .object({
    firstName: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
    lastName: z.string().min(2, 'Sobrenome deve ter no mínimo 2 caracteres'),
    email: z.string().email('E-mail inválido'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export function SignupScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/explore';
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const loadingToast = toastUtils.loading('Criando conta...');

    try {
      setIsLoading(true);

      const signUpData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      };

      const response = await AuthService.signUp(signUpData);

      localStorage.setItem('auth_token', response.token);

      toastUtils.success('Conta criada com sucesso!', {
        id: loadingToast,
      });

      navigate(from, { replace: true });
    } catch (err: unknown) {
      const apiError = err as ApiError;
      toastUtils.error(
        apiError.response?.data?.error || 'Ocorreu um erro ao criar a conta. Por favor, tente novamente.',
        { id: loadingToast },
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <h2 className="text-center text-xl font-bold sm:text-2xl md:text-3xl lg:text-4xl">Crie sua conta</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-6 sm:space-y-5 md:space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-light sm:text-base">Nome</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite seu nome"
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
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-light sm:text-base">Sobrenome</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite seu sobrenome"
                      className="h-10 bg-white text-sm text-base-black gradient-border focus-visible:ring-0 sm:h-11 sm:text-base md:h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-sm" />
                </FormItem>
              )}
            />
          </div>

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

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-light sm:text-base">Confirme sua senha</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Digite sua senha novamente"
                    className="h-10 bg-white text-sm text-base-black gradient-border focus-visible:ring-0 sm:h-11 sm:text-base md:h-12"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />

          <p className="text-center text-sm font-light text-base-black">
            Já tem uma conta?{' '}
            <Link to="/login" className="font-bold text-base-black underline hover:text-green-200">
              Fazer login
            </Link>
          </p>

          <Button
            type="submit"
            className="mt-4 h-10 w-full bg-green-gradient text-sm sm:h-11 sm:text-base md:h-12"
            disabled={isLoading}
          >
            {isLoading ? 'Criando conta...' : 'Criar conta'}
          </Button>
        </form>
      </Form>
    </>
  );
}
