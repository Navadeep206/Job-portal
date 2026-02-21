import { useEffect, useState } from "react";
import API from "../../services/api";
import { Link } from "react-router-dom";

const STATUS_STYLES = {
  accepted: { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0', dot: '#22c55e', label: 'Accepted' },
  rejected: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca', dot: '#ef4444', label: 'Rejected' },
  pending: { bg: '#fffbeb', color: '#d97706', border: '#fde68a', dot: '#f59e0b', label: 'Pending' },
};
const defaultStatus = { bg: '#f8fafc', color: '#475569', border: '#e2e8f0', dot: '#94a3b8', label: 'Applied' };

function UserDashboard() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/applications/my")
      .then(res => setApps(res.data.applications))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', marginBottom: 4, fontFamily: 'Inter,sans-serif' }}>
              My Applications
            </h1>
            <p style={{ fontSize: 14, color: '#64748b' }}>Track the status of your job applications</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '9px 20px', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer',
              background: '#fff', border: '1.5px solid #e2e8f0', color: '#475569',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'all 0.2s',
            }}
          >
            ↻ Refresh
          </button>
        </div>

        {/* Stats pills */}
        <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
          {[
            { label: 'Total', count: apps.length, color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' },
            { label: 'Pending', count: apps.filter(a => a.status === 'pending').length, color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
            { label: 'Accepted', count: apps.filter(a => a.status === 'accepted').length, color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
            { label: 'Rejected', count: apps.filter(a => a.status === 'rejected').length, color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
          ].map(s => (
            <div key={s.label} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 99,
              background: s.bg, border: `1px solid ${s.border}`,
            }}>
              <span style={{ fontSize: 18, fontWeight: 900, color: s.color }}>{loading ? '—' : s.count}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: s.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ height: 90, borderRadius: 20, background: 'rgba(255,255,255,0.6)', border: '1px solid #e2e8f0', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      ) : apps.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '72px 32px', borderRadius: 24,
          background: 'rgba(255,255,255,0.8)', border: '2px dashed #e2e8f0',
          backdropFilter: 'blur(8px)',
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: 24, margin: '0 auto 20px',
            background: 'linear-gradient(135deg,#eff6ff,#eef2ff)',
            border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>No applications yet</h3>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 28 }}>Start applying to jobs that match your skills and interests.</p>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '13px 32px', borderRadius: 14, border: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: 700, color: '#fff',
              background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
              boxShadow: '0 4px 18px rgba(99,102,241,0.45)',
            }}>
              Browse Jobs →
            </button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {apps.map((app) => {
            const s = STATUS_STYLES[app.status] || defaultStatus;
            return (
              <div
                key={app._id}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  flexWrap: 'wrap', gap: 12, padding: '22px 24px', borderRadius: 20,
                  background: 'rgba(255,255,255,0.9)', border: '1.5px solid #e2e8f0',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.05)', backdropFilter: 'blur(8px)',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                    background: 'linear-gradient(135deg,#eff6ff,#eef2ff)', border: '1px solid #bfdbfe',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                    </svg>
                  </div>
                  <div>
                    <h4 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 2 }}>
                      {app.job?.title || 'Job Title Unavailable'}
                    </h4>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>
                      {app.job?.company || 'Company Unavailable'}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '5px 14px', borderRadius: 99, fontSize: 12, fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                    background: s.bg, color: s.color, border: `1px solid ${s.border}`,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot }} />
                    {s.label}
                  </span>
                  <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>
                    Applied: {new Date(app.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
