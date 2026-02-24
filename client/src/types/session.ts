/** Matches server Device enum (pc | android | ios) */
export type Device = 'pc' | 'android' | 'ios';

export interface Session {
  id: string;
  multi_user_id: string;
  device_type: Device;
  transfer_usd: number;
  fraud: boolean;
  is_deleted: boolean;
}

export interface PaginatedSessions {
  items: Session[];
  total: number;
  limit: number;
  offset: number;
}

export interface SessionCreate {
  multi_user_id: string;
  device_type: Device;
  transfer_usd: number;
  fraud?: boolean;
  is_deleted?: boolean;
}

export interface SessionUpdate {
  multi_user_id?: string;
  device_type?: Device;
  transfer_usd?: number;
  fraud?: boolean;
  is_deleted?: boolean;
}
