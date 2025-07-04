import { z } from 'zod';
export const UserRoleSchema = z.enum(['SUPER_ADMIN', 'admin', 'staff', 'user']);
export type UserRole = z.infer<typeof UserRoleSchema>;

export type IUser = z.infer<typeof UserSchema>;
export type ICreateUser = z.infer<typeof CreateUserSchema>;
export type IUpdateUser = z.infer<typeof UpdateUserSchema>;
export type IUserActivities = z.infer<typeof UserActivitiesSchema>;
export type IUserStands = z.infer<typeof UserStandsSchema>;
export type ILoginInput = z.infer<typeof LoginSchema>;

export const UserSchema = z.object({
  uuid: z.string().uuid(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  activitiesId: z.array(z.string().uuid()).optional(),
  standsId: z.array(z.string().uuid()).optional(),
  role: UserRoleSchema.default('user'),
});

export const CreateUserSchema = UserSchema.omit({
  uuid: true,
  role: true,
  activitiesId: true,
  standsId: true,
});

export const UpdateUserSchema = z.object({
  uuid: z.string().uuid(),
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  email: z.string().email('Invalid email address').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters long').optional(),
});

export const UserActivitiesSchema = z.object({
  activitiesId: z.array(z.string().uuid()),
});

export const UserStandsSchema = z.object({
  standsId: z.array(z.string().uuid()),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password cannot be empty'),
});

// Interface para respostas da API que incluem timestamps
export interface IUserResponse extends Omit<IUser, 'password'> {
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
}
