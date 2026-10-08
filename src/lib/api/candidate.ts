import { delay, ApiError, USE_REAL_BACKEND, apiClient } from "./client";
import { MockStore } from "./mockData";
import { CandidateProfile, Application } from "../../types";

export const candidateApi = {
  async getProfile(): Promise<CandidateProfile> {
    if (USE_REAL_BACKEND) {
      return apiClient<CandidateProfile>("/api/candidate/profile");
    }

    await delay(200);
    const user = MockStore.getCurrentUser();
    if (!user) {
      throw new ApiError("Not authenticated", 401);
    }

    const profiles = MockStore.getCandidateProfiles();
    const profile = profiles[user.id] || {
      id: `cand-prof-${user.id}`,
      userId: user.id,
      name: user.name,
      email: user.email,
      phone: "",
      location: "",
      bio: "",
      experience: "",
    };

    return profile;
  },

  async updateProfile(updates: Partial<CandidateProfile>): Promise<CandidateProfile> {
    if (USE_REAL_BACKEND) {
      return apiClient<CandidateProfile>("/api/candidate/profile", {
        method: "PUT",
        body: JSON.stringify(updates),
      });
    }

    await delay(300);
    const user = MockStore.getCurrentUser();
    if (!user) {
      throw new ApiError("Not authenticated", 401);
    }

    const profiles = MockStore.getCandidateProfiles();
    const existing = profiles[user.id] || {
      id: `cand-prof-${user.id}`,
      userId: user.id,
      name: user.name,
      email: user.email,
      phone: "",
      location: "",
      bio: "",
      experience: "",
    };

    const updated: CandidateProfile = {
      ...existing,
      ...updates,
      userId: user.id,
    };

    profiles[user.id] = updated;
    MockStore.saveCandidateProfiles(profiles);

    // If user name changed, update user object too
    if (updates.name && updates.name !== user.name) {
      const users = MockStore.getUsers().map((u) =>
        u.id === user.id ? { ...u, name: updates.name! } : u
      );
      MockStore.saveUsers(users);
      MockStore.setCurrentUser({ ...user, name: updates.name });
    }

    return updated;
  },

  async getApplications(): Promise<Application[]> {
    if (USE_REAL_BACKEND) {
      return apiClient<Application[]>("/api/candidate/applications");
    }

    await delay(250);
    const user = MockStore.getCurrentUser();
    if (!user) {
      throw new ApiError("Not authenticated", 401);
    }

    const apps = MockStore.getApplications();
    return apps.filter((a) => a.applicantId === user.id);
  },
};
