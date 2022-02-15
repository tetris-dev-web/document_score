export interface IUser {
  id: number;
  username?: string;
  total_score?: number;
  num_document?: number;
  documents: Array<string>;
}

export interface IServiceProvider {
  id: number;
  username?: string;
  files?: Array<Array<string|number>>;
}