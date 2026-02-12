import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
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
import Profile from "./pages/dashboard/Profile";

import Navbar from "./components/common/Navbar";

function LayoutWithFooter() {
  return (
    <div className="flex flex-col min-h-screen">
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
    <BrowserRouter>
      <Routes>
        {/* Public Routes with Footer */}
        <Route element={<LayoutWithFooter />}>
          <Route path="/" element={<JobList />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Dashboard Routes with Sidebar (and implicitly no Footer or custom Footer logic if needed, but usually Dashboards are full screen apps) */}
        {/* Actually user requested Sidebar AND Footer. Let's see. Usually sidebar layouts have footer at bottom of content area or no footer. 
            I'll wrap DashboardLayout with a Navbar? No, Sidebar replaces Navbar usually. 
            But typically 'App' has Navbar. 
            Let's keep Navbar for consistency or remove it for Sidebar layout? 
            Sidebar usually replaces top navigation. 
            I will keep Navbar for public pages. 
            For Dashboard, I will use Sidebar + Topbar (maybe just Navbar) + Content.
            My DashboardLayout currently has Sidebar and Content. 
            I will modify DashboardLayout to include Navbar? Or just leave it as Sidebar + Content. 
            Let's stick to the plan: Sidebar for Dashboard. 
            The prompt asked for "nav bar sidebar and footer". 
            I'll put Navbar on top of everything? 
            If I have Sidebar, I might not need Navbar links. 
            Let's make DashboardLayout include Navbar (or just rely on Sidebar) and Footer?
            Let's go with: Public Pages -> Navbar + Footer. 
            Dashboard Pages -> Sidebar + Content. (Maybe no footer or footer at bottom of content).
            Let's try to include Footer in DashboardLayout too.
        */}

        <Route element={<><Navbar /><DashboardLayout /></>}>
          {/* Wait, putting Navbar above DashboardLayout means Navbar is full width. Sidebar is below. 
               This is a common "Top Nav + Side Nav" layout. 
               But my Sidebar is `h-screen fixed`. It might overlap or sit below. 
               My Sidebar CSS: `fixed left-0 top-0 pt-20`. `pt-20` suggests it expects a top bar. 
               So yes, Navbar should be present. 
           */}
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
        </Route>

        {/* Fallback */}
        <Route path="*" element={<LayoutWithFooter><div className="text-center mt-10"><h2>404 - Page Not Found</h2><Link to="/" className="btn btn-primary mt-4">Go Home</Link></div></LayoutWithFooter>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
