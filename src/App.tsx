import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { RealtimeProvider } from "./context/RealtimeContext";
import { AppShell } from "./components/layout/AppShell";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// Pages
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { JobsPage } from "./pages/JobsPage";
import { JobDetailsPage } from "./pages/JobDetailsPage";
import { CandidateDashboardPage } from "./pages/CandidateDashboardPage";
import { ApplicationsPage } from "./pages/ApplicationsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ResumesPage } from "./pages/ResumesPage";
import { LearningPage } from "./pages/LearningPage";
import { ResumeAnalysisPage } from "./pages/ResumeAnalysisPage";
import { RecruiterDashboardPage } from "./pages/recruiter/RecruiterDashboardPage";
import { RecruiterJobsPage } from "./pages/recruiter/RecruiterJobsPage";
import { RecruiterCreateJobPage } from "./pages/recruiter/RecruiterCreateJobPage";
import { RecruiterJobApplicantsPage } from "./pages/recruiter/RecruiterJobApplicantsPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RealtimeProvider>
          <AppShell>
            <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:id" element={<JobDetailsPage />} />
            <Route path="/jobs/:id/resume-analysis" element={<ResumeAnalysisPage />} />

            {/* Candidate Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRole="candidate">
                  <CandidateDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/applications"
              element={
                <ProtectedRoute allowedRole="candidate">
                  <ApplicationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resumes"
              element={
                <ProtectedRoute allowedRole="candidate">
                  <ResumesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/learning"
              element={
                <ProtectedRoute allowedRole="candidate">
                  <LearningPage />
                </ProtectedRoute>
              }
            />

            {/* Shared Authenticated Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Recruiter Protected Routes */}
            <Route
              path="/recruiter/dashboard"
              element={
                <ProtectedRoute allowedRole="recruiter">
                  <RecruiterDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/jobs"
              element={
                <ProtectedRoute allowedRole="recruiter">
                  <RecruiterJobsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/jobs/create"
              element={
                <ProtectedRoute allowedRole="recruiter">
                  <RecruiterCreateJobPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/jobs/:id"
              element={
                <ProtectedRoute allowedRole="recruiter">
                  <RecruiterJobApplicantsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/jobs/:id/applications"
              element={
                <ProtectedRoute allowedRole="recruiter">
                  <RecruiterJobApplicantsPage />
                </ProtectedRoute>
              }
            />

            {/* Role & Hub Redirect Shortcuts */}
            <Route path="/recruiter" element={<Navigate to="/recruiter/dashboard" replace />} />
            <Route path="/candidate" element={<Navigate to="/dashboard" replace />} />
            <Route path="/admin" element={<Navigate to="/recruiter/dashboard" replace />} />
            <Route path="/resume" element={<Navigate to="/resumes" replace />} />

            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AppShell>
      </RealtimeProvider>
    </AuthProvider>
  </BrowserRouter>
  );
}
