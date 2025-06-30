import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { ICategory, ICreateCategory } from '@/services/interfaces/category';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Schema de validação para o formulário de categoria
const categoryFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
});

type CategoryFormData = z.infer<typeof categoryFormSchema>;

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: ICategory;
  onSubmit: (data: ICreateCategory | Partial<ICategory>) => void;
  isLoading: boolean;
}

export function CategoryModal({ isOpen, onClose, category, onSubmit, isLoading }: CategoryModalProps) {
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: '',
    },
  });

  // Atualiza o formulário quando a categoria muda ou o modal abre
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: category?.name || '',
      });
    }
  }, [isOpen, category, form]);

  if (!isOpen) return null;

  const handleSubmit = (data: CategoryFormData) => {
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        <div className="relative w-full max-w-md transform rounded-lg bg-white p-6 text-left shadow-xl transition-all">
          <h3 className="text-admin-primary-900 border-admin-primary-100 mb-6 border-b pb-3 text-lg font-semibold">
            {category ? 'Editar Categoria' : 'Nova Categoria'}
          </h3>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-admin-primary-700 font-medium">Nome da Categoria</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Tecnologia, Pecuária, Agricultura..."
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
