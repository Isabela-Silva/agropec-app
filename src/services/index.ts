export { api } from './api';
export { AuthService } from './AuthService';

// Interfaces
export type { IActivity, IActivityResponse, ICreateActivity, IUpdateActivity } from './interfaces/activity';
export type { IAdmin, ICreateAdmin, ILoginInput, IUpdateAdmin } from './interfaces/admin';
export type { ApiError, ApiResponse, AuthResponse } from './interfaces/api';
export type { ICategory, ICategoryResponse, ICreateCategory } from './interfaces/category';
export type { ICompany, ICompanyResponse, ICreateCompany, IUpdateCompany } from './interfaces/company';
export type {
  ICreateNotification,
  INotification,
  INotificationResponse,
  IScheduledNotification,
  IScheduledNotificationResponse,
  IUpdateNotification,
} from './interfaces/notification';
export type { ICreateStand, IStand, IStandResponse, IUpdateStand } from './interfaces/stand';
export type {
  ICreateUser,
  IUpdateUser,
  IUser,
  IUserActivities,
  ILoginInput as IUserLoginInput,
  IUserStands,
} from './interfaces/user';
export type { IUserNotification } from './interfaces/userNotification';
