export type UserRole = "candidate" | "recruiter";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyName?: string;
  avatarUrl?: string;
  createdAt: string;
}
