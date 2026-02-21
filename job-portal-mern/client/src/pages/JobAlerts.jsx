import { useState, useEffect } from "react";
import api from "../services/api";

const FIELD_STYLE = {
    width: '100%', padding: '12px 16px', borderRadius: 12, fontSize: 14,
    border: '1.5px solid #e2e8f0', outline: 'none', fontFamily: 'Inter,sans-serif',
    color: '#0f172a', background: '#fff', transition: 'border 0.2s', boxSizing: 'border-box',
};
const LABEL = { fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6, display: 'block' };

const FREQ_BADGE = {
    daily: { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
    weekly: { bg: '#f5f3ff', color: '#7c3aed', border: '#ddd6fe' },
};

function JobAlerts() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [createError, setCreateError] = useState(null);
    const [creating, setCreating] = useState(false);
    const [formData, setFormData] = useState({ keywords: '', location: '', frequency: 'daily' });

    useEffect(() => { fetchAlerts(); }, []);

    const fetchAlerts = async () => {
        try {
            const res = await api.get('/users/alerts');
            setAlerts(res.data.alerts);
        } catch { setError('Failed to load alerts'); }
        finally { setLoading(false); }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleCreate = async (e) => {
        e.preventDefault();
        setCreateError(null);
        setCreating(true);
        try {
            const res = await api.post('/users/alerts', formData);
            setAlerts([res.data.alert, ...alerts]);
            setFormData({ keywords: '', location: '', frequency: 'daily' });
        } catch (err) {
            setCreateError(err.response?.data?.message || 'Failed to create alert');
        } finally { setCreating(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this alert?')) return;
        try {
            await api.delete(`/users/alerts/${id}`);
            setAlerts(alerts.filter(a => a._id !== id));
        } catch { alert('Failed to delete alert'); }
    };

    return (
        <div>
            {/* Page header */}
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', marginBottom: 4, fontFamily: 'Inter,sans-serif' }}>Job Alerts</h1>
                <p style={{ fontSize: 14, color: '#64748b' }}>Get notified instantly when matching jobs are posted</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 24, alignItems: 'start' }}>

                {/* ── Create Alert form ── */}
                <div style={{ position: 'sticky', top: 24 }}>
                    <div style={{
                        background: 'rgba(255,255,255,0.95)', borderRadius: 24, padding: '28px',
                        border: '1.5px solid #e2e8f0', boxShadow: '0 4px 20px rgba(59,130,246,0.08)',
                        overflow: 'hidden', position: 'relative',
                    }}>
                        {/* Top gradient bar */}
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg,#3b82f6,#8b5cf6,#06b6d4)' }} />

                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#eff6ff,#eef2ff)', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                </svg>
                            </div>
                            <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a' }}>Create Alert</h2>
                        </div>

                        {createError && (
                            <div style={{ padding: '10px 14px', borderRadius: 10, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: 12, fontWeight: 600, marginBottom: 18 }}>
                                Error: {createError}
                            </div>
                        )}

                        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <label style={LABEL}>Keywords <span style={{ color: '#ef4444' }}>*</span></label>
                                <input name="keywords" value={formData.keywords} onChange={handleChange} placeholder="e.g. React Developer, Python" required
                                    style={FIELD_STYLE} onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                            </div>
                            <div>
                                <label style={LABEL}>Location <span style={{ color: '#ef4444' }}>*</span></label>
                                <input name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Remote, New York" required
                                    style={FIELD_STYLE} onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                            </div>
                            <div>
                                <label style={LABEL}>Frequency</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                    {['daily', 'weekly'].map(f => (
                                        <button key={f} type="button" onClick={() => setFormData({ ...formData, frequency: f })}
                                            style={{
                                                padding: '10px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', textTransform: 'capitalize',
                                                background: formData.frequency === f ? 'linear-gradient(135deg,#eff6ff,#eef2ff)' : '#f8fafc',
                                                border: formData.frequency === f ? '2px solid #3b82f6' : '2px solid #e2e8f0',
                                                color: formData.frequency === f ? '#1d4ed8' : '#64748b',
                                            }}>
                                            {f === 'daily'
                                                ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>Daily</span>
                                                : <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" /></svg>Weekly</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button type="submit" disabled={creating} style={{
                                padding: '13px', borderRadius: 14, border: 'none', cursor: 'pointer', marginTop: 4,
                                fontSize: 14, fontWeight: 700, color: '#fff',
                                background: creating ? '#94a3b8' : 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
                                boxShadow: creating ? 'none' : '0 4px 18px rgba(99,102,241,0.4)',
                                transition: 'all 0.2s',
                            }}>
                                {creating ? 'Creating…' : <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>Create Alert</span>}
                            </button>
                        </form>
                    </div>
                </div>

                {/* ── Alerts list ── */}
                <div>
                    {/* Stats pill */}
                    {!loading && alerts.length > 0 && (
                        <div style={{ marginBottom: 20 }}>
                            <span style={{ padding: '6px 16px', borderRadius: 99, fontSize: 13, fontWeight: 700, background: '#f5f3ff', border: '1px solid #ddd6fe', color: '#7c3aed' }}>
                                {alerts.length} active alert{alerts.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    )}

                    {error && (
                        <div style={{ padding: '12px 16px', borderRadius: 12, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: 13, marginBottom: 16 }}>Error: {error}</div>
                    )}

                    {loading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {[1, 2, 3].map(i => <div key={i} style={{ height: 80, borderRadius: 20, background: 'rgba(255,255,255,0.6)', border: '1px solid #e2e8f0' }} />)}
                        </div>
                    ) : alerts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '64px 32px', borderRadius: 24, background: 'rgba(255,255,255,0.8)', border: '2px dashed #e2e8f0', backdropFilter: 'blur(8px)' }}>
                            <div style={{ width: 72, height: 72, borderRadius: 24, margin: '0 auto 20px', background: 'linear-gradient(135deg,#f5f3ff,#eef2ff)', border: '1px solid #ddd6fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c4b5fd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                </svg>
                            </div>
                            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>No alerts yet</h3>
                            <p style={{ fontSize: 14, color: '#64748b' }}>Create an alert to get notified when matching jobs are posted.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {alerts.map(alert => {
                                const fb = FREQ_BADGE[alert.frequency] || FREQ_BADGE.daily;
                                return (
                                    <div key={alert._id} style={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
                                        padding: '20px 24px', borderRadius: 20,
                                        background: 'rgba(255,255,255,0.9)', border: '1.5px solid #e2e8f0',
                                        boxShadow: '0 2px 12px rgba(0,0,0,0.04)', transition: 'all 0.2s',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                            <div style={{ width: 44, height: 44, borderRadius: 14, flexShrink: 0, background: 'linear-gradient(135deg,#f5f3ff,#eef2ff)', border: '1px solid #ddd6fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>{alert.keywords}</h4>
                                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                                                    {alert.location && (
                                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: '#64748b', padding: '3px 10px', borderRadius: 99, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                                            {alert.location}
                                                        </span>
                                                    )}
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '3px 10px', borderRadius: 99, background: fb.bg, border: `1px solid ${fb.border}`, color: fb.color }}>
                                                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: fb.color }} />
                                                        {alert.frequency}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <button onClick={() => handleDelete(alert._id)}
                                            style={{ padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', flexShrink: 0 }}>
                                            Delete
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default JobAlerts;
