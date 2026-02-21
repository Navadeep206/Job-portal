import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

const GRADIENT_BTN = {
  width: '100%', padding: '14px', borderRadius: 14, border: 'none', cursor: 'pointer',
  fontSize: 15, fontWeight: 700, color: '#fff',
  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
  boxShadow: '0 4px 20px rgba(99,102,241,0.45)',
  transition: 'all 0.2s',
  marginTop: 8,
};

const INPUT_STYLE = {
  width: '100%', padding: '13px 16px', borderRadius: 12, fontSize: 14,
  border: '1.5px solid #e2e8f0', outline: 'none', fontFamily: 'Inter,sans-serif',
  color: '#0f172a', background: '#fff', transition: 'border 0.2s', boxSizing: 'border-box',
};

const LABEL_STYLE = { fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6, display: 'block' };

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/login", { email, password });
      login(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* Left dark panel */}
      <div style={{
        display: 'none',
        width: '45%',
        background: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%)',
        position: 'relative', overflow: 'hidden', flexDirection: 'column',
        justifyContent: 'center', padding: '64px',
      }}
        className="lg-left-panel"
      >
        <style>{`@media(min-width:1024px){ .lg-left-panel{ display:flex !important; } }`}</style>

        {/* Glow orbs */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)', filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg,#3b82f6,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(99,102,241,0.5)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>
            </div>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#fff', fontFamily: 'Inter,sans-serif' }}>JobSphere</span>
          </div>

          <h2 style={{ fontSize: 40, fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: 16, fontFamily: 'Inter,sans-serif' }}>
            Land your<br />dream career
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(203,213,225,0.8)', lineHeight: 1.7, marginBottom: 40, maxWidth: 360 }}>
            Thousands of companies are hiring right now. Sign in to see jobs matched to your profile and skills.
          </p>

          {/* Social proof */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', borderRadius: 16, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', maxWidth: 340 }}>
            <div style={{ display: 'flex' }}>
              {[10, 11, 12, 13].map(i => (
                <img key={i} src={`https://i.pravatar.cc/80?img=${i}`} alt="" style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid #1e1b4b', marginLeft: i === 10 ? 0 : -10, objectFit: 'cover' }} />
              ))}
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>10,000+ hired</p>
              <p style={{ fontSize: 12, color: 'rgba(148,163,184,0.8)' }}>through JobSphere this year</p>
            </div>
          </div>
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

          {/* Card */}
          <div style={{
            background: 'rgba(255,255,255,0.95)', borderRadius: 28,
            border: '1.5px solid #e2e8f0', padding: '40px 36px',
            boxShadow: '0 20px 60px rgba(59,130,246,0.1), 0 4px 20px rgba(0,0,0,0.06)',
          }}>
            {/* Logo (mobile) */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 32 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg,#3b82f6,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(99,102,241,0.4)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>
              </div>
              <span style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', fontFamily: 'Inter,sans-serif' }}>JobSphere</span>
            </Link>

            <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', marginBottom: 6, fontFamily: 'Inter,sans-serif' }}>Welcome back</h1>
            <p style={{ fontSize: 14, color: '#64748b', marginBottom: 28 }}>Enter your credentials to access your account</p>

            {error && (
              <div style={{ padding: '12px 16px', borderRadius: 12, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
                Error: {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={LABEL_STYLE}>Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
                  style={INPUT_STYLE}
                  onFocus={e => e.target.style.borderColor = '#3b82f6'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ ...LABEL_STYLE, marginBottom: 0 }}>Password</label>
                  <Link to="/forgot-password" style={{ fontSize: 12, fontWeight: 700, color: '#3b82f6', textDecoration: 'none' }}>Forgot password?</Link>
                </div>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                  style={INPUT_STYLE}
                  onFocus={e => e.target.style.borderColor = '#3b82f6'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
              <button type="submit" disabled={loading} style={{ ...GRADIENT_BTN, opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Signing in…' : 'Sign In →'}
              </button>
            </form>

            <p style={{ marginTop: 24, textAlign: 'center', fontSize: 14, color: '#64748b' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#3b82f6', fontWeight: 700, textDecoration: 'none' }}>Sign up free</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
