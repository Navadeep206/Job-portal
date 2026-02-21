import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { ThemeProvider } from "./context/ThemeContext";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import JobList from "./pages/jobs/JobList";
import JobDetails from "./pages/jobs/JobDetails";

import ProtectedRoute from "./components/common/ProtectedRoute";
import Footer from "./components/common/Footer";
import DashboardLayout from "./components/layout/DashboardLayout";

import UserDashboard from "./pages/dashboard/UserDashboard";
import RecruiterDashboard from "./pages/dashboard/RecruiterDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";

import Applicants from "./pages/dashboard/Applicants";

import PostJob from "./pages/dashboard/PostJob";
import EditJob from "./pages/dashboard/EditJob";
import Profile from "./pages/dashboard/Profile";
import SavedJobs from "./pages/SavedJobs";
import JobAlerts from "./pages/JobAlerts";


import Navbar from "./components/common/Navbar";

function LayoutWithFooter() {
  return (
    <div className="flex flex-col min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar />
      <div className="container mt-4 animate-fade-in flex-grow" style={{ paddingBottom: '2rem' }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes with Footer */}
          <Route element={<LayoutWithFooter />}>
            <Route path="/" element={<JobList />} />
            <Route path="/job/:id" element={<JobDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

          </Route>

          {/* Dashboard Routes with Sidebar */}
          <Route element={
            <div className="min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-300">
              <Navbar />
              <DashboardLayout />
            </div>
          }>
            <Route
              path="/user"
              element={
                <ProtectedRoute roles={["user"]}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter"
              element={
                <ProtectedRoute roles={["recruiter"]}>
                  <RecruiterDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-jobs"
              element={
                <ProtectedRoute roles={["recruiter"]}>
                  <Navigate to="/recruiter" replace />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/jobs"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/post-job"
              element={
                <ProtectedRoute roles={["recruiter"]}>
                  <PostJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-job/:id"
              element={
                <ProtectedRoute roles={["recruiter"]}>
                  <EditJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/applicants"
              element={
                <ProtectedRoute roles={["recruiter"]}>
                  <Applicants />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute roles={["user", "recruiter", "admin"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/saved-jobs"
              element={
                <ProtectedRoute roles={["user"]}>
                  <SavedJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/job-alerts"
              element={
                <ProtectedRoute roles={["user"]}>
                  <JobAlerts />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<LayoutWithFooter><div className="text-center mt-10"><h2>404 - Page Not Found</h2><Link to="/" className="btn btn-primary mt-4">Go Home</Link></div></LayoutWithFooter>} />

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
