import { delay, ApiError, USE_REAL_BACKEND, apiClient } from "./client";
import { MockStore } from "./mockData";
import { Application, ApplicationStatus } from "../../types";

export const applicationsApi = {
  async getApplicationById(id: string): Promise<Application> {
    if (USE_REAL_BACKEND) {
      return apiClient<Application>(`/api/applications/${id}`);
    }

    await delay(150);
    const applications = MockStore.getApplications();
    const app = applications.find((a) => a.id === id);
    if (!app) {
      throw new ApiError("Application not found", 404);
    }
    return app;
  },

  async updateStatus(id: string, status: ApplicationStatus): Promise<Application> {
    if (USE_REAL_BACKEND) {
      return apiClient<Application>(`/api/applications/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
    }

    await delay(250);
    const applications = MockStore.getApplications();
    const index = applications.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new ApiError("Application not found", 404);
    }

    const updated = { ...applications[index], status };
    applications[index] = updated;
    MockStore.saveApplications(applications);
    return updated;
  },
};
