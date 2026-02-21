import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

const AVATAR_COLORS = [
    ['#dbeafe', '#1d4ed8'], ['#ede9fe', '#7c3aed'], ['#fce7f3', '#be185d'],
    ['#dcfce7', '#15803d'], ['#ffedd5', '#c2410c'],
];

function JobDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [error, setError] = useState("");
    const [resume, setResume] = useState(null);
    const [resumeName, setResumeName] = useState("");

    useEffect(() => {
        API.get(`/jobs/${id}`)
            .then(res => setJob(res.data.job))
            .catch(() => setError("Job not found"))
            .finally(() => setLoading(false));
    }, [id]);

    const handleApply = async (e) => {
        e.preventDefault();
        if (!user) { navigate("/login"); return; }
        if (user.role !== "user") return;
        if (!resume) { alert("Please upload your resume."); return; }
        setApplying(true);
        try {
            const fd = new FormData();
            fd.append("jobId", job._id);
            fd.append("resume", resume);
            const res = await API.post("/applications/apply", fd, {
                headers: { "Content-Type": "multipart/form-data" }, timeout: 30000,
            });
            alert(res.data.message || "Application submitted!");
            navigate("/user");
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to submit application";
            alert(msg);
            if (err.response?.status === 400 && msg.toLowerCase().includes("already applied")) navigate("/user");
        } finally { setApplying(false); }
    };

    const handleDelete = async () => {
        if (!window.confirm("Delete this job?")) return;
        try { await API.delete(`/jobs/${id}`); navigate("/recruiter"); }
        catch (err) { alert(err.response?.data?.message || "Failed to delete job"); }
    };

    if (loading) return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', border: '4px solid #e0e7ff', borderTopColor: '#6366f1', animation: 'spin 0.8s linear infinite' }} />
                <p style={{ color: '#94a3b8', fontSize: 14 }}>Loading job details…</p>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    if (error || !job) return (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#fca5a5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: 'auto' }}><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Job Not Found</h2>
            <p style={{ color: '#64748b', marginBottom: 24 }}>{error || "This job may have been removed."}</p>
            <Link to="/" style={{ padding: '12px 28px', borderRadius: 12, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>Browse All Jobs</Link>
        </div>
    );

    const avatarIdx = (job.company?.charCodeAt(0) || 0) % AVATAR_COLORS.length;
    const [bgC, fgC] = AVATAR_COLORS[avatarIdx];
    const initials = (job.company || 'CO').slice(0, 2).toUpperCase();
    const isOwner = user && job.postedBy && user._id === job.postedBy._id;
    const canEdit = isOwner || user?.role === 'admin';

    const Section = ({ title, color, children }) => (
        <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{ display: 'inline-block', width: 4, height: 20, borderRadius: 3, background: color, flexShrink: 0 }} />
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>{title}</h3>
            </div>
            <div style={{ paddingLeft: 14, fontSize: 15, color: '#334155', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{children}</div>
        </div>
    );

    return (
        <div style={{ maxWidth: 860, margin: '0 auto', paddingBottom: 48 }}>
            {/* Back */}
            <button onClick={() => navigate(-1)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24, padding: '8px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.8)', border: '1.5px solid #e2e8f0', color: '#64748b', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                Back to Jobs
            </button>

            {/* Hero card */}
            <div style={{ background: '#fff', borderRadius: 24, border: '1.5px solid #e2e8f0', boxShadow: '0 8px 40px rgba(99,102,241,0.08)', overflow: 'hidden', marginBottom: 20 }}>
                {/* Gradient top strip */}
                <div style={{ height: 6, background: 'linear-gradient(90deg,#6366f1,#8b5cf6,#06b6d4)' }} />
                <div style={{ padding: '32px 36px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20, marginBottom: 24 }}>
                        {/* Left: avatar + title */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                            <div style={{ width: 72, height: 72, borderRadius: 20, background: `linear-gradient(135deg,${bgC},${bgC}dd)`, border: `2px solid ${fgC}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 900, color: fgC, flexShrink: 0 }}>
                                {initials}
                            </div>
                            <div>
                                <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', marginBottom: 4, fontFamily: 'Inter,sans-serif' }}>{job.title}</h1>
                                <p style={{ fontSize: 15, fontWeight: 700, color: '#6366f1' }}>{job.company}</p>
                            </div>
                        </div>
                        {/* Right: type badge + owner actions */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                            {job.type && (
                                <span style={{ padding: '6px 16px', borderRadius: 99, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', background: '#f5f3ff', border: '1px solid #ddd6fe', color: '#7c3aed' }}>
                                    {job.type}
                                </span>
                            )}
                            {canEdit && (
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button onClick={() => navigate(`/edit-job/${id}`)}
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#f8fafc', color: '#475569', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                        Edit
                                    </button>
                                    <button onClick={handleDelete}
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /></svg>
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Meta badges */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                        {job.location && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 14px', borderRadius: 10, background: '#f8fafc', border: '1.5px solid #e2e8f0', fontSize: 13, fontWeight: 600, color: '#475569' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                {job.location}
                            </span>
                        )}
                        {job.salary && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 14px', borderRadius: 10, background: '#f0fdf4', border: '1.5px solid #bbf7d0', fontSize: 13, fontWeight: 600, color: '#15803d' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                                {job.salary}
                            </span>
                        )}
                        {job.experience && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 14px', borderRadius: 10, background: '#eff6ff', border: '1.5px solid #bfdbfe', fontSize: 13, fontWeight: 600, color: '#1d4ed8' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                                {job.experience}
                            </span>
                        )}
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 14px', borderRadius: 10, background: '#f8fafc', border: '1.5px solid #e2e8f0', fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                            Posted {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>
                </div>
            </div>

            {/* Content sections */}
            <div style={{ background: '#fff', borderRadius: 24, border: '1.5px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', padding: '32px 36px', marginBottom: 20 }}>
                {job.description && <Section title="Job Description" color="linear-gradient(to bottom,#6366f1,#818cf8)">{job.description}</Section>}
                {job.requirements && <Section title="Requirements" color="linear-gradient(to bottom,#8b5cf6,#a78bfa)">{job.requirements}</Section>}
                {job.about && <Section title="About the Company" color="linear-gradient(to bottom,#10b981,#34d399)">{job.about}</Section>}
            </div>

            {/* Apply / action panel */}
            {user?.role === 'recruiter' || user?.role === 'admin' ? (
                <div style={{ padding: '20px 24px', borderRadius: 16, background: '#f8fafc', border: '1.5px solid #e2e8f0', textAlign: 'center', color: '#94a3b8', fontSize: 14, fontWeight: 600 }}>
                    {user.role === 'admin' ? 'You are viewing as Admin' : 'Recruiters cannot apply for jobs'}
                </div>
            ) : (
                <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e1b4b)', borderRadius: 24, padding: '32px 36px', border: '1px solid rgba(99,102,241,0.3)', boxShadow: '0 8px 40px rgba(99,102,241,0.2)', position: 'relative', overflow: 'hidden' }}>
                    {/* Glow orb */}
                    <div style={{ position: 'absolute', top: '-40%', right: '-10%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 6, position: 'relative' }}>Ready to apply?</h3>
                    <p style={{ fontSize: 13, color: 'rgba(203,213,225,0.7)', marginBottom: 24, position: 'relative' }}>Upload your resume and submit your application in one click.</p>
                    <form onSubmit={handleApply} style={{ display: 'flex', gap: 14, alignItems: 'flex-end', flexWrap: 'wrap', position: 'relative' }}>
                        <div style={{ flex: 1, minWidth: 220 }}>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(165,180,252,0.9)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Resume / CV</label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 18px', borderRadius: 12, background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(165,180,252,0.3)', cursor: 'pointer', color: resumeName ? '#a5b4fc' : 'rgba(203,213,225,0.6)', fontSize: 13, fontWeight: 600, backdropFilter: 'blur(8px)' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{resumeName || 'Upload PDF or DOC'}</span>
                                <input type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={e => { setResume(e.target.files[0]); setResumeName(e.target.files[0]?.name || ''); }} required />
                            </label>
                        </div>
                        <button type="submit" disabled={applying}
                            style={{ padding: '13px 32px', borderRadius: 14, border: 'none', cursor: applying ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 800, color: applying ? '#94a3b8' : '#fff', background: applying ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: applying ? 'none' : '0 4px 20px rgba(99,102,241,0.5)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
                            {applying
                                ? <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>Submitting…</>
                                : <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>Submit Application</>
                            }
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default JobDetails;
