export type ScheduleItemType = 'activity' | 'stand';

export interface BaseScheduleItem {
  type: ScheduleItemType;
  uuid: string;
  name: string;
  description: string;
  date: string;
  categoryId: string;
  companyId: string;
  imageUrls: string[];
}

export interface ActivityScheduleItem extends BaseScheduleItem {
  type: 'activity';
  startTime: string;
  endTime: string;
}

export interface StandScheduleItem extends BaseScheduleItem {
  type: 'stand';
  openingTime: string;
  closingTime: string;
}

export type ScheduleItem = ActivityScheduleItem | StandScheduleItem;

export interface UserScheduleResponse {
  success: boolean;
  message: string;
  data: ScheduleItem[];
}
