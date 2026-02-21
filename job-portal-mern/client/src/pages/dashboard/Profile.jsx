import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";

const FIELD_STYLE = {
    width: '100%', padding: '13px 16px', borderRadius: 12, fontSize: 14,
    border: '1.5px solid #e2e8f0', outline: 'none', fontFamily: 'Inter,sans-serif',
    color: '#0f172a', background: '#fff', transition: 'border 0.2s', boxSizing: 'border-box',
};
const LABEL = { fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6, display: 'block' };
const SECTION_HEADER = (color) => ({
    fontSize: 13, fontWeight: 800, color, textTransform: 'uppercase', letterSpacing: '0.08em',
    marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8,
});
const BAR_COLORS = ['#3b82f6,#8b5cf6', '#8b5cf6,#ec4899', '#10b981,#06b6d4', '#f59e0b,#ef4444'];

function Profile() {
    const { user, login } = useAuth();
    const [formData, setFormData] = useState({ name: '', email: '', role: '', password: '', title: '', bio: '', location: '', skills: '' });
    const [experience, setExperience] = useState([]);
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [resumeFile, setResumeFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData({ name: user.name || '', email: user.email || '', role: user.role || '', password: '', title: user.title || '', bio: user.bio || '', location: user.location || '', skills: user.skills ? user.skills.join(', ') : '' });
            if (user.avatar) setAvatarPreview(user.avatar);
            if (user.experience) setExperience(user.experience);
        }
    }, [user]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleAvatarChange = (e) => { const f = e.target.files[0]; setAvatarFile(f); if (f) setAvatarPreview(URL.createObjectURL(f)); };
    const handleResumeChange = (e) => setResumeFile(e.target.files[0]);
    const addExperience = () => setExperience([...experience, { title: '', company: '', period: '', description: '' }]);
    const removeExperience = (i) => setExperience(experience.filter((_, idx) => idx !== i));
    const handleExpChange = (i, field, val) => { const e = [...experience]; e[i][field] = val; setExperience(e); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setMessage(null); setError(null);
        const data = new FormData();
        ['name', 'title', 'bio', 'location', 'skills'].forEach(k => data.append(k, formData[k]));
        data.append('experience', JSON.stringify(experience));
        if (formData.password) data.append('password', formData.password);
        if (avatarFile) data.append('avatar', avatarFile);
        if (resumeFile) data.append('resume', resumeFile);
        try {
            const res = await api.put('/users/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } });
            setMessage('Profile updated successfully!');
            login(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally { setLoading(false); }
    };

    const initials = user?.name ? user.name.slice(0, 2).toUpperCase() : 'U';

    return (
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
            {/* Page header */}
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', marginBottom: 4, fontFamily: 'Inter,sans-serif' }}>Edit Profile</h1>
                <p style={{ fontSize: 14, color: '#64748b' }}>Keep your profile up to date to get the best matches</p>
            </div>

            {message && (
                <div style={{ padding: '12px 16px', borderRadius: 12, background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', fontSize: 13, fontWeight: 600, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                    {message}
                </div>
            )}
            {error && (
                <div style={{ padding: '12px 16px', borderRadius: 12, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: 13, fontWeight: 600, marginBottom: 24 }}>
                    Error: {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* ── Avatar + Identity ── */}
                <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 24, padding: '32px', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', marginBottom: 20 }}>
                    <h3 style={SECTION_HEADER('#3b82f6')}>
                        <span style={{ width: 3, height: 14, borderRadius: 2, background: 'linear-gradient(to bottom,#3b82f6,#8b5cf6)', display: 'inline-block' }} />
                        Profile Photo
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative', flexShrink: 0 }}>
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="avatar" style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '3px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
                                    onError={e => e.target.src = 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'} />
                            ) : (
                                <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 900, color: '#fff', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}>
                                    {initials}
                                </div>
                            )}
                            <label style={{ position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 10px rgba(99,102,241,0.5)', border: '2px solid #fff' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
                                <input type="file" onChange={handleAvatarChange} accept="image/*" style={{ display: 'none' }} />
                            </label>
                        </div>
                        <div>
                            <p style={{ fontSize: 18, fontWeight: 900, color: '#0f172a' }}>{user?.name || 'Your Name'}</p>
                            <p style={{ fontSize: 13, color: '#64748b', textTransform: 'capitalize', marginBottom: 12 }}>{user?.role} · {user?.email}</p>
                            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 18px', borderRadius: 10, background: '#f8fafc', border: '1.5px solid #e2e8f0', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#475569' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
                                Change Photo
                                <input type="file" onChange={handleAvatarChange} accept="image/*" style={{ display: 'none' }} />
                            </label>
                        </div>
                    </div>
                </div>

                {/* ── Basic Info ── */}
                <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 24, padding: '32px', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', marginBottom: 20 }}>
                    <h3 style={SECTION_HEADER('#8b5cf6')}>
                        <span style={{ width: 3, height: 14, borderRadius: 2, background: 'linear-gradient(to bottom,#8b5cf6,#ec4899)', display: 'inline-block' }} />
                        Personal Information
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
                        <div>
                            <label style={LABEL}>Full Name <span style={{ color: '#ef4444' }}>*</span></label>
                            <input name="name" value={formData.name} onChange={handleChange} required style={FIELD_STYLE}
                                onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                        </div>
                        <div>
                            <label style={LABEL}>Professional Title</label>
                            <input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Senior Frontend Developer" style={FIELD_STYLE}
                                onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
                        <div>
                            <label style={LABEL}>Email Address</label>
                            <input value={formData.email} disabled style={{ ...FIELD_STYLE, background: '#f8fafc', color: '#94a3b8', cursor: 'not-allowed' }} />
                        </div>
                        <div>
                            <label style={LABEL}>Location</label>
                            <input name="location" value={formData.location} onChange={handleChange} placeholder="e.g. New York, USA" style={FIELD_STYLE}
                                onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                        </div>
                    </div>
                    <div style={{ marginBottom: 18 }}>
                        <label style={LABEL}>Bio</label>
                        <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} placeholder="Tell us about yourself, your goals and expertise…"
                            style={{ ...FIELD_STYLE, resize: 'vertical', lineHeight: 1.65 }}
                            onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                    </div>
                    <div>
                        <label style={LABEL}>Skills <span style={{ fontSize: 11, fontWeight: 500, color: '#94a3b8' }}>(comma separated)</span></label>
                        <input name="skills" value={formData.skills} onChange={handleChange} placeholder="React, Node.js, TypeScript, TailwindCSS…" style={FIELD_STYLE}
                            onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                    </div>
                </div>

                {/* ── Resume ── */}
                <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 24, padding: '32px', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', marginBottom: 20 }}>
                    <h3 style={SECTION_HEADER('#10b981')}>
                        <span style={{ width: 3, height: 14, borderRadius: 2, background: 'linear-gradient(to bottom,#10b981,#06b6d4)', display: 'inline-block' }} />
                        Resume / CV
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '11px 22px', borderRadius: 12, background: '#f8fafc', border: '1.5px solid #e2e8f0', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#475569', flexShrink: 0 }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                            {resumeFile ? 'File Selected' : 'Upload Resume'}
                            <input type="file" name="resume" onChange={handleResumeChange} accept=".pdf,.doc,.docx" style={{ display: 'none' }} />
                        </label>
                        <span style={{ fontSize: 13, color: resumeFile ? '#15803d' : '#94a3b8', fontWeight: 600 }}>
                            {resumeFile
                                ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>{resumeFile.name}</span>
                                : (user?.resume ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Resume already uploaded</span> : 'PDF, DOC or DOCX accepted')}
                        </span>
                        {user?.resume && (
                            <a href={user.resume} target="_blank" rel="noopener noreferrer"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '11px 18px', borderRadius: 12, background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                                View Current
                            </a>
                        )}
                    </div>
                </div>

                {/* ── Experience ── */}
                <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 24, padding: '32px', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                        <h3 style={{ ...SECTION_HEADER('#f59e0b'), marginBottom: 0 }}>
                            <span style={{ width: 3, height: 14, borderRadius: 2, background: 'linear-gradient(to bottom,#f59e0b,#ef4444)', display: 'inline-block' }} />
                            Work Experience
                        </h3>
                        <button type="button" onClick={addExperience}
                            style={{ padding: '8px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', background: '#fffbeb', border: '1px solid #fde68a', color: '#d97706' }}>
                            + Add Experience
                        </button>
                    </div>

                    {experience.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '32px', borderRadius: 16, background: '#fafafa', border: '2px dashed #e2e8f0' }}>
                            <p style={{ fontSize: 14, color: '#94a3b8', fontWeight: 500 }}>No experience added yet. Add your work history to stand out to recruiters.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {experience.map((exp, i) => (
                                <div key={i} style={{ padding: '22px', borderRadius: 16, background: '#fafafa', border: '1.5px solid #e2e8f0', position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, borderRadius: '16px 16px 0 0', background: `linear-gradient(90deg,${BAR_COLORS[i % BAR_COLORS.length]})` }} />
                                    <button type="button" onClick={() => removeExperience(i)}
                                        style={{ position: 'absolute', top: 16, right: 16, width: 28, height: 28, borderRadius: '50%', border: 'none', cursor: 'pointer', background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
                                    </button>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14, paddingRight: 40 }}>
                                        <div>
                                            <label style={{ ...LABEL, color: '#64748b' }}>Job Title</label>
                                            <input value={exp.title} onChange={e => handleExpChange(i, 'title', e.target.value)} placeholder="Senior Engineer"
                                                style={{ ...FIELD_STYLE, background: '#fff' }} onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                                        </div>
                                        <div>
                                            <label style={{ ...LABEL, color: '#64748b' }}>Company</label>
                                            <input value={exp.company} onChange={e => handleExpChange(i, 'company', e.target.value)} placeholder="Acme Corp"
                                                style={{ ...FIELD_STYLE, background: '#fff' }} onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: 14, width: '50%', paddingRight: 7 }}>
                                        <label style={{ ...LABEL, color: '#64748b' }}>Period</label>
                                        <input value={exp.period} onChange={e => handleExpChange(i, 'period', e.target.value)} placeholder="2021 – 2023"
                                            style={{ ...FIELD_STYLE, background: '#fff' }} onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                                    </div>
                                    <div>
                                        <label style={{ ...LABEL, color: '#64748b' }}>Description</label>
                                        <textarea value={exp.description} onChange={e => handleExpChange(i, 'description', e.target.value)} rows={3}
                                            placeholder="Describe your role, achievements, and impact…"
                                            style={{ ...FIELD_STYLE, background: '#fff', resize: 'vertical', lineHeight: 1.65 }}
                                            onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Security ── */}
                <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 24, padding: '32px', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', marginBottom: 28 }}>
                    <h3 style={SECTION_HEADER('#64748b')}>
                        <span style={{ width: 3, height: 14, borderRadius: 2, background: 'linear-gradient(to bottom,#64748b,#94a3b8)', display: 'inline-block' }} />
                        Security
                    </h3>
                    <div style={{ maxWidth: 400 }}>
                        <label style={LABEL}>Change Password <span style={{ fontSize: 11, fontWeight: 500, color: '#94a3b8' }}>(leave blank to keep current)</span></label>
                        <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" style={FIELD_STYLE}
                            onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                    </div>
                </div>

                {/* ── Submit ── */}
                <button type="submit" disabled={loading} style={{
                    width: '100%', padding: '15px', borderRadius: 16, border: 'none', cursor: 'pointer',
                    fontSize: 15, fontWeight: 800, color: '#fff',
                    background: loading ? '#94a3b8' : 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
                    boxShadow: loading ? 'none' : '0 6px 24px rgba(99,102,241,0.5)',
                    transition: 'all 0.2s',
                }}>
                    {loading ? 'Saving Changes…' : 'Save Profile Changes →'}
                </button>
            </form>
        </div>
    );
}

export default Profile;
