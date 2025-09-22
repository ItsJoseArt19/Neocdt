export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CDTApplication {
  id: number;
  owner_id: number;
  amount: number;
  term_days: number;
  interest_rate: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  application_date: string;
  approval_date?: string;
  maturity_date?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
  owner?: User;
}

export interface CreateCDTData {
  amount: number;
  term_days: number;
  interest_rate: number;
  notes?: string;
}

export interface UpdateCDTData {
  amount?: number;
  term_days?: number;
  interest_rate?: number;
  status?: string;
  notes?: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  full_name: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface ApiError {
  detail: string;
}