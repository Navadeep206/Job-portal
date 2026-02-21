import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

/* ── Shared style tokens ─────────────────────────────────── */
const INPUT = {
    width: '100%', padding: '12px 14px', borderRadius: 10, fontSize: 14,
    border: '2px solid #e2e8f0', outline: 'none', fontFamily: 'Inter,sans-serif',
    color: '#111827', background: '#fff', transition: 'border-color 0.18s',
    boxSizing: 'border-box', appearance: 'none', WebkitAppearance: 'none',
};
const LABEL = {
    display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6,
};
const REQ = { color: '#ef4444', marginLeft: 2 };

const SECTION_TITLE = (color, gradient) => ({
    display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 14,
    borderBottom: '1.5px solid #f1f5f9',
    fontSize: 12, fontWeight: 800, color, textTransform: 'uppercase', letterSpacing: '0.1em',
});

const CaretDown = () => (
    <svg style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

function Select({ label, name, value, onChange, options, required, placeholder }) {
    return (
        <div>
            <label style={LABEL}>{label}{required && <span style={REQ}>*</span>}</label>
            <div style={{ position: 'relative' }}>
                <select
                    name={name} value={value} onChange={onChange} required={required}
                    style={{ ...INPUT, paddingRight: 36, cursor: 'pointer' }}
                    onFocus={e => e.target.style.borderColor = '#6366f1'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                >
                    {placeholder && <option value="">{placeholder}</option>}
                    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <CaretDown />
            </div>
        </div>
    );
}

function Field({ label, name, value, onChange, placeholder = '', required = false, rows }) {
    return (
        <div>
            <label style={LABEL}>{label}{required && <span style={REQ}>*</span>}</label>
            {rows ? (
                <textarea
                    name={name} value={value} onChange={onChange} rows={rows}
                    placeholder={placeholder} required={required}
                    style={{ ...INPUT, resize: 'vertical', lineHeight: 1.65 }}
                    onFocus={e => e.target.style.borderColor = '#6366f1'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
            ) : (
                <input
                    name={name} type="text" value={value} onChange={onChange}
                    placeholder={placeholder} required={required} style={INPUT}
                    onFocus={e => e.target.style.borderColor = '#6366f1'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
            )}
        </div>
    );
}

/* ── Main component ──────────────────────────────────────── */
function PostJob() {
    const [form, setForm] = useState({
        title: '', company: '', location: '', type: 'Full-time',
        about: '', description: '', salary: '', requirements: '', experience: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            await API.post('/jobs', form);
            navigate('/recruiter');
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to post job. Please try again.');
        } finally { setLoading(false); }
    };

    const JOB_TYPES = [
        { value: 'Full-time', label: 'Full-time' }, { value: 'Part-time', label: 'Part-time' },
        { value: 'Contract', label: 'Contract' }, { value: 'Internship', label: 'Internship' },
        { value: 'Remote', label: 'Remote' },
    ];
    const EXP_LEVELS = [
        { value: 'Entry Level', label: 'Entry Level' }, { value: 'Mid Level', label: 'Mid Level' },
        { value: 'Senior Level', label: 'Senior Level' }, { value: 'Director', label: 'Director' },
        { value: 'Executive', label: 'Executive' },
    ];

    return (
        <div style={{ maxWidth: 900, margin: '0 auto' }}>

            {/* Page header */}
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', marginBottom: 4, fontFamily: 'Inter,sans-serif' }}>
                    Post a New Job
                </h1>
                <p style={{ fontSize: 14, color: '#64748b' }}>Fill in the details below to attract the best candidates</p>
            </div>

            {/* Error banner */}
            {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 16px', borderRadius: 12, background: '#fef2f2', border: '1.5px solid #fecaca', color: '#dc2626', fontSize: 13, fontWeight: 600, marginBottom: 24 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* ── Section 1: Basic Information ── */}
                <div style={{ background: '#fff', borderRadius: 20, padding: '28px 28px 24px', border: '1.5px solid #e2e8f0', boxShadow: '0 2px 16px rgba(99,102,241,0.06)' }}>
                    <div style={SECTION_TITLE('#6366f1')}>
                        <span style={{ display: 'inline-block', width: 4, height: 18, borderRadius: 3, background: 'linear-gradient(to bottom,#6366f1,#818cf8)', flexShrink: 0 }} />
                        Basic Information
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                        <Field label="Job Title" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Senior React Developer" required />
                        <Field label="Company Name" name="company" value={form.company} onChange={handleChange} placeholder="e.g. Tech Corp" required />
                    </div>
                </div>

                {/* ── Section 2: Job Details ── */}
                <div style={{ background: '#fff', borderRadius: 20, padding: '28px 28px 24px', border: '1.5px solid #e2e8f0', boxShadow: '0 2px 16px rgba(139,92,246,0.06)' }}>
                    <div style={SECTION_TITLE('#8b5cf6')}>
                        <span style={{ display: 'inline-block', width: 4, height: 18, borderRadius: 3, background: 'linear-gradient(to bottom,#8b5cf6,#a78bfa)', flexShrink: 0 }} />
                        Job Details
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18, marginBottom: 18 }}>
                        <Field label="Location" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Remote, NYC" required />
                        <Select label="Job Type" name="type" value={form.type} onChange={handleChange} options={JOB_TYPES} />
                        <Select label="Experience Level" name="experience" value={form.experience} onChange={handleChange} options={EXP_LEVELS} placeholder="Select Level" required />
                    </div>
                    <Field label="Salary Range" name="salary" value={form.salary} onChange={handleChange} placeholder="e.g. $80k – $120k or Competitive (optional)" />
                </div>

                {/* ── Section 3: Description ── */}
                <div style={{ background: '#fff', borderRadius: 20, padding: '28px 28px 24px', border: '1.5px solid #e2e8f0', boxShadow: '0 2px 16px rgba(16,185,129,0.06)' }}>
                    <div style={SECTION_TITLE('#10b981')}>
                        <span style={{ display: 'inline-block', width: 4, height: 18, borderRadius: 3, background: 'linear-gradient(to bottom,#10b981,#34d399)', flexShrink: 0 }} />
                        Description
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                        <Field label="About Company" name="about" value={form.about} onChange={handleChange} placeholder="Brief overview of your company, culture, and mission…" required rows={3} />
                        <Field label="Job Description" name="description" value={form.description} onChange={handleChange} placeholder="Describe the role, key responsibilities, and what success looks like…" required rows={5} />
                        <Field label="Requirements" name="requirements" value={form.requirements} onChange={handleChange} placeholder="List the qualifications, skills, and experience required…" required rows={4} />
                    </div>
                </div>

                {/* ── Actions ── */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 4 }}>
                    <button
                        type="button" onClick={() => navigate('/recruiter')}
                        style={{ padding: '12px 26px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', background: '#f8fafc', border: '1.5px solid #e2e8f0', color: '#475569', transition: 'all 0.2s' }}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit" disabled={loading}
                        style={{ padding: '12px 36px', borderRadius: 14, fontSize: 14, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', border: 'none', color: '#fff', background: loading ? '#94a3b8' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: loading ? 'none' : '0 4px 20px rgba(99,102,241,0.45)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                        {loading ? (
                            <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                                Posting…
                            </>
                        ) : (
                            <>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                Post Job
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default PostJob;
