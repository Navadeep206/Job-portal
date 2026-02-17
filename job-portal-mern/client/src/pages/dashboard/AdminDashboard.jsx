import { useEffect, useState } from "react";
import API from "../../services/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    jobs: 0,
    applications: 0
  });
  const [analytics, setAnalytics] = useState([]);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, analyticsRes, usersRes, jobsRes] = await Promise.all([
          API.get("/admin/stats"),
          API.get("/admin/analytics/jobs"),
          API.get("/admin/users"),
          API.get("/jobs?limit=100") // Fetch all jobs (paginated but limit high)
        ]);

        setStats(statsRes.data);
        setAnalytics(analyticsRes.data.data);
        setUsers(usersRes.data);
        setJobs(jobsRes.data.jobs); // Access .jobs array from response
      } catch (err) {
        console.error("Failed to fetch admin data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await API.delete(`/admin/users/${id}`);
        setUsers(users.filter((user) => user._id !== id));
        setStats({ ...stats, users: stats.users - 1 });
      } catch (err) {
        console.error("Failed to delete user", err);
        alert("Failed to delete user");
      }
    }
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await API.delete(`/jobs/${id}`);
        setJobs(jobs.filter((job) => job._id !== id));
        setStats({ ...stats, jobs: stats.jobs - 1 });
      } catch (err) {
        console.error("Failed to delete job", err);
        alert("Failed to delete job");
      }
    }
  };

  if (loading) return <div className="text-center p-10 text-slate-500">Loading admin dashboard...</div>;

  const path = window.location.pathname; // Simple check, or use useLocation hook

  return (
    <div className="fade-in space-y-8">

      {/* Overview Section */}
      {(path === '/admin' || path === '/admin/') && (
        <>
          <h2 className="text-2xl font-bold mb-6 text-slate-800">Admin Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white border-l-4 border-l-primary hover:translate-y-[-2px]">
              <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Users</h3>
              <p className="text-3xl font-bold text-slate-800 mt-2">{stats.users}</p>
            </Card>
            <Card className="bg-white border-l-4 border-l-secondary hover:translate-y-[-2px]">
              <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Jobs</h3>
              <p className="text-3xl font-bold text-slate-800 mt-2">{stats.jobs}</p>
            </Card>
            <Card className="bg-white border-l-4 border-l-emerald-500 hover:translate-y-[-2px]">
              <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Applications</h3>
              <p className="text-3xl font-bold text-slate-800 mt-2">{stats.applications}</p>
            </Card>
          </div>

          <Card>
            <h3 className="text-xl font-bold mb-4 text-slate-800 border-b border-slate-100 pb-4">Job Performance Analytics</h3>
            {analytics.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No job analytics available.</p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Job ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Job Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Applications</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {analytics.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                          {item._id.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {item.title || "Job Title"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold border border-indigo-100">{item.count}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}

      {/* Manage Users Section */}
      {path === '/admin/users' && (
        <Card>
          <h3 className="text-xl font-bold mb-4 text-slate-800 border-b border-slate-100 pb-4">Manage Users</h3>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold border ${user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100' : user.role === 'recruiter' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <Button
                        variant="danger"
                        size="xs"
                        onClick={() => handleDeleteUser(user._id)}
                        disabled={user.role === 'admin'}
                        className="bg-red-50 text-red-600 hover:bg-red-100 border-red-100"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500">No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Manage Jobs Section */}
      {path === '/admin/jobs' && (
        <Card>
          <h3 className="text-xl font-bold mb-4 text-slate-800 border-b border-slate-100 pb-4">Manage Jobs</h3>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Posted By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{job.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{job.company}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{job.postedBy?.email || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(job.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <Button
                        variant="danger"
                        size="xs"
                        onClick={() => handleDeleteJob(job._id)}
                        className="bg-red-50 text-red-600 hover:bg-red-100 border-red-100"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
                {jobs.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No jobs found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

export default AdminDashboard;
