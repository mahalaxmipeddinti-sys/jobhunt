export type EmploymentType = "Full Time" | "Part Time" | "Internship" | "Contract";

export type JobStatus = "Active" | "Closed";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  employmentType: EmploymentType;
  experience: string;
  minSalary?: number;
  maxSalary?: number;
  description: string;
  applicationUrl?: string;
  status: JobStatus;
  postedDate: string;
  recruiterId: string;
  applicantCount?: number;
  department?: string;
}

export interface JobFilters {
  query?: string;
  location?: string;
  employmentType?: EmploymentType | "All";
}

export interface CreateJobInput {
  title: string;
  description: string;
  company: string;
  location: string;
  employmentType: EmploymentType;
  experience: string;
  minSalary?: number;
  maxSalary?: number;
  applicationUrl?: string;
  department?: string;
}

export interface UpdateJobInput extends Partial<CreateJobInput> {
  status?: JobStatus;
}
