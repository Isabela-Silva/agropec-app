import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ActivityService } from '@/services';
import type { IActivityResponse } from '@/services/interfaces/activity';
import type { ICategory } from '@/services/interfaces/category';
import type { ICompanyResponse } from '@/services/interfaces/company';
import { applyDateMask, applyTimeMask } from '@/utils/inputMasks';
import { toastUtils } from '@/utils/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Schema de validação para o formulário
const activityFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  companyId: z.string().min(1, 'Empresa é obrigatória'),
  date: z.string().min(1, 'Data é obrigatória'),
  startTime: z.string().min(1, 'Horário de início é obrigatório'),
  endTime: z.string().min(1, 'Horário de término é obrigatório'),
});

type ActivityFormData = z.infer<typeof activityFormSchema>;

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity?: IActivityResponse;
  isLoading: boolean;
  companies: ICompanyResponse[];
  categories: ICategory[];
  onSuccess?: () => void;
}

export function ActivityModal({
  isOpen,
  onClose,
  activity,
  isLoading: externalLoading,
  companies,
  categories,
  onSuccess,
}: ActivityModalProps) {
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const newImagePreviewsRef = useRef<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setNewImages((prev) => [...prev, ...acceptedFiles]);
    // Cria previews estáveis para as novas imagens
    const newPreviews = acceptedFiles.map((file) => URL.createObjectURL(file));
    setNewImagePreviews((prev) => [...prev, ...newPreviews]);
    newImagePreviewsRef.current = [...newImagePreviewsRef.current, ...newPreviews];
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
    maxSize: 5242880, // 5MB
  });

  const removeExistingImage = (index: number) => {
    setExistingImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    // Libera a URL do preview antes de remover
    if (newImagePreviewsRef.current[index]) {
      URL.revokeObjectURL(newImagePreviewsRef.current[index]);
    }

    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
    newImagePreviewsRef.current = newImagePreviewsRef.current.filter((_, i) => i !== index);
  };

  const form = useForm<ActivityFormData>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      name: '',
      description: '',
      categoryId: '',
      companyId: '',
      date: '',
      startTime: '',
      endTime: '',
    },
  });

  // Atualiza o formulário quando a atividade muda ou o modal abre
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: activity?.name || '',
        description: activity?.description || '',
        categoryId: activity?.categoryId || '',
        companyId: activity?.companyId || '',
        date: activity?.date || '',
        startTime: activity?.startTime || '',
        endTime: activity?.endTime || '',
      });

      // Carrega as imagens existentes
      if (activity?.imageUrls) {
        setExistingImageUrls(activity.imageUrls);
      } else {
        setExistingImageUrls([]);
      }

      // Limpa previews das novas imagens usando ref
      newImagePreviewsRef.current.forEach((url) => URL.revokeObjectURL(url));
      setNewImages([]);
      setNewImagePreviews([]);
      newImagePreviewsRef.current = [];
    }
  }, [isOpen, activity, form]);

  if (!isOpen) return null;

  const handleSubmit = async (data: ActivityFormData) => {
    try {
      setIsSubmitting(true);

      // Verifica se há alterações nos dados básicos
      const hasDataChanges =
        data.name !== activity?.name ||
        data.description !== activity?.description ||
        data.categoryId !== activity?.categoryId ||
        data.companyId !== activity?.companyId ||
        data.date !== activity?.date ||
        data.startTime !== activity?.startTime ||
        data.endTime !== activity?.endTime;

      // Verifica se há alterações nas imagens
      const hasImageChanges = existingImageUrls.length !== (activity?.imageUrls?.length || 0) || newImages.length > 0;

      if (activity) {
        // Atualização - sempre usa FormData pois a API espera multipart
        if (hasImageChanges || hasDataChanges) {
          // Extrai IDs das imagens existentes que ainda estão no preview
          const imageIds = existingImageUrls
            .map((url) => {
              // Extrai o ID da URL (assumindo que o ID está no final da URL)
              const urlParts = url.split('/');
              const filename = urlParts[urlParts.length - 1];
              // Remove a extensão do arquivo para obter apenas o ID
              return filename?.split('.')[0] || '';
            })
            .filter(Boolean); // Remove IDs vazios

          // Sempre usa FormData (a API sempre espera multipart)
          await ActivityService.update(activity.uuid, data, imageIds, newImages.length > 0 ? newImages : undefined);

          toastUtils.success('Atividade atualizada com sucesso!');
        }
      } else {
        // Criação - sempre usa FormData (API espera multipart)
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
          }
        });

        // Adiciona imagens se houver
        if (newImages.length > 0) {
          newImages.forEach((image) => {
            formData.append('images', image);
          });
        }

        await ActivityService.create(formData);
        toastUtils.success('Atividade criada com sucesso!');
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar atividade:', error);
      toastUtils.error('Erro ao salvar atividade. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Combina imagens existentes e novas para o preview
  const allPreviews = [...existingImageUrls, ...newImagePreviews];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        <div className="relative w-full max-w-2xl transform rounded-lg bg-white p-6 text-left shadow-xl transition-all">
          <h3 className="mb-6 border-b border-admin-primary-100 pb-3 text-lg font-semibold text-admin-primary-900">
            {activity ? 'Editar Atividade' : 'Nova Atividade'}
          </h3>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-admin-primary-700">Nome da Atividade</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o nome da atividade"
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
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-admin-primary-700">Categoria</FormLabel>
                      <FormControl>
                        <select
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-admin-primary-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-admin-primary-500"
                          {...field}
                        >
                          <option value="">Selecione uma categoria</option>
                          {categories.map((category) => (
                            <option key={category.uuid} value={category.uuid}>
                              {category.name}
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-admin-primary-700">Descrição</FormLabel>
                    <FormControl>
                      <textarea
                        className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 focus:border-admin-primary-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-admin-primary-500"
                        rows={4}
                        placeholder="Digite a descrição da atividade"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="companyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-admin-primary-700">Empresa</FormLabel>
                      <FormControl>
                        <select
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-admin-primary-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-admin-primary-500"
                          {...field}
                        >
                          <option value="">Selecione uma empresa</option>
                          {companies.map((company) => (
                            <option key={company.uuid} value={company.uuid}>
                              {company.name}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-admin-primary-700">Data</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="DD/MM/AAAA"
                          className="focus:border-admin-primary-500 focus:ring-admin-primary-500"
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
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-admin-primary-700">Horário de Início</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="HH:MM"
                          className="focus:border-admin-primary-500 focus:ring-admin-primary-500"
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

                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-admin-primary-700">Horário de Término</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="HH:MM"
                          className="focus:border-admin-primary-500 focus:ring-admin-primary-500"
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

              {/* Dropzone para imagens */}
              <div className="space-y-2">
                <label className="block font-medium text-admin-primary-700">Imagens</label>
                <div
                  {...getRootProps()}
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors hover:border-gray-400 focus:border-admin-primary-500 focus:ring-admin-primary-500 ${
                    isDragActive ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                >
                  <input {...getInputProps()} />
                  <ImagePlus className="mb-2 h-8 w-8 text-gray-400" />
                  <p className="text-sm text-gray-500">
                    {isDragActive
                      ? 'Solte as imagens aqui...'
                      : 'Arraste e solte imagens aqui, ou clique para selecionar'}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">PNG, JPG ou JPEG até 5MB</p>
                </div>

                {/* Preview das imagens */}
                {allPreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {allPreviews.map((preview, index) => (
                      <div
                        key={`preview-${index}-${preview.substring(preview.length - 20)}`}
                        className="group relative"
                      >
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="h-24 w-full rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (index < existingImageUrls.length) {
                              removeExistingImage(index);
                            } else {
                              removeNewImage(index - existingImageUrls.length);
                            }
                          }}
                          className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={externalLoading || isSubmitting}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={externalLoading || isSubmitting}
                  className="bg-admin-primary-600 text-white hover:bg-admin-primary-700"
                >
                  {externalLoading || isSubmitting ? (
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
