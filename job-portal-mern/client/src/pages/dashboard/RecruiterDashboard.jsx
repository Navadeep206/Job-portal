import { useEffect, useState } from "react";
import API from "../../services/api";
import { Link } from "react-router-dom";

const STATUS_STYLES = {
  accepted: { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0', dot: '#22c55e' },
  rejected: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca', dot: '#ef4444' },
  pending: { bg: '#fffbeb', color: '#d97706', border: '#fde68a', dot: '#f59e0b' },
};
const defS = { bg: '#f8fafc', color: '#475569', border: '#e2e8f0', dot: '#94a3b8' };

const BTN = (extra) => ({
  padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 700,
  cursor: 'pointer', border: 'none', transition: 'all 0.2s', ...extra,
});

function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/jobs/my")
      .then(res => setJobs(res.data.jobs))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const viewApplicants = async (jobId) => {
    try {
      const res = await API.get(`/applications/job/${jobId}`);
      setApps(res.data.applications);
      setSelectedJob(jobId);
    } catch { /* silent */ }
  };

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      const res = await API.put(`/applications/${appId}/status`, { status: newStatus });
      if (res.data.success) setApps(prev => prev.map(a => a._id === appId ? { ...a, status: newStatus } : a));
    } catch { alert("Failed to update status"); }
  };

  const deleteJob = (jobId) => {
    if (!window.confirm("Delete this job?")) return;
    API.delete(`/jobs/${jobId}`)
      .then(() => { setJobs(jobs.filter(j => j._id !== jobId)); if (selectedJob === jobId) { setSelectedJob(null); setApps([]); } })
      .catch(() => alert("Failed to delete job"));
  };

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', marginBottom: 4, fontFamily: 'Inter,sans-serif' }}>Recruiter Dashboard</h1>
            <p style={{ fontSize: 14, color: '#64748b' }}>Manage your job postings and review applicants</p>
          </div>
          <Link to="/post-job" style={{ textDecoration: 'none' }}>
            <button style={{ ...BTN({ padding: '10px 22px', fontSize: 14 }), background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', color: '#fff', boxShadow: '0 4px 16px rgba(99,102,241,0.4)', borderRadius: 14 }}>
              + Post a Job
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
          {[
            { label: 'Total Jobs', count: jobs.length, color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' },
            { label: 'Total Applicants', count: apps.length, color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 18px', borderRadius: 99, background: s.bg, border: `1px solid ${s.border}` }}>
              <span style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{loading ? '—' : s.count}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: s.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, alignItems: 'start' }}>

        {/* Left: job list */}
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 14 }}>My Posted Jobs</h2>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[1, 2, 3].map(i => <div key={i} style={{ height: 80, borderRadius: 16, background: 'rgba(255,255,255,0.6)', border: '1px solid #e2e8f0' }} />)}
            </div>
          ) : jobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', borderRadius: 20, background: 'rgba(255,255,255,0.7)', border: '2px dashed #e2e8f0' }}>
              <p style={{ fontSize: 14, color: '#64748b', marginBottom: 16 }}>No jobs posted yet.</p>
              <Link to="/post-job" style={{ textDecoration: 'none' }}>
                <button style={{ padding: '10px 24px', borderRadius: 12, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', color: '#fff', fontWeight: 700, fontSize: 13 }}>
                  Post First Job
                </button>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {jobs.map(job => (
                <div
                  key={job._id}
                  onClick={() => viewApplicants(job._id)}
                  style={{
                    padding: '18px 20px', borderRadius: 18, cursor: 'pointer', transition: 'all 0.2s',
                    background: selectedJob === job._id ? 'linear-gradient(135deg,#eff6ff,#eef2ff)' : 'rgba(255,255,255,0.9)',
                    border: selectedJob === job._id ? '2px solid #3b82f6' : '1.5px solid #e2e8f0',
                    boxShadow: selectedJob === job._id ? '0 4px 20px rgba(59,130,246,0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                >
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: selectedJob === job._id ? '#1d4ed8' : '#0f172a', marginBottom: 4 }}>{job.title}</h4>
                  <p style={{ fontSize: 12, color: '#64748b', marginBottom: 14 }}>
                    {selectedJob === job._id ? `${apps.length} applicant${apps.length !== 1 ? 's' : ''}` : 'Click to view applicants'}
                  </p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link to={`/edit-job/${job._id}`} onClick={e => e.stopPropagation()} style={{ textDecoration: 'none' }}>
                      <button style={BTN({ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', borderRadius: 8 })}>
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={e => { e.stopPropagation(); deleteJob(job._id); }}
                      style={BTN({ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 8 })}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: applicants panel */}
        <div>
          {selectedJob ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>Applicants</h2>
                <span style={{ padding: '5px 14px', borderRadius: 99, fontSize: 12, fontWeight: 700, background: '#f5f3ff', border: '1px solid #ddd6fe', color: '#7c3aed' }}>
                  {apps.length} Total
                </span>
              </div>
              {apps.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', borderRadius: 24, background: 'rgba(255,255,255,0.8)', border: '2px dashed #e2e8f0' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c7d2fe" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: '#64748b' }}>No applicants yet for this job</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {apps.map(app => {
                    const s = STATUS_STYLES[app.status] || defS;
                    return (
                      <div key={app._id} style={{
                        padding: '20px 22px', borderRadius: 20,
                        background: 'rgba(255,255,255,0.9)', border: '1.5px solid #e2e8f0',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
                      }}>
                        <div>
                          <p style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 2 }}>{app.applicant?.name}</p>
                          <p style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>{app.applicant?.email}</p>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 11, color: '#94a3b8', padding: '3px 10px', borderRadius: 99, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                              Applied: {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            {app.resume && (
                              <a href={app.resume} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#3b82f6', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                                View Resume
                              </a>
                            )}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          {app.status === 'pending' ? (
                            <>
                              <button onClick={() => handleStatusUpdate(app._id, 'accepted')}
                                style={{ ...BTN({ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', borderRadius: 10 }), display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> Accept
                              </button>
                              <button onClick={() => handleStatusUpdate(app._id, 'rejected')}
                                style={{ ...BTN({ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 10 }), display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg> Reject
                              </button>
                            </>
                          ) : (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 14px', borderRadius: 99, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                              <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot }} />
                              {app.status}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 32px', borderRadius: 24, background: 'rgba(255,255,255,0.7)', border: '2px dashed #e2e8f0', backdropFilter: 'blur(8px)' }}>
              <div style={{ width: 72, height: 72, borderRadius: 24, margin: '0 auto 20px', background: 'linear-gradient(135deg,#eff6ff,#eef2ff)', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                </svg>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Select a job</h3>
              <p style={{ fontSize: 14, color: '#64748b' }}>Click any job on the left to view and manage its applicants</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecruiterDashboard;
