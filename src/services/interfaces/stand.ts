import { z } from "zod";

const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

export const StandSchema = z.object({
  uuid: z.string().uuid(),
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  categoryId: z.string().min(1, "ID da categoria é obrigatório"),
  latitude: z.number().min(-90).max(90, "Latitude deve estar entre -90 e 90"),
  longitude: z
    .number()
    .min(-180)
    .max(180, "Longitude deve estar entre -180 e 180"),
  imageUrl: z.string().url("URL da imagem deve ser uma URL válida").optional(),
  date: z.string(), // Mudando para aceitar qualquer formato de data
  companyId: z.string().min(1, "ID da empresa é obrigatório"),
  openingHours: z.object({
    openingTime: z.string().regex(/^\d{2}:\d{2}$/, {
      message: "Horário de início deve estar no formato HH:MM",
    }),
    closingTime: z.string().regex(/^\d{2}:\d{2}$/, {
      message: "Horário de término deve estar no formato HH:MM",
    }),
  }),
});

// Schema para validação do request multipart/form-data
export const CreateStandRequestSchema = StandSchema.omit({
  uuid: true,
  imageUrl: true,
});

// Schema para criação no banco de dados (após upload da imagem)
export const CreateStandSchema = StandSchema.omit({ uuid: true });

// Schema para atualização - todos os campos são opcionais exceto uuid que é excluído
export const UpdateStandSchema = StandSchema.omit({ uuid: true }).partial();

// Schema para atualização de imagens
export const UpdateStandImagesSchema = z.object({
  imageIds: z
    .array(z.string().uuid("ID da imagem deve ser um UUID válido"))
    .optional(),
});

export type IStand = z.infer<typeof StandSchema>;
export type ICreateStand = z.infer<typeof CreateStandSchema>;
export type ICreateStandRequest = z.infer<typeof CreateStandRequestSchema>;
export type IUpdateStand = z.infer<typeof UpdateStandSchema>;
export type IUpdateStandImages = z.infer<typeof UpdateStandImagesSchema>;

export interface IStandResponse extends IStand {
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
}
