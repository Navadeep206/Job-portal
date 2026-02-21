import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
    FileText, Search, Bookmark, Bell, Settings,
    LayoutDashboard, PenSquare, Users, Briefcase,
    PieChart, UserCircle, LogOut
} from 'lucide-react';

const AVATAR_COLORS = [
    'linear-gradient(135deg,#3b82f6,#6366f1)',
    'linear-gradient(135deg,#8b5cf6,#ec4899)',
    'linear-gradient(135deg,#06b6d4,#3b82f6)',
    'linear-gradient(135deg,#10b981,#059669)',
    'linear-gradient(135deg,#f59e0b,#ef4444)',
];
function getColor(name = '') {
    let h = 0; for (const c of name) h += c.charCodeAt(0);
    return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

function Sidebar() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => location.pathname === path;

    if (!user) return null;

    const navLinks = {
        user: [
            { path: "/user", label: "My Applications", icon: <FileText size={18} /> },
            { path: "/", label: "Find Jobs", icon: <Search size={18} /> },
            { path: "/saved-jobs", label: "Saved Jobs", icon: <Bookmark size={18} /> },
            { path: "/job-alerts", label: "Job Alerts", icon: <Bell size={18} /> },
            { path: "/profile", label: "Edit Profile", icon: <Settings size={18} /> },
        ],
        recruiter: [
            { path: "/recruiter", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
            { path: "/post-job", label: "Post a Job", icon: <PenSquare size={18} /> },
            { path: "/applicants", label: "Applicants", icon: <Users size={18} /> },
            { path: "/profile", label: "Profile", icon: <UserCircle size={18} /> },
        ],
        admin: [
            { path: "/admin", label: "Overview", icon: <PieChart size={18} /> },
            { path: "/admin/users", label: "Manage Users", icon: <Users size={18} /> },
            { path: "/admin/jobs", label: "Manage Jobs", icon: <Briefcase size={18} /> },
            { path: "/profile", label: "Profile", icon: <Settings size={18} /> },
        ],
    };

    const links = navLinks[user.role] || [];
    const initials = user.name ? user.name.slice(0, 2).toUpperCase() : 'U';
    const avatarBg = getColor(user.name);

    const roleLabels = { user: 'User Workspace', recruiter: 'Recruiter Hub', admin: 'Admin Panel' };

    return (
        <aside
            className="fixed left-0 top-0 h-screen w-64 hidden md:flex flex-col z-30"
            style={{
                background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%)',
                borderRight: '1px solid rgba(99,102,241,0.15)',
                boxShadow: '4px 0 32px rgba(0,0,0,0.25)',
            }}
        >
            {/* Top gradient line */}
            <div style={{ height: 3, background: 'linear-gradient(90deg,#3b82f6,#8b5cf6,#06b6d4)', flexShrink: 0 }} />

            {/* Logo area */}
            <div style={{ padding: '20px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(99,102,241,0.5)',
                        flexShrink: 0,
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                        </svg>
                    </div>
                    <div>
                        <span style={{ fontWeight: 900, fontSize: 16, color: '#fff', fontFamily: 'Inter,sans-serif', display: 'block', lineHeight: 1 }}>JobSphere</span>
                        <span style={{ fontSize: 10, color: 'rgba(148,163,184,0.7)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Career Platform</span>
                    </div>
                </Link>
            </div>

            {/* Workspace label */}
            <div style={{ padding: '16px 20px 8px', flexShrink: 0 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(148,163,184,0.5)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                    {roleLabels[user.role] || 'Workspace'}
                </p>
            </div>

            {/* Nav links */}
            <nav style={{ flex: 1, overflowY: 'auto', padding: '4px 12px' }}>
                {links.map((link) => {
                    const active = isActive(link.path);
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                padding: '10px 14px', borderRadius: 12, marginBottom: 2,
                                textDecoration: 'none', fontSize: 14, fontWeight: 600,
                                transition: 'all 0.2s',
                                background: active ? 'rgba(99,102,241,0.2)' : 'transparent',
                                color: active ? '#a5b4fc' : 'rgba(203,213,225,0.7)',
                                border: active ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                            }}
                            onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#fff'; } }}
                            onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(203,213,225,0.7)'; } }}
                        >
                            {active && (
                                <span style={{ position: 'absolute', left: 0, width: 3, height: 24, borderRadius: '0 4px 4px 0', background: 'linear-gradient(to bottom,#3b82f6,#8b5cf6)' }} />
                            )}
                            <span style={{ color: active ? '#818cf8' : 'rgba(148,163,184,0.6)', flexShrink: 0 }}>{link.icon}</span>
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            {/* User footer */}
            <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                    borderRadius: 14, background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                }}>
                    <div style={{
                        width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                        background: avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14, fontWeight: 800, color: '#fff',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    }}>
                        {initials}
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</p>
                        <p style={{ fontSize: 11, color: 'rgba(148,163,184,0.6)', textTransform: 'capitalize' }}>{user.role}</p>
                    </div>
                    <button
                        onClick={() => { logout(); navigate('/login'); }}
                        title="Logout"
                        style={{
                            width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer',
                            background: 'rgba(239,68,68,0.12)', color: '#f87171',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, transition: 'all 0.2s',
                        }}
                    >
                        <LogOut size={15} />
                    </button>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
