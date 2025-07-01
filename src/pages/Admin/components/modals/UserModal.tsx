import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { ICreateUser, IUser } from '@/services/interfaces/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Schema de validação para criação de usuário (senha obrigatória)
const createUserFormSchema = z.object({
  firstName: z.string().min(1, 'Nome é obrigatório'),
  lastName: z.string().min(1, 'Sobrenome é obrigatório'),
  email: z.string().email('Email deve ser válido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
});

// Schema de validação para edição de usuário (senha opcional)
const updateUserFormSchema = z.object({
  firstName: z.string().min(1, 'Nome é obrigatório'),
  lastName: z.string().min(1, 'Sobrenome é obrigatório'),
  email: z.string().email('Email deve ser válido'),
  password: z.string().optional(),
});

type CreateUserFormData = z.infer<typeof createUserFormSchema>;
type UpdateUserFormData = z.infer<typeof updateUserFormSchema>;

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: IUser;
  onSubmit: (data: ICreateUser | Partial<IUser>) => void;
  isLoading: boolean;
}

export function UserModal({ isOpen, onClose, user, onSubmit, isLoading }: UserModalProps) {
  const [updatePassword, setUpdatePassword] = useState(false);
  const isEditing = !!user;

  const form = useForm<CreateUserFormData | UpdateUserFormData>({
    resolver: zodResolver(isEditing ? updateUserFormSchema : createUserFormSchema),
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
        password: '',
      });
      setUpdatePassword(false);
    }
  }, [isOpen, user, form]);

  // Atualiza o schema quando o checkbox de senha muda
  useEffect(() => {
    if (isEditing && updatePassword) {
      // Quando está editando e quer atualizar senha, limpa erros
      form.clearErrors();
    } else if (isEditing && !updatePassword) {
      // Quando está editando mas não quer atualizar senha, remove validação
      form.clearErrors('password');
    }
  }, [updatePassword, isEditing, form]);

  if (!isOpen) return null;

  const handleSubmit = (data: CreateUserFormData | UpdateUserFormData) => {
    // Se está editando e não quer atualizar senha, remove password do objeto
    if (isEditing && !updatePassword) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...dataWithoutPassword } = data;
      onSubmit(dataWithoutPassword);
    } else {
      onSubmit(data);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        <div className="relative w-full max-w-md transform rounded-lg bg-white p-6 text-left shadow-xl transition-all">
          <h3 className="mb-6 border-b border-admin-primary-100 pb-3 text-lg font-semibold text-admin-primary-900">
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
                      <FormLabel className="font-medium text-admin-primary-700">Nome</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o nome"
                          className="focus:border-admin-primary-500 focus:ring-admin-primary-500"
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
                      <FormLabel className="font-medium text-admin-primary-700">Sobrenome</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o sobrenome"
                          className="focus:border-admin-primary-500 focus:ring-admin-primary-500"
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
                    <FormLabel className="font-medium text-admin-primary-700">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Digite o email"
                        className="focus:border-admin-primary-500 focus:ring-admin-primary-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Checkbox para atualizar senha - só aparece ao editar */}
              {isEditing && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="updatePassword"
                    checked={updatePassword}
                    onChange={(e) => setUpdatePassword(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-admin-primary-600 focus:ring-admin-primary-500"
                  />
                  <label htmlFor="updatePassword" className="text-sm font-medium text-admin-primary-700">
                    Atualizar senha
                  </label>
                </div>
              )}

              {/* Campo de senha - sempre aparece ao criar, só aparece ao editar se checkbox marcado */}
              {(!isEditing || updatePassword) && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-admin-primary-700">
                        {user ? 'Nova Senha' : 'Senha'}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={user ? 'Digite a nova senha' : 'Digite a senha'}
                          className="focus:border-admin-primary-500 focus:ring-admin-primary-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

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
                  className="bg-admin-primary-600 text-white hover:bg-admin-primary-700"
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
