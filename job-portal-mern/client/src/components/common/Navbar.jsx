import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../hooks/useTheme";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => { logout(); navigate("/login"); };
    const isActive = (path) => location.pathname === path;

    const navLinks = user
        ? user.role === 'user'
            ? [
                { to: '/', label: 'Find Jobs' },
                { to: '/user', label: 'Dashboard' },
                { to: '/saved-jobs', label: 'Saved Jobs' },
                { to: '/job-alerts', label: 'Job Alerts' },
            ]
            : user.role === 'recruiter'
                ? [
                    { to: '/', label: 'Browse Jobs' },
                    { to: '/recruiter', label: 'Dashboard' },
                    { to: '/post-job', label: 'Post Job' },
                ]
                : [
                    { to: '/', label: 'Browse Jobs' },
                    { to: '/admin', label: 'Admin Panel' },
                ]
        : [{ to: '/', label: 'Find Jobs' }];

    const navbarBg = scrolled
        ? 'linear-gradient(135deg, rgba(15,23,42,0.97) 0%, rgba(30,41,59,0.97) 100%)'
        : 'linear-gradient(135deg, rgba(15,23,42,0.90) 0%, rgba(30,41,59,0.88) 100%)';

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 22 }}
            className="sticky top-0 z-50 w-full"
            style={{
                background: navbarBg,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: scrolled
                    ? '0 8px 40px rgba(0,0,0,0.35), 0 2px 12px rgba(59,130,246,0.15)'
                    : '0 4px 24px rgba(0,0,0,0.25)',
                transition: 'all 0.3s ease',
            }}
        >
            {/* Top gradient accent */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                background: 'linear-gradient(90deg, #06b6d4 0%, #3b82f6 40%, #8b5cf6 70%, #ec4899 100%)',
            }} />

            {/* Subtle inner glow */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'radial-gradient(ellipse 80% 120% at 50% -20%, rgba(59,130,246,0.18) 0%, transparent 70%)',
            }} />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="flex justify-between items-center h-20">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
                        <motion.div
                            whileHover={{ rotate: 5, scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                width: 42, height: 42, borderRadius: 12,
                                background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 4px 20px rgba(99,102,241,0.5)',
                            }}
                        >
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </motion.div>
                        <div className="hidden sm:block">
                            <span className="text-xl font-black tracking-tight text-white block leading-none">JobSphere</span>
                            <span className="text-[10px] font-semibold uppercase tracking-widest leading-none" style={{ color: 'rgba(148,163,184,0.8)' }}>Career Platform</span>
                        </div>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map(({ to, label }) => (
                            <Link
                                key={to}
                                to={to}
                                className="relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                                style={{
                                    color: isActive(to) ? '#93c5fd' : 'rgba(203,213,225,0.9)',
                                    background: isActive(to) ? 'rgba(59,130,246,0.15)' : 'transparent',
                                }}
                                onMouseEnter={e => { if (!isActive(to)) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                                onMouseLeave={e => { if (!isActive(to)) e.currentTarget.style.background = 'transparent'; }}
                            >
                                {label}
                                {isActive(to) && (
                                    <motion.span
                                        layoutId="activePill"
                                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                                        style={{ background: 'linear-gradient(90deg, #3b82f6, #6366f1)' }}
                                    />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Right side */}
                    <div className="hidden md:flex items-center gap-3">
                        {/* Theme toggle */}
                        <motion.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            style={{
                                width: 38, height: 38, borderRadius: 10,
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.12)',
                                color: '#94a3b8',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer',
                            }}
                        >
                            {theme === 'dark' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                                </svg>
                            )}
                        </motion.button>

                        {/* Separator */}
                        <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.12)' }} />

                        {user ? (
                            <div className="flex items-center gap-2">
                                <Link to="/profile" className="flex items-center gap-2.5 group">
                                    <div className="relative">
                                        <img
                                            src={user.avatar || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                                            alt={user.name}
                                            className="w-9 h-9 rounded-full object-cover"
                                            style={{ border: '2px solid rgba(99,102,241,0.6)', boxShadow: '0 0 12px rgba(99,102,241,0.4)' }}
                                        />
                                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900" />
                                    </div>
                                    <div className="hidden lg:block">
                                        <p className="text-sm font-bold text-white leading-tight">{user.name}</p>
                                        <p className="text-xs capitalize" style={{ color: 'rgba(148,163,184,0.7)' }}>{user.role}</p>
                                    </div>
                                </Link>
                                <motion.button
                                    whileHover={{ scale: 1.08 }}
                                    whileTap={{ scale: 0.92 }}
                                    onClick={handleLogout}
                                    title="Logout"
                                    style={{
                                        width: 36, height: 36, borderRadius: 8,
                                        background: 'rgba(239,68,68,0.12)',
                                        border: '1px solid rgba(239,68,68,0.25)',
                                        color: '#f87171',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', flexShrink: 0,
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                    </svg>
                                </motion.button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    to="/login"
                                    className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
                                    style={{
                                        color: 'rgba(203,213,225,0.9)',
                                        background: 'rgba(255,255,255,0.07)',
                                        border: '1px solid rgba(255,255,255,0.12)',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
                                >
                                    Log In
                                </Link>
                                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                                    <Link
                                        to="/register"
                                        className="px-5 py-2 rounded-lg text-sm font-bold text-white"
                                        style={{
                                            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                                            boxShadow: '0 4px 18px rgba(99,102,241,0.55), inset 0 1px 0 rgba(255,255,255,0.15)',
                                            display: 'block',
                                        }}
                                    >
                                        Get Started →
                                    </Link>
                                </motion.div>
                            </div>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <div className="flex md:hidden items-center gap-2">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleTheme}
                            style={{
                                width: 36, height: 36, borderRadius: 8,
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.12)',
                                color: '#94a3b8',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer',
                            }}
                        >
                            {theme === 'dark'
                                ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
                                : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
                            }
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            style={{
                                width: 36, height: 36, borderRadius: 8,
                                background: isMenuOpen ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.08)',
                                border: `1px solid ${isMenuOpen ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.12)'}`,
                                color: isMenuOpen ? '#a5b4fc' : '#94a3b8',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', transition: 'all 0.2s ease',
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"} />
                            </svg>
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22 }}
                        className="md:hidden absolute w-full overflow-hidden"
                        style={{
                            background: 'linear-gradient(180deg, rgba(15,23,42,0.98) 0%, rgba(23,31,55,0.98) 100%)',
                            backdropFilter: 'blur(20px)',
                            borderBottom: '1px solid rgba(99,102,241,0.2)',
                            boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
                        }}
                    >
                        <div className="p-4 space-y-1">
                            {navLinks.map(({ to, label }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                                    style={{
                                        color: isActive(to) ? '#93c5fd' : 'rgba(203,213,225,0.85)',
                                        background: isActive(to) ? 'rgba(59,130,246,0.15)' : 'transparent',
                                        border: isActive(to) ? '1px solid rgba(59,130,246,0.2)' : '1px solid transparent',
                                    }}
                                >
                                    {isActive(to) && (
                                        <span className="w-1 h-4 rounded-full flex-shrink-0" style={{ background: 'linear-gradient(to bottom, #3b82f6, #8b5cf6)' }} />
                                    )}
                                    {label}
                                </Link>
                            ))}

                            {user ? (
                                <>
                                    <div className="my-3" style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(99,102,241,0.3), transparent)' }} />
                                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                        <img
                                            src={user.avatar || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                                            className="w-10 h-10 rounded-full object-cover"
                                            style={{ border: '2px solid rgba(99,102,241,0.5)' }}
                                            alt={user.name}
                                        />
                                        <div>
                                            <p className="font-bold text-white">{user.name}</p>
                                            <p className="text-xs capitalize" style={{ color: 'rgba(148,163,184,0.7)' }}>{user.role}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                                        className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                                        style={{ color: '#f87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                        </svg>
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="grid grid-cols-2 gap-3 mt-3">
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="py-3 rounded-xl text-sm font-semibold text-center transition-all"
                                        style={{ color: 'rgba(203,213,225,0.9)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
                                    >
                                        Log In
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="py-3 rounded-xl text-sm font-bold text-center text-white"
                                        style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', boxShadow: '0 4px 15px rgba(99,102,241,0.4)' }}
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}

export default Navbar;
