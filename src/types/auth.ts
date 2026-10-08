import { User, UserRole } from "./user";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCandidateCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "candidate";
}

export interface RegisterRecruiterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "recruiter";
  companyName: string;
}

export type RegisterCredentials = RegisterCandidateCredentials | RegisterRecruiterCredentials;

export interface AuthResponse {
  user: User;
  token: string;
}
