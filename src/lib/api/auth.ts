import { delay, ApiError, USE_REAL_BACKEND, apiClient } from "./client";
import { MockStore } from "./mockData";
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "../../types";

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (USE_REAL_BACKEND) {
      return apiClient<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
    }

    await delay(300);
    const users = MockStore.getUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === credentials.email.trim().toLowerCase()
    );

    if (!user) {
      throw new ApiError("No account found with this email address. Please check your spelling or register.", 401);
    }

    if (credentials.password.length < 6) {
      throw new ApiError("Password must be at least 6 characters long.", 400);
    }

    const token = `jwt_mock_${user.id}_${Date.now()}`;
    MockStore.setCurrentUser(user, token);

    return { user, token };
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    if (USE_REAL_BACKEND) {
      return apiClient<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
    }

    await delay(350);
    const users = MockStore.getUsers();
    const existing = users.find(
      (u) => u.email.toLowerCase() === credentials.email.trim().toLowerCase()
    );

    if (existing) {
      throw new ApiError("An account with this email address already exists.", 409);
    }

    if (credentials.password !== credentials.confirmPassword) {
      throw new ApiError("Passwords do not match.", 400);
    }

    const company =
      credentials.role === "recruiter" ? credentials.companyName : undefined;

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: credentials.name.trim(),
      email: credentials.email.trim().toLowerCase(),
      role: credentials.role,
      companyName: company,
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    MockStore.saveUsers(updatedUsers);

    // Initialize blank candidate or recruiter profile
    if (credentials.role === "candidate") {
      const cProfiles = MockStore.getCandidateProfiles();
      cProfiles[newUser.id] = {
        id: `cand-prof-${newUser.id}`,
        userId: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: "",
        location: "",
        bio: "",
        experience: "",
      };
      MockStore.saveCandidateProfiles(cProfiles);
    } else {
      const rProfiles = MockStore.getRecruiterProfiles();
      rProfiles[newUser.id] = {
        id: `rec-prof-${newUser.id}`,
        userId: newUser.id,
        name: newUser.name,
        email: newUser.email,
        companyName: credentials.companyName || "Company",
        companyDescription: "",
        companyLocation: "",
      };
      MockStore.saveRecruiterProfiles(rProfiles);
    }

    const token = `jwt_mock_${newUser.id}_${Date.now()}`;
    MockStore.setCurrentUser(newUser, token);

    return { user: newUser, token };
  },

  async getMe(): Promise<User> {
    if (USE_REAL_BACKEND) {
      return apiClient<User>("/api/auth/me");
    }

    await delay(100);
    const user = MockStore.getCurrentUser();
    if (!user) {
      throw new ApiError("Not authenticated", 401);
    }
    return user;
  },

  async logout(): Promise<void> {
    await delay(100);
    MockStore.setCurrentUser(null);
  },

  /** Helper to quickly switch active test persona during manual testing */
  switchPersona(role: "candidate" | "recruiter") {
    const users = MockStore.getUsers();
    const target = users.find((u) => u.role === role);
    if (target) {
      MockStore.setCurrentUser(target, `jwt_demo_${target.id}`);
      return target;
    }
    return null;
  },
};
