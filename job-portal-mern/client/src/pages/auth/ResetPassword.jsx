import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../../services/api";

const INPUT = { width: '100%', padding: '13px 16px', borderRadius: 12, fontSize: 14, border: '2px solid #e2e8f0', outline: 'none', fontFamily: 'Inter,sans-serif', color: '#111827', background: '#fff', transition: 'border-color 0.18s', boxSizing: 'border-box' };
const LABEL = { display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 7 };

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) { setError("Passwords do not match"); return; }
        setLoading(true); setError("");
        try {
            await API.put(`/auth/reset-password/${token}`, { password });
            setSuccess(true);
            setTimeout(() => navigate("/login"), 3500);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reset password. Link may have expired.");
        } finally { setLoading(false); }
    };

    const mismatch = confirmPassword && confirmPassword !== password;

    return (
        <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Inter,sans-serif' }}>
            {/* Left dark panel */}
            <div style={{ width: '42%', background: 'linear-gradient(145deg,#0f172a 0%,#1e1b4b 60%,#0f172a 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '64px 56px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                    <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.3) 0%,transparent 70%)', filter: 'blur(50px)' }} />
                    <div style={{ position: 'absolute', bottom: '-15%', right: '-15%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,0.25) 0%,transparent 70%)', filter: 'blur(50px)' }} />
                </div>
                <Link to="/" style={{ textDecoration: 'none', marginBottom: 56 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>
                        </div>
                        <span style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>JobSphere</span>
                    </div>
                </Link>
                <div style={{ width: 80, height: 80, borderRadius: 24, background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(165,180,252,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
                    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                </div>
                <h2 style={{ fontSize: 28, fontWeight: 900, color: '#fff', marginBottom: 12 }}>Set a new password</h2>
                <p style={{ fontSize: 15, color: 'rgba(203,213,225,0.75)', lineHeight: 1.65, marginBottom: 40 }}>Choose a strong password to protect your account.</p>
                {['Minimum 6 characters', 'Mix letters, numbers & symbols', 'Never share your password'].map((t, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(99,102,241,0.3)', border: '1px solid rgba(165,180,252,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                        </div>
                        <span style={{ fontSize: 14, color: 'rgba(203,213,225,0.8)' }}>{t}</span>
                    </div>
                ))}
            </div>

            {/* Right form panel */}
            <div style={{ flex: 1, background: 'linear-gradient(160deg,#f0f6ff 0%,#eef2ff 50%,#faf5ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
                <div style={{ width: '100%', maxWidth: 420, background: 'rgba(255,255,255,0.9)', borderRadius: 28, padding: '44px 40px', border: '1.5px solid #e2e8f0', boxShadow: '0 24px 80px rgba(99,102,241,0.12)', backdropFilter: 'blur(10px)' }}>
                    {success ? (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ width: 80, height: 80, borderRadius: 24, background: '#f0fdf4', border: '1.5px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                            </div>
                            <h3 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', marginBottom: 8 }}>Password Reset!</h3>
                            <p style={{ fontSize: 14, color: '#64748b', marginBottom: 28 }}>Your password has been updated. Redirecting to login…</p>
                            <Link to="/login" style={{ display: 'block', padding: '13px', borderRadius: 14, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontWeight: 800, fontSize: 14, textDecoration: 'none', textAlign: 'center' }}>Go to Login</Link>
                        </div>
                    ) : (
                        <>
                            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                                <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', marginBottom: 6 }}>New Password</h2>
                                <p style={{ fontSize: 14, color: '#64748b' }}>Enter and confirm your new password</p>
                            </div>
                            {error && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px', borderRadius: 12, background: '#fef2f2', border: '1.5px solid #fecaca', color: '#dc2626', fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                                <div>
                                    <label style={LABEL}>New Password <span style={{ color: '#ef4444' }}>*</span></label>
                                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters" required minLength={6} style={INPUT}
                                        onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                                </div>
                                <div>
                                    <label style={LABEL}>Confirm Password <span style={{ color: '#ef4444' }}>*</span></label>
                                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Re-enter your password" required minLength={6}
                                        style={{ ...INPUT, borderColor: mismatch ? '#fca5a5' : '#e2e8f0' }}
                                        onFocus={e => e.target.style.borderColor = mismatch ? '#fca5a5' : '#6366f1'}
                                        onBlur={e => e.target.style.borderColor = mismatch ? '#fca5a5' : '#e2e8f0'} />
                                    {mismatch && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 4, fontWeight: 600 }}>Passwords do not match</p>}
                                </div>
                                <button type="submit" disabled={loading} style={{ padding: '14px', borderRadius: 14, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 800, color: '#fff', background: loading ? '#94a3b8' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: loading ? 'none' : '0 4px 20px rgba(99,102,241,0.45)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                    {loading ? 'Resetting…' : 'Reset Password'}
                                </button>
                            </form>
                            <div style={{ textAlign: 'center', marginTop: 24 }}>
                                <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#6366f1', textDecoration: 'none' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                                    Back to Login
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
