import { api } from './api';
import { ScheduleItem, UserScheduleResponse } from './interfaces/schedule';
import { IUser } from './interfaces/user';
import { UserService } from './UserService';

export class ScheduleService {
  static async getSchedule(): Promise<ScheduleItem[]> {
    const response = await api.get<ScheduleItem[]>('/schedule');
    return response.data;
  }

  static async getUserSchedule(uuid: string): Promise<ScheduleItem[]> {
    const response = await api.get<UserScheduleResponse>(`/schedule/user/${uuid}`);
    return response.data.data;
  }

  static async addToUserSchedule(userUuid: string, item: ScheduleItem): Promise<IUser> {
    if (item.type === 'activity') {
      return UserService.updateActivities(userUuid, [item.uuid]);
    } else {
      return UserService.updateStands(userUuid, [item.uuid]);
    }
  }

  static async removeFromUserSchedule(userUuid: string, item: ScheduleItem): Promise<IUser> {
    if (item.type === 'activity') {
      return UserService.removeActivities(userUuid, [item.uuid]);
    } else {
      return UserService.removeStands(userUuid, [item.uuid]);
    }
  }
}
