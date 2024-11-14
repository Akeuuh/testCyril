



export type Client = {
  id: string;
  nom: string;
  email?: string;
  tel?: string;
  adresse?: string;
  code_postal?: string;
  ville?: string;
  date_creation?: string;
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  datas: T;
  warnings: string[];
}