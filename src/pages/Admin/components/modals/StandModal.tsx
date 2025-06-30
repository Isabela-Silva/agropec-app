import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { StandService } from '@/services';
import type { ICategory } from '@/services/interfaces/category';
import type { ICompanyResponse } from '@/services/interfaces/company';
import type { IStandResponse } from '@/services/interfaces/stand';
import { applyDateMask, applyTimeMask } from '@/utils/inputMasks';
import { toastUtils } from '@/utils/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Schema de validação para o formulário
const standFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  companyId: z.string().min(1, 'Empresa é obrigatória'),
  date: z.string().min(1, 'Data é obrigatória'),
  openingTime: z.string().min(1, 'Horário de abertura é obrigatório'),
  closingTime: z.string().min(1, 'Horário de fechamento é obrigatório'),
});

type StandFormData = z.infer<typeof standFormSchema>;

interface StandModalProps {
  isOpen: boolean;
  onClose: () => void;
  stand?: IStandResponse;
  isLoading: boolean;
  companies: ICompanyResponse[];
  categories: ICategory[];
  onSuccess?: () => void;
}

export function StandModal({
  isOpen,
  onClose,
  stand,
  isLoading: externalLoading,
  companies,
  categories,
  onSuccess,
}: StandModalProps) {
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setNewImages((prev) => [...prev, ...acceptedFiles]);
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
    setNewImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      return updated;
    });
  };

  const form = useForm<StandFormData>({
    resolver: zodResolver(standFormSchema),
    defaultValues: {
      name: '',
      description: '',
      categoryId: '',
      companyId: '',
      date: '',
      openingTime: '',
      closingTime: '',
    },
  });

  // Atualiza o formulário quando o stand muda ou o modal abre
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: stand?.name || '',
        description: stand?.description || '',
        categoryId: stand?.categoryId || '',
        companyId: stand?.companyId || '',
        date: stand?.date || '',
        openingTime: stand?.openingTime || '',
        closingTime: stand?.closingTime || '',
      });

      // Carrega as imagens existentes
      if (stand?.imageUrls) {
        setExistingImageUrls(stand.imageUrls);
      } else {
        setExistingImageUrls([]);
      }
      setNewImages([]);
    }
  }, [isOpen, stand, form]);

  if (!isOpen) return null;

  const handleSubmit = async (data: StandFormData) => {
    try {
      setIsSubmitting(true);

      // Verifica se há alterações nos dados básicos
      const hasDataChanges =
        data.name !== stand?.name ||
        data.description !== stand?.description ||
        data.categoryId !== stand?.categoryId ||
        data.companyId !== stand?.companyId ||
        data.date !== stand?.date ||
        data.openingTime !== stand?.openingTime ||
        data.closingTime !== stand?.closingTime;

      // Verifica se há alterações nas imagens
      const hasImageChanges = existingImageUrls.length !== (stand?.imageUrls?.length || 0) || newImages.length > 0;

      if (stand) {
        // Atualização
        if (hasImageChanges) {
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

          // Usa o StandService para atualizar imagens
          await StandService.update(
            stand.uuid,
            {}, // Dados vazios, apenas imagens
            imageIds,
            newImages.length > 0 ? newImages : undefined,
          );
        }

        if (hasDataChanges) {
          // Atualiza apenas os dados básicos
          await StandService.update(stand.uuid, data);
        }

        toastUtils.success('Stand atualizado com sucesso!');
      } else {
        // Criação
        if (newImages.length > 0) {
          // Cria com imagens
          const formData = new FormData();
          Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              formData.append(key, value.toString());
            }
          });
          newImages.forEach((image) => {
            formData.append('images', image);
          });
          await StandService.create(formData);
        } else {
          // Cria sem imagens
          await StandService.create(data);
        }

        toastUtils.success('Stand criado com sucesso!');
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar stand:', error);
      toastUtils.error('Erro ao salvar stand. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Combina imagens existentes e novas para o preview
  const allPreviews = [...existingImageUrls, ...newImages.map((file) => URL.createObjectURL(file))];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        <div className="relative w-full max-w-2xl transform rounded-lg bg-white p-6 text-left shadow-xl transition-all">
          <h3 className="text-admin-primary-900 border-admin-primary-100 mb-6 border-b pb-3 text-lg font-semibold">
            {stand ? 'Editar Stand' : 'Novo Stand'}
          </h3>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-admin-primary-700 font-medium">Nome do Stand</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o nome do stand"
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
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-admin-primary-700 font-medium">Categoria</FormLabel>
                      <FormControl>
                        <select
                          className="focus:ring-admin-primary-500 focus:border-admin-primary-500 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2"
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
                    <FormLabel className="text-admin-primary-700 font-medium">Descrição</FormLabel>
                    <FormControl>
                      <textarea
                        className="focus:ring-admin-primary-500 focus:border-admin-primary-500 w-full resize-none rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2"
                        rows={4}
                        placeholder="Digite a descrição do stand"
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
                      <FormLabel className="text-admin-primary-700 font-medium">Empresa</FormLabel>
                      <FormControl>
                        <select
                          className="focus:ring-admin-primary-500 focus:border-admin-primary-500 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2"
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
                      <FormLabel className="text-admin-primary-700 font-medium">Data</FormLabel>
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
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="openingTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-admin-primary-700 font-medium">Horário de Abertura</FormLabel>
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

                <FormField
                  control={form.control}
                  name="closingTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-admin-primary-700 font-medium">Horário de Fechamento</FormLabel>
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

              {/* Dropzone para imagens */}
              <div className="space-y-2">
                <label className="text-admin-primary-700 block font-medium">Imagens</label>
                <div
                  {...getRootProps()}
                  className={`focus:ring-admin-primary-500 focus:border-admin-primary-500 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors hover:border-gray-400 ${
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
                      <div key={preview} className="group relative">
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
                  className="bg-admin-primary-600 hover:bg-admin-primary-700 text-white"
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
