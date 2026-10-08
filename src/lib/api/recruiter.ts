import { delay, ApiError, USE_REAL_BACKEND, apiClient } from "./client";
import { MockStore } from "./mockData";
import {
  RecruiterProfile,
  Job,
  CreateJobInput,
  UpdateJobInput,
  Application,
  ApplicationStatus,
} from "../../types";

export interface RecruiterDashboardStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  recentApplications: Application[];
}

export const recruiterApi = {
  async getProfile(): Promise<RecruiterProfile> {
    if (USE_REAL_BACKEND) {
      return apiClient<RecruiterProfile>("/api/recruiter/profile");
    }

    await delay(200);
    const user = MockStore.getCurrentUser();
    if (!user) {
      throw new ApiError("Not authenticated", 401);
    }

    const profiles = MockStore.getRecruiterProfiles();
    const profile = profiles[user.id] || {
      id: `rec-prof-${user.id}`,
      userId: user.id,
      name: user.name,
      email: user.email,
      companyName: user.companyName || "Organization",
      companyDescription: "",
      companyLocation: "",
    };

    return profile;
  },

  async updateProfile(updates: Partial<RecruiterProfile>): Promise<RecruiterProfile> {
    if (USE_REAL_BACKEND) {
      return apiClient<RecruiterProfile>("/api/recruiter/profile", {
        method: "PUT",
        body: JSON.stringify(updates),
      });
    }

    await delay(300);
    const user = MockStore.getCurrentUser();
    if (!user) {
      throw new ApiError("Not authenticated", 401);
    }

    const profiles = MockStore.getRecruiterProfiles();
    const existing = profiles[user.id] || {
      id: `rec-prof-${user.id}`,
      userId: user.id,
      name: user.name,
      email: user.email,
      companyName: user.companyName || "Organization",
      companyDescription: "",
      companyLocation: "",
    };

    const updated: RecruiterProfile = {
      ...existing,
      ...updates,
      userId: user.id,
    };

    profiles[user.id] = updated;
    MockStore.saveRecruiterProfiles(profiles);

    // Sync companyName and name with user object
    if (updates.companyName || updates.name) {
      const users = MockStore.getUsers().map((u) =>
        u.id === user.id
          ? {
              ...u,
              name: updates.name ?? u.name,
              companyName: updates.companyName ?? u.companyName,
            }
          : u
      );
      MockStore.saveUsers(users);
      MockStore.setCurrentUser({
        ...user,
        name: updates.name ?? user.name,
        companyName: updates.companyName ?? user.companyName,
      });
    }

    return updated;
  },

  async getMyJobs(): Promise<Job[]> {
    if (USE_REAL_BACKEND) {
      return apiClient<Job[]>("/api/recruiter/jobs");
    }

    await delay(250);
    const user = MockStore.getCurrentUser();
    if (!user) {
      throw new ApiError("Not authenticated", 401);
    }

    const jobs = MockStore.getJobs();
    // Return jobs posted by this recruiter (or all jobs if testing as recruiter)
    return jobs.filter((j) => j.recruiterId === user.id);
  },

  async getJobById(jobId: string): Promise<Job> {
    if (USE_REAL_BACKEND) {
      return apiClient<Job>(`/api/recruiter/jobs/${jobId}`);
    }

    await delay(200);
    const jobs = MockStore.getJobs();
    const job = jobs.find((j) => j.id === jobId);
    if (!job) {
      throw new ApiError("Job not found", 404);
    }
    return job;
  },

  async createJob(input: CreateJobInput): Promise<Job> {
    if (USE_REAL_BACKEND) {
      return apiClient<Job>("/api/recruiter/jobs", {
        method: "POST",
        body: JSON.stringify(input),
      });
    }

    await delay(350);
    const user = MockStore.getCurrentUser();
    if (!user) {
      throw new ApiError("Not authenticated", 401);
    }
    if (user.role !== "recruiter") {
      throw new ApiError("Only recruiter accounts can create jobs", 403);
    }

    const newJob: Job = {
      id: `job-${Date.now()}`,
      title: input.title.trim(),
      company: input.company.trim() || user.companyName || "Organization",
      location: input.location.trim(),
      employmentType: input.employmentType,
      experience: input.experience.trim(),
      minSalary: input.minSalary,
      maxSalary: input.maxSalary,
      description: input.description.trim(),
      applicationUrl: input.applicationUrl?.trim() || undefined,
      department: input.department?.trim() || "General",
      status: "Active",
      postedDate: new Date().toISOString(),
      recruiterId: user.id,
      applicantCount: 0,
    };

    const jobs = MockStore.getJobs();
    MockStore.saveJobs([newJob, ...jobs]);

    return newJob;
  },

  async updateJob(jobId: string, updates: UpdateJobInput): Promise<Job> {
    if (USE_REAL_BACKEND) {
      return apiClient<Job>(`/api/recruiter/jobs/${jobId}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      });
    }

    await delay(300);
    const jobs = MockStore.getJobs();
    const index = jobs.findIndex((j) => j.id === jobId);
    if (index === -1) {
      throw new ApiError("Job not found", 404);
    }

    const updated: Job = {
      ...jobs[index],
      ...updates,
    };

    jobs[index] = updated;
    MockStore.saveJobs(jobs);

    return updated;
  },

  async closeJob(jobId: string): Promise<Job> {
    return this.updateJob(jobId, { status: "Closed" });
  },

  async reopenJob(jobId: string): Promise<Job> {
    return this.updateJob(jobId, { status: "Active" });
  },

  async getJobApplications(jobId: string): Promise<Application[]> {
    if (USE_REAL_BACKEND) {
      return apiClient<Application[]>(`/api/recruiter/jobs/${jobId}/applications`);
    }

    await delay(250);
    const applications = MockStore.getApplications();
    return applications.filter((a) => a.jobId === jobId);
  },

  async updateApplicationStatus(
    applicationId: string,
    status: ApplicationStatus
  ): Promise<Application> {
    if (USE_REAL_BACKEND) {
      return apiClient<Application>(`/api/recruiter/applications/${applicationId}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
    }

    await delay(300);
    const applications = MockStore.getApplications();
    const index = applications.findIndex((a) => a.id === applicationId);
    if (index === -1) {
      throw new ApiError("Application not found", 404);
    }

    const updated: Application = {
      ...applications[index],
      status,
    };

    applications[index] = updated;
    MockStore.saveApplications(applications);

    return updated;
  },

  async getDashboardStats(): Promise<RecruiterDashboardStats> {
    await delay(250);
    const user = MockStore.getCurrentUser();
    const jobs = MockStore.getJobs().filter((j) => j.recruiterId === user?.id);
    const myJobIds = new Set(jobs.map((j) => j.id));

    const allApps = MockStore.getApplications();
    const myApps = allApps.filter((a) => myJobIds.has(a.jobId));

    return {
      totalJobs: jobs.length,
      activeJobs: jobs.filter((j) => j.status === "Active").length,
      totalApplications: myApps.length,
      recentApplications: myApps.slice(0, 5),
    };
  },
};
