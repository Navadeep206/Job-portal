import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";

const FIELD_STYLE = {
    width: '100%', padding: '13px 16px', borderRadius: 12, fontSize: 14,
    border: '1.5px solid #e2e8f0', outline: 'none', fontFamily: 'Inter,sans-serif',
    color: '#0f172a', background: '#fff', transition: 'border 0.2s', boxSizing: 'border-box',
};
const LABEL = { fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6, display: 'block' };

function EditJob() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        title: '', company: '', location: '', type: 'Full-time',
        about: '', description: '', salary: '', requirements: '', experience: '',
    });

    useEffect(() => {
        API.get(`/jobs/${id}`)
            .then(res => {
                const j = res.data.job;
                setForm({ title: j.title || '', company: j.company || '', location: j.location || '', type: j.type || 'Full-time', about: j.about || '', description: j.description || '', salary: j.salary || '', requirements: j.requirements || '', experience: j.experience || '' });
            })
            .catch(() => setError('Failed to load job details'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            await API.put(`/jobs/${id}`, form);
            navigate('/recruiter');
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to update job.');
        } finally {
            setSaving(false);
        }
    };

    const F = ({ label, name, type = 'text', placeholder = '', required = false, rows }) => (
        <div>
            <label style={LABEL}>{label}{required && <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span>}</label>
            {rows ? (
                <textarea name={name} value={form[name]} onChange={handleChange} rows={rows} placeholder={placeholder} required={required}
                    style={{ ...FIELD_STYLE, resize: 'vertical', lineHeight: 1.6 }}
                    onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
            ) : (
                <input name={name} type={type} value={form[name]} onChange={handleChange} placeholder={placeholder} required={required}
                    style={FIELD_STYLE} onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
            )}
        </div>
    );

    if (loading) return (
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <div style={{ height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.6)', border: '1px solid #e2e8f0', marginBottom: 20, width: '40%' }} />
            <div style={{ height: 400, borderRadius: 24, background: 'rgba(255,255,255,0.6)', border: '1px solid #e2e8f0' }} />
        </div>
    );

    return (
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', marginBottom: 4, fontFamily: 'Inter,sans-serif' }}>Edit Job Posting</h1>
                <p style={{ fontSize: 14, color: '#64748b' }}>Update the job details below</p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 28, padding: '40px', border: '1.5px solid #e2e8f0', boxShadow: '0 8px 40px rgba(59,130,246,0.08)' }}>
                {error && (
                    <div style={{ padding: '12px 16px', borderRadius: 12, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: 13, fontWeight: 600, marginBottom: 28 }}>Error: {error}</div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div>
                        <h3 style={{ fontSize: 13, fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ width: 3, height: 14, borderRadius: 2, background: 'linear-gradient(to bottom,#3b82f6,#8b5cf6)', display: 'inline-block' }} /> Basic Information
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                            <F label="Job Title" name="title" required />
                            <F label="Company Name" name="company" required />
                        </div>
                    </div>

                    <div>
                        <h3 style={{ fontSize: 13, fontWeight: 800, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ width: 3, height: 14, borderRadius: 2, background: 'linear-gradient(to bottom,#8b5cf6,#ec4899)', display: 'inline-block' }} /> Job Details
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18, marginBottom: 18 }}>
                            <F label="Location" name="location" required />
                            <div>
                                <label style={LABEL}>Job Type</label>
                                <select name="type" value={form.type} onChange={handleChange} style={FIELD_STYLE}
                                    onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#e2e8f0'}>
                                    {['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'].map(t => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={LABEL}>Experience Level</label>
                                <select name="experience" value={form.experience} onChange={handleChange} style={FIELD_STYLE}
                                    onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#e2e8f0'}>
                                    <option value="">Select Level</option>
                                    {['Entry Level', 'Mid Level', 'Senior Level', 'Director', 'Executive'].map(t => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>
                        <F label="Salary Range (Optional)" name="salary" placeholder="e.g. $80k - $120k" />
                    </div>

                    <div>
                        <h3 style={{ fontSize: 13, fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ width: 3, height: 14, borderRadius: 2, background: 'linear-gradient(to bottom,#10b981,#06b6d4)', display: 'inline-block' }} /> Description
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                            <F label="About Company" name="about" required rows={3} />
                            <F label="Job Description" name="description" required rows={5} />
                            <F label="Requirements" name="requirements" required rows={4} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 24, borderTop: '1px solid #e2e8f0' }}>
                        <button type="button" onClick={() => navigate('/recruiter')}
                            style={{ padding: '12px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', background: '#f8fafc', border: '1.5px solid #e2e8f0', color: '#64748b' }}>
                            Cancel
                        </button>
                        <button type="submit" disabled={saving}
                            style={{ padding: '12px 32px', borderRadius: 14, fontSize: 14, fontWeight: 700, cursor: 'pointer', border: 'none', color: '#fff', background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', boxShadow: '0 4px 18px rgba(99,102,241,0.45)', opacity: saving ? 0.7 : 1 }}>
                            {saving ? 'Saving…' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditJob;
