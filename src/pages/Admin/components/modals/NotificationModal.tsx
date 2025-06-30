import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { ICreateNotification, INotificationResponse } from '@/services/interfaces/notification';
import { applyDateMask, applyTimeMask, isValidDate, isValidTime } from '@/utils/inputMasks';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Schema de validação para o formulário de notificação
const notificationFormSchema = z
  .object({
    title: z.string().min(1, 'Título é obrigatório'),
    message: z.string().min(1, 'Mensagem é obrigatória'),
    type: z.enum(['announcement', 'alert', 'system', 'event'], {
      required_error: 'Tipo é obrigatório',
    }),
    date: z.string().optional(),
    time: z.string().optional(),
    targetAudience: z
      .array(z.enum(['all', 'admin', 'exhibitors', 'visitors', 'staff']))
      .min(1, 'Pelo menos uma audiência deve ser selecionada'),
    isScheduled: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.isScheduled) {
        return (
          data.date &&
          data.date.length > 0 &&
          isValidDate(data.date) &&
          data.time &&
          data.time.length > 0 &&
          isValidTime(data.time)
        );
      }
      return true;
    },
    {
      message: 'Data (DD/MM/AAAA) e horário (HH:MM) válidos são obrigatórios para notificações agendadas',
      path: ['date'], // Vai mostrar o erro no campo de data
    },
  );

type NotificationFormData = z.infer<typeof notificationFormSchema>;

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification?: INotificationResponse;
  onSubmit: (data: ICreateNotification | Partial<INotificationResponse>) => void;
  isLoading: boolean;
}

export function NotificationModal({ isOpen, onClose, notification, onSubmit, isLoading }: NotificationModalProps) {
  const form = useForm<NotificationFormData>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      title: '',
      message: '',
      type: 'announcement',
      date: '',
      time: '',
      targetAudience: ['all'],
      isScheduled: false,
    },
  });

  // Observar mudanças no campo isScheduled para mostrar/ocultar data e hora
  const isScheduled = form.watch('isScheduled');

  // Atualiza o formulário quando a notificação muda ou o modal abre
  useEffect(() => {
    if (isOpen) {
      form.reset({
        title: notification?.title || '',
        message: notification?.message || '',
        type: notification?.type || 'announcement',
        date: notification?.date || '',
        time: notification?.time || '',
        targetAudience: notification?.targetAudience || ['all'],
        isScheduled: notification?.isScheduled || false,
      });
    }
  }, [isOpen, notification, form]);

  if (!isOpen) return null;

  const handleSubmit = (data: NotificationFormData) => {
    let formattedData = { ...data };

    // Para notificações agendadas, usar a data e hora fornecidas
    if (data.isScheduled) {
      // Data já está no formato brasileiro, mantém assim
      formattedData = {
        ...formattedData,
        date: data.date || '',
        time: data.time || '',
      };
    } else {
      // Para notificações instantâneas, usar data e hora atuais
      const now = new Date();
      const currentDate = now.toLocaleDateString('pt-BR');
      const currentTime = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      formattedData = {
        ...formattedData,
        date: currentDate,
        time: currentTime,
      };
    }

    onSubmit(formattedData);
  };

  const typeOptions = [
    { value: 'announcement', label: 'Anúncio' },
    { value: 'alert', label: 'Alerta' },
    { value: 'system', label: 'Sistema' },
    { value: 'event', label: 'Evento' },
  ];

  const audienceOptions: Array<{ value: 'all' | 'admin' | 'exhibitors' | 'visitors' | 'staff'; label: string }> = [
    { value: 'all', label: 'Todos' },
    { value: 'admin', label: 'Administradores' },
    { value: 'exhibitors', label: 'Expositores' },
    { value: 'visitors', label: 'Visitantes' },
    { value: 'staff', label: 'Equipe' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        <div className="relative w-full max-w-2xl transform rounded-lg bg-white p-6 text-left shadow-xl transition-all">
          <h3 className="text-admin-primary-900 border-admin-primary-100 mb-6 border-b pb-3 text-lg font-semibold">
            {notification ? 'Editar Notificação' : 'Nova Notificação'}
          </h3>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-admin-primary-700 font-medium">Título</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o título da notificação"
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
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-admin-primary-700 font-medium">Tipo</FormLabel>
                      <FormControl>
                        <select
                          className="focus:ring-admin-primary-500 focus:border-admin-primary-500 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2"
                          {...field}
                        >
                          {typeOptions.map((option) => (
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
              </div>

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-admin-primary-700 font-medium">Mensagem</FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="Digite a mensagem da notificação"
                        className="focus:ring-admin-primary-500 focus:border-admin-primary-500 w-full resize-none rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isScheduled"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="focus:ring-admin-primary-500 text-admin-primary-600 h-4 w-4 rounded border-gray-300"
                        />
                      </FormControl>
                      <FormLabel className="text-admin-primary-700 font-medium">Agendar notificação</FormLabel>
                    </div>
                    <p className="text-sm text-gray-500">
                      {field.value
                        ? 'Defina uma data e hora específicas para envio.'
                        : 'A notificação será enviada imediatamente após criada.'}
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isScheduled && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-admin-primary-700 font-medium">Data (DD/MM/AAAA)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="DD/MM/AAAA"
                            className="focus:ring-admin-primary-500 focus:border-admin-primary-500"
                            maxLength={10}
                            value={field.value}
                            onChange={(e) => {
                              const maskedValue = applyDateMask(e.target.value);
                              field.onChange(maskedValue);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-admin-primary-700 font-medium">Horário (HH:MM)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="HH:MM"
                            className="focus:ring-admin-primary-500 focus:border-admin-primary-500"
                            maxLength={5}
                            value={field.value}
                            onChange={(e) => {
                              const maskedValue = applyTimeMask(e.target.value);
                              field.onChange(maskedValue);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <FormField
                control={form.control}
                name="targetAudience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-admin-primary-700 font-medium">Audiência</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        {audienceOptions.map((option) => (
                          <label key={option.value} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={field.value.includes(option.value)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  field.onChange([...field.value, option.value]);
                                } else {
                                  field.onChange(field.value.filter((v) => v !== option.value));
                                }
                              }}
                              className="focus:ring-admin-primary-500 text-admin-primary-600 h-4 w-4 rounded border-gray-300"
                            />
                            <span className="text-sm text-gray-700">{option.label}</span>
                          </label>
                        ))}
                      </div>
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
