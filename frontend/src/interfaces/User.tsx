export interface IUser {
  id: number;
  username?: string;
  firstname?: string;
  lastname?: string;
  lastlogin?: number;
  enabled?: boolean;
}

export interface IServiceProvider {
  id: number;
  username?: string;
  file_1?: string;
  file_2?: string;
  file_3?: string;
  total_score: number;
}