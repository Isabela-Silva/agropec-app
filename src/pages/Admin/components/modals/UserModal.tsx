import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { ICreateUser, IUser } from '@/services/interfaces/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Schema de validação para o formulário de usuário
const userFormSchema = z.object({
  firstName: z.string().min(1, 'Nome é obrigatório'),
  lastName: z.string().min(1, 'Sobrenome é obrigatório'),
  email: z.string().email('Email deve ser válido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
});

type UserFormData = z.infer<typeof userFormSchema>;

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: IUser;
  onSubmit: (data: ICreateUser | Partial<IUser>) => void;
  isLoading: boolean;
}

export function UserModal({ isOpen, onClose, user, onSubmit, isLoading }: UserModalProps) {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  // Atualiza o formulário quando o usuário muda ou o modal abre
  useEffect(() => {
    if (isOpen) {
      form.reset({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        password: '', // Sempre vazio para forçar o usuário a definir nova senha
      });
    }
  }, [isOpen, user, form]);

  if (!isOpen) return null;

  const handleSubmit = (data: UserFormData) => {
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        <div className="relative w-full max-w-md transform rounded-lg bg-white p-6 text-left shadow-xl transition-all">
          <h3 className="text-admin-primary-900 border-admin-primary-100 mb-6 border-b pb-3 text-lg font-semibold">
            {user ? 'Editar Usuário' : 'Novo Usuário'}
          </h3>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-admin-primary-700 font-medium">Nome</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o nome"
                          className="focus:ring-admin-primary-500 focus:border-admin-primary-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-admin-primary-700 font-medium">Sobrenome</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o sobrenome"
                          className="focus:ring-admin-primary-500 focus:border-admin-primary-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-admin-primary-700 font-medium">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Digite o email"
                        className="focus:ring-admin-primary-500 focus:border-admin-primary-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-admin-primary-700 font-medium">
                      {user ? 'Nova Senha' : 'Senha'}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={user ? 'Digite a nova senha' : 'Digite a senha'}
                        className="focus:ring-admin-primary-500 focus:border-admin-primary-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-admin-primary-600 hover:bg-admin-primary-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
