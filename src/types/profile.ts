export interface CandidateProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  experience: string;
  education?: string;
  skills?: string[];
}

export interface RecruiterProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  companyName: string;
  companyDescription: string;
  companyLocation: string;
  website?: string;
  companySize?: string;
}
