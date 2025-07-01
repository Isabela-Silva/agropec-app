import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { ICreateHighlight, IHighlightWithDetails, IUpdateHighlight } from '@/services';
import { ActivityService, StandService } from '@/services';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Schema de validação para o formulário de highlight (apenas os campos da API)
const highlightFormSchema = z.object({
  type: z.enum(['activity', 'stand'], {
    errorMap: () => ({ message: "Tipo deve ser 'activity' ou 'stand'" }),
  }),
  referenceId: z.string().min(1, 'Referência é obrigatória'),
});

type HighlightFormData = z.infer<typeof highlightFormSchema>;

interface HighlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  highlight?: IHighlightWithDetails;
  onSubmit: (data: ICreateHighlight | IUpdateHighlight) => void;
  isLoading: boolean;
}

export function HighlightModal({ isOpen, onClose, highlight, onSubmit, isLoading }: HighlightModalProps) {
  const form = useForm<HighlightFormData>({
    resolver: zodResolver(highlightFormSchema),
    defaultValues: {
      type: 'activity',
      referenceId: '',
    },
  });

  const selectedType = form.watch('type');

  // Buscar dados baseado no tipo selecionado
  const { data: activities = [] } = useQuery({
    queryKey: ['activities'],
    queryFn: ActivityService.getAll,
    enabled: selectedType === 'activity',
  });

  const { data: stands = [] } = useQuery({
    queryKey: ['stands'],
    queryFn: StandService.getAll,
    enabled: selectedType === 'stand',
  });

  // Atualiza o formulário quando o highlight muda ou o modal abre
  useEffect(() => {
    if (isOpen) {
      form.reset({
        type: highlight?.type || 'activity',
        referenceId: highlight?.referenceId || '',
      });
    }
  }, [isOpen, highlight, form]);

  // Limpar referenceId quando o tipo mudar
  useEffect(() => {
    form.setValue('referenceId', '');
  }, [selectedType, form]);

  if (!isOpen) return null;

  const handleSubmit = (data: HighlightFormData) => {
    onSubmit(data);
  };

  const getReferenceOptions = () => {
    switch (selectedType) {
      case 'activity':
        return activities.map((item) => ({ value: item.uuid, label: item.name }));
      case 'stand':
        return stands.map((item) => ({ value: item.uuid, label: item.name }));
      default:
        return [];
    }
  };

  const getReferenceLabel = () => {
    switch (selectedType) {
      case 'activity':
        return 'Atividade';
      case 'stand':
        return 'Stand';
      default:
        return 'Referência';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        <div className="relative w-full max-w-md transform rounded-lg bg-white p-6 text-left shadow-xl transition-all">
          <h3 className="mb-6 border-b border-admin-primary-100 pb-3 text-lg font-semibold text-admin-primary-900">
            {highlight ? 'Editar Destaque' : 'Novo Destaque'}
          </h3>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-admin-primary-700">Tipo</FormLabel>
                    <FormControl>
                      <select className="input focus:border-admin-primary-500 focus:ring-admin-primary-500" {...field}>
                        <option value="activity">Atividade</option>
                        <option value="stand">Stand</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="referenceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-admin-primary-700">{getReferenceLabel()}</FormLabel>
                    <FormControl>
                      <select className="input focus:border-admin-primary-500 focus:ring-admin-primary-500" {...field}>
                        <option value="">Selecione {getReferenceLabel().toLowerCase()}...</option>
                        {getReferenceOptions().map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
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
