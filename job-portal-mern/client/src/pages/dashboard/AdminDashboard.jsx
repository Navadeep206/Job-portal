import { useEffect, useState } from "react";
import API from "../../services/api";
import { useLocation } from "react-router-dom";

const ROLE_BADGE = {
  admin: { bg: '#f5f3ff', color: '#7c3aed', border: '#ddd6fe' },
  recruiter: { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
  user: { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
};

const TH = { padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' };
const TD = { padding: '14px 20px', fontSize: 14, color: '#374151', fontWeight: 500, borderBottom: '1px solid #f1f5f9' };

function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, jobs: 0, applications: 0 });
  const [analytics, setAnalytics] = useState([]);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, analyticsRes, usersRes, jobsRes] = await Promise.all([
          API.get("/admin/stats"),
          API.get("/admin/analytics/jobs"),
          API.get("/admin/users"),
          API.get("/jobs?limit=100"),
        ]);
        setStats(statsRes.data);
        setAnalytics(analyticsRes.data.data);
        setUsers(usersRes.data);
        setJobs(jobsRes.data.jobs);
      } catch { /* silent */ } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try { await API.delete(`/admin/users/${id}`); setUsers(u => u.filter(x => x._id !== id)); setStats(s => ({ ...s, users: s.users - 1 })); }
    catch { alert("Failed to delete user"); }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    try { await API.delete(`/jobs/${id}`); setJobs(j => j.filter(x => x._id !== id)); setStats(s => ({ ...s, jobs: s.jobs - 1 })); }
    catch { alert("Failed to delete job"); }
  };

  const STAT_CARDS = [
    {
      label: 'Total Users', value: stats.users, color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
    },
    {
      label: 'Total Jobs', value: stats.jobs, color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>
    },
    {
      label: 'Total Applications', value: stats.applications, color: '#10b981', bg: '#f0fdf4', border: '#bbf7d0',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
    },
  ];

  if (loading) return (
    <div>
      <div style={{ height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.6)', width: '30%', marginBottom: 28 }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 28 }}>
        {[1, 2, 3].map(i => <div key={i} style={{ height: 110, borderRadius: 20, background: 'rgba(255,255,255,0.6)', border: '1px solid #e2e8f0' }} />)}
      </div>
    </div>
  );

  return (
    <div>
      {/* ── OVERVIEW ── */}
      {(path === '/admin' || path === '/admin/') && (
        <>
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', marginBottom: 4, fontFamily: 'Inter,sans-serif' }}>Admin Dashboard</h1>
            <p style={{ fontSize: 14, color: '#64748b' }}>Monitor and manage the entire platform</p>
          </div>

          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginBottom: 32 }}>
            {STAT_CARDS.map(s => (
              <div key={s.label} style={{ padding: '24px', borderRadius: 24, background: 'rgba(255,255,255,0.95)', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{s.label}</p>
                    <p style={{ fontSize: 36, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</p>
                  </div>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: s.bg, border: `1px solid ${s.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {s.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Analytics table */}
          <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 24, border: '1.5px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <div style={{ padding: '22px 24px', borderBottom: '1px solid #f1f5f9' }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>Job Performance Analytics</h3>
            </div>
            {analytics.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8', fontSize: 14 }}>No analytics data available yet</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr><th style={TH}>Job ID</th><th style={TH}>Job Title</th><th style={TH}>Applications</th></tr></thead>
                <tbody>
                  {analytics.map(item => (
                    <tr key={item._id}>
                      <td style={TD}><span style={{ fontFamily: 'monospace', fontSize: 13, color: '#94a3b8' }}>{item._id.substring(0, 10)}…</span></td>
                      <td style={{ ...TD, fontWeight: 700, color: '#0f172a' }}>{item.title || 'N/A'}</td>
                      <td style={TD}><span style={{ padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700, background: '#f5f3ff', border: '1px solid #ddd6fe', color: '#7c3aed' }}>{item.count}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* ── MANAGE USERS ── */}
      {path === '/admin/users' && (
        <div>
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', marginBottom: 4, fontFamily: 'Inter,sans-serif' }}>Manage Users</h1>
            <p style={{ fontSize: 14, color: '#64748b' }}>{users.length} registered users on the platform</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 24, border: '1.5px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr><th style={TH}>Name</th><th style={TH}>Email</th><th style={TH}>Role</th><th style={TH}>Actions</th></tr></thead>
              <tbody>
                {users.map(user => {
                  const rb = ROLE_BADGE[user.role] || ROLE_BADGE.user;
                  return (
                    <tr key={user._id}>
                      <td style={{ ...TD, fontWeight: 700 }}>{user.name}</td>
                      <td style={TD}>{user.email}</td>
                      <td style={TD}><span style={{ padding: '4px 12px', borderRadius: 99, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', background: rb.bg, border: `1px solid ${rb.border}`, color: rb.color }}>{user.role}</span></td>
                      <td style={TD}>
                        <button onClick={() => handleDeleteUser(user._id)} disabled={user.role === 'admin'}
                          style={{ padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: user.role === 'admin' ? 'not-allowed' : 'pointer', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', opacity: user.role === 'admin' ? 0.4 : 1 }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {users.length === 0 && <tr><td colSpan="4" style={{ ...TD, textAlign: 'center', color: '#94a3b8', padding: 48 }}>No users found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── MANAGE JOBS ── */}
      {path === '/admin/jobs' && (
        <div>
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', marginBottom: 4, fontFamily: 'Inter,sans-serif' }}>Manage Jobs</h1>
            <p style={{ fontSize: 14, color: '#64748b' }}>{jobs.length} active job listings on the platform</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 24, border: '1.5px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr><th style={TH}>Title</th><th style={TH}>Company</th><th style={TH}>Posted By</th><th style={TH}>Date</th><th style={TH}>Actions</th></tr></thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job._id}>
                    <td style={{ ...TD, fontWeight: 700 }}>{job.title}</td>
                    <td style={TD}>{job.company}</td>
                    <td style={{ ...TD, color: '#94a3b8' }}>{job.postedBy?.email || 'N/A'}</td>
                    <td style={{ ...TD, color: '#94a3b8' }}>{new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td style={TD}>
                      <button onClick={() => handleDeleteJob(job._id)}
                        style={{ padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {jobs.length === 0 && <tr><td colSpan="5" style={{ ...TD, textAlign: 'center', color: '#94a3b8', padding: 48 }}>No jobs found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
