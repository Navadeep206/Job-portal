import { useEffect, useState } from "react";
import API from "../../services/api";

const STATUS = {
    accepted: { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0', dot: '#22c55e', label: 'Accepted' },
    rejected: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca', dot: '#ef4444', label: 'Rejected' },
    pending: { bg: '#fffbeb', color: '#d97706', border: '#fde68a', dot: '#f59e0b', label: 'Pending' },
};

const AVATAR_COLORS = [
    ['#dbeafe', '#1d4ed8'], ['#ede9fe', '#7c3aed'], ['#fce7f3', '#be185d'],
    ['#dcfce7', '#15803d'], ['#ffedd5', '#c2410c'], ['#e0f2fe', '#0369a1'],
];

function Applicants() {
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        API.get("/applications/job-applicants")
            .then(res => setApplicants(res.data.data || []))
            .catch(err => console.error("Failed to fetch applicants", err))
            .finally(() => setLoading(false));
    }, []);

    const handleStatusUpdate = async (appId, newStatus) => {
        try {
            const res = await API.put(`/applications/${appId}/status`, { status: newStatus });
            if (res.data.success) {
                setApplicants(prev => prev.map(a => a._id === appId ? { ...a, status: newStatus } : a));
            }
        } catch { alert("Failed to update status"); }
    };

    const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5005/api").replace('/api', '');

    const filtered = filter === 'all' ? applicants : applicants.filter(a => a.status === filter);
    const counts = { all: applicants.length, pending: applicants.filter(a => a.status === 'pending').length, accepted: applicants.filter(a => a.status === 'accepted').length, rejected: applicants.filter(a => a.status === 'rejected').length };

    return (
        <div>
            {/* Page header */}
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', marginBottom: 4, fontFamily: 'Inter,sans-serif' }}>Applicants</h1>
                <p style={{ fontSize: 14, color: '#64748b' }}>Review and manage applications for your job postings</p>
            </div>

            {/* Stat pills */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
                {[
                    { key: 'all', label: 'All', color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe' },
                    { key: 'pending', label: 'Pending', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
                    { key: 'accepted', label: 'Accepted', color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
                    { key: 'rejected', label: 'Rejected', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
                ].map(f => (
                    <button key={f.key} onClick={() => setFilter(f.key)}
                        style={{
                            padding: '7px 16px', borderRadius: 99, fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                            background: filter === f.key ? f.bg : '#f8fafc',
                            border: `1.5px solid ${filter === f.key ? f.border : '#e2e8f0'}`,
                            color: filter === f.key ? f.color : '#94a3b8',
                            boxShadow: filter === f.key ? `0 0 0 3px ${f.border}55` : 'none',
                        }}>
                        {f.label} <span style={{ marginLeft: 4, fontWeight: 900 }}>{counts[f.key]}</span>
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                    {[1, 2, 3, 4, 5, 6].map(i => <div key={i} style={{ height: 200, borderRadius: 20, background: 'rgba(255,255,255,0.6)', border: '1px solid #e2e8f0' }} />)}
                </div>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '72px 32px', borderRadius: 24, background: 'rgba(255,255,255,0.8)', border: '2px dashed #e2e8f0' }}>
                    <div style={{ width: 72, height: 72, borderRadius: 24, background: 'linear-gradient(135deg,#f5f3ff,#eef2ff)', border: '1px solid #ddd6fe', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c4b5fd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>No applicants {filter !== 'all' ? `with status "${filter}"` : 'yet'}</h3>
                    <p style={{ fontSize: 14, color: '#64748b' }}>Applications will appear here once candidates apply to your jobs.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                    {filtered.map((app, idx) => {
                        const st = STATUS[app.status] || STATUS.pending;
                        const colorPair = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                        const initials = (app.applicant?.name || 'UN').slice(0, 2).toUpperCase();
                        const resumeUrl = app.resume?.startsWith("http") ? app.resume : `${API_BASE}${app.resume}`;

                        return (
                            <div key={app._id} style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 20, border: '1.5px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.12)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04)'; }}>
                                {/* Color bar */}
                                <div style={{ height: 4, background: `linear-gradient(90deg,${colorPair[1]}cc,${colorPair[1]}44)` }} />
                                <div style={{ padding: '20px' }}>
                                    {/* Applicant header */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{ width: 44, height: 44, borderRadius: 14, background: `linear-gradient(135deg,${colorPair[0]},${colorPair[0]}cc)`, border: `1.5px solid ${colorPair[1]}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, color: colorPair[1], flexShrink: 0 }}>
                                                {initials}
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginBottom: 2 }}>{app.applicant?.name || 'Unknown Candidate'}</h3>
                                                <p style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>{app.applicant?.email}</p>
                                            </div>
                                        </div>
                                        {/* Status badge */}
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 99, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', background: st.bg, border: `1px solid ${st.border}`, color: st.color, flexShrink: 0 }}>
                                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: st.dot }} />
                                            {st.label}
                                        </span>
                                    </div>

                                    {/* Job + date */}
                                    <div style={{ padding: '10px 12px', borderRadius: 10, background: '#f8fafc', border: '1px solid #f1f5f9', marginBottom: 14 }}>
                                        <p style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginBottom: 2 }}>Applied for</p>
                                        <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{app.job?.title || 'Unknown Position'}</p>
                                        <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        {app.resume ? (
                                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer"
                                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '9px', borderRadius: 10, background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                                                Resume
                                            </a>
                                        ) : (
                                            <span style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '9px', borderRadius: 10, background: '#f8fafc', fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>No Resume</span>
                                        )}
                                        {app.status === 'pending' && (
                                            <>
                                                <button onClick={() => handleStatusUpdate(app._id, 'accepted')}
                                                    style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '9px', borderRadius: 10, border: 'none', cursor: 'pointer', background: '#f0fdf4', color: '#15803d', fontSize: 12, fontWeight: 700 }}>
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                    Accept
                                                </button>
                                                <button onClick={() => handleStatusUpdate(app._id, 'rejected')}
                                                    style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '9px', borderRadius: 10, border: 'none', cursor: 'pointer', background: '#fef2f2', color: '#dc2626', fontSize: 12, fontWeight: 700 }}>
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Applicants;
