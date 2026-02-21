import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

const GRADIENT_BTN = {
  width: '100%', padding: '14px', borderRadius: 14, border: 'none', cursor: 'pointer',
  fontSize: 15, fontWeight: 700, color: '#fff',
  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
  boxShadow: '0 4px 20px rgba(99,102,241,0.45)',
  transition: 'all 0.2s', marginTop: 8,
};

const INPUT_STYLE = {
  width: '100%', padding: '13px 16px', borderRadius: 12, fontSize: 14,
  border: '1.5px solid #e2e8f0', outline: 'none', fontFamily: 'Inter,sans-serif',
  color: '#0f172a', background: '#fff', transition: 'border 0.2s', boxSizing: 'border-box',
};

const LABEL_STYLE = { fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6, display: 'block' };

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/register", form);
      login(res.data);
      navigate("/");
    } catch (err) {
      const msg = err.code === "ERR_NETWORK"
        ? "Network Error: Is the server running?"
        : err?.response?.data?.message || "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* Left dark panel */}
      <div
        className="lg-left-panel"
        style={{
          display: 'none', width: '45%',
          background: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%)',
          position: 'relative', overflow: 'hidden', flexDirection: 'column',
          justifyContent: 'center', padding: '64px',
        }}
      >
        <style>{`@media(min-width:1024px){ .lg-left-panel{ display:flex !important; } }`}</style>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)', filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48, textDecoration: 'none' }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg,#3b82f6,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(99,102,241,0.5)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>
            </div>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#fff', fontFamily: 'Inter,sans-serif' }}>JobSphere</span>
          </Link>

          <h2 style={{ fontSize: 40, fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: 16, fontFamily: 'Inter,sans-serif' }}>
            Start your<br />journey today
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(203,213,225,0.8)', lineHeight: 1.7, marginBottom: 40, maxWidth: 360 }}>
            Create your free account and get access to thousands of job listings from top employers worldwide.
          </p>

          {/* Features */}
          {[
            { text: 'Free to use — no credit card required' },
            { text: 'Apply to jobs with one click' },
            { text: 'Get matched with the right opportunities' },
          ].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(99,102,241,0.3)', border: '1px solid rgba(165,180,252,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <span style={{ fontSize: 15, color: 'rgba(203,213,225,0.85)' }}>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '32px 24px',
        background: 'linear-gradient(160deg, #f0f6ff 0%, #eef2ff 50%, #faf5ff 100%)',
        minHeight: '100vh',
      }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          <div style={{
            background: 'rgba(255,255,255,0.95)', borderRadius: 28,
            border: '1.5px solid #e2e8f0', padding: '40px 36px',
            boxShadow: '0 20px 60px rgba(59,130,246,0.1), 0 4px 20px rgba(0,0,0,0.06)',
          }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 32 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg,#3b82f6,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(99,102,241,0.4)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>
              </div>
              <span style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', fontFamily: 'Inter,sans-serif' }}>JobSphere</span>
            </Link>

            <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', marginBottom: 6, fontFamily: 'Inter,sans-serif' }}>Create your account</h1>
            <p style={{ fontSize: 14, color: '#64748b', marginBottom: 28 }}>Fill in your details to get started for free</p>

            {error && (
              <div style={{ padding: '12px 16px', borderRadius: 12, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
                Error: {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={LABEL_STYLE}>Full Name</label>
                <input name="name" type="text" value={form.name} onChange={handleChange} required placeholder="John Doe"
                  style={INPUT_STYLE} onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              </div>
              <div>
                <label style={LABEL_STYLE}>Email Address</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@example.com"
                  style={INPUT_STYLE} onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              </div>
              <div>
                <label style={LABEL_STYLE}>Password</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Min. 6 characters"
                  style={INPUT_STYLE} onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              </div>
              <div>
                <label style={LABEL_STYLE}>I am a…</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[
                    { value: 'user', label: 'Job Seeker', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> },
                    { value: 'recruiter', label: 'Recruiter', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg> },
                  ].map(opt => (
                    <button
                      key={opt.value} type="button"
                      onClick={() => setForm({ ...form, role: opt.value })}
                      style={{
                        padding: '12px', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                        background: form.role === opt.value ? 'linear-gradient(135deg,#eff6ff,#eef2ff)' : '#f8fafc',
                        border: form.role === opt.value ? '2px solid #3b82f6' : '2px solid #e2e8f0',
                        color: form.role === opt.value ? '#1d4ed8' : '#64748b',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{opt.icon}</span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" disabled={loading} style={{ ...GRADIENT_BTN, opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Creating Account…' : 'Create Free Account →'}
              </button>
            </form>

            <p style={{ marginTop: 24, textAlign: 'center', fontSize: 14, color: '#64748b' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#3b82f6', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
