import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../ui/Button";
import { useTheme } from "../../hooks/useTheme";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path ? "bg-indigo-50 dark:bg-indigo-900/30 text-primary dark:text-indigo-300" : "text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-indigo-300 hover:bg-slate-50 dark:hover:bg-slate-800";

    const navItemVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                type: "spring",
                stiffness: 100
            }
        })
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="sticky top-0 z-50 w-full glass border-b border-slate-200/50 dark:border-slate-800/50"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <motion.div
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-gradient-primary text-white p-2 rounded-xl shadow-lg shadow-primary/30"
                        >
                            <img src="/logo.svg" alt="JobSphere Logo" className="w-6 h-6 text-white invert" />
                        </motion.div>
                        <span className="text-xl font-bold font-display bg-gradient-primary bg-clip-text text-transparent">
                            JobSphere
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-2">
                        <Link to="/" className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${isActive("/")}`}>
                            Find Jobs
                        </Link>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 mr-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                            aria-label="Toggle Dark Mode"
                        >
                            {theme === 'dark' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                                </svg>
                            )}
                        </button>

                        {user ? (
                            <>
                                <AnimatePresence>
                                    {user.role === 'user' && (
                                        <>
                                            <motion.div initial="hidden" animate="visible" custom={1} variants={navItemVariants}>
                                                <Link to="/user" className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${isActive("/user")}`}>
                                                    Dashboard
                                                </Link>
                                            </motion.div>
                                            <motion.div initial="hidden" animate="visible" custom={2} variants={navItemVariants}>
                                                <Link to="/saved-jobs" className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${isActive("/saved-jobs")}`}>
                                                    Saved Jobs
                                                </Link>
                                            </motion.div>
                                            <motion.div initial="hidden" animate="visible" custom={3} variants={navItemVariants}>
                                                <Link to="/job-alerts" className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${isActive("/job-alerts")}`}>
                                                    Job Alerts
                                                </Link>
                                            </motion.div>
                                        </>
                                    )}
                                    {user.role === 'recruiter' && (
                                        <>
                                            <motion.div initial="hidden" animate="visible" custom={1} variants={navItemVariants}>
                                                <Link to="/recruiter" className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${isActive("/recruiter")}`}>
                                                    Dashboard
                                                </Link>
                                            </motion.div>
                                            <motion.div initial="hidden" animate="visible" custom={2} variants={navItemVariants}>
                                                <Link to="/post-job" className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${isActive("/post-job")}`}>
                                                    Post Job
                                                </Link>
                                            </motion.div>
                                        </>
                                    )}
                                    {user.role === 'admin' && (
                                        <motion.div initial="hidden" animate="visible" custom={1} variants={navItemVariants}>
                                            <Link to="/admin" className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${isActive("/admin")}`}>
                                                Admin Panel
                                            </Link>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="h-6 w-px bg-slate-200 mx-2"></div>

                                <div className="flex items-center gap-3 pl-2">
                                    <Link to="/profile" className="flex items-center gap-3 group">
                                        <div className="text-right hidden lg:block">
                                            <p className="text-sm font-semibold text-slate-800 leading-none group-hover:text-primary transition-colors">{user.name}</p>
                                            <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                                        </div>
                                        <motion.img
                                            whileHover={{ scale: 1.1 }}
                                            src={user.avatar || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                                            alt="Profile"
                                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm group-hover:border-primary transition-colors"
                                        />
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleLogout}
                                        className="text-slate-500 hover:text-error hover:bg-red-50"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                        </svg>
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login">
                                    <Button variant="ghost">Login</Button>
                                </Link>
                                <Link to="/register">
                                    <Button variant="primary">Register Now</Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"} />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl absolute w-full shadow-lg overflow-hidden"
                    >
                        <div className="p-4 space-y-2">
                            <Link to="/" className={`block px-4 py-3 rounded-xl text-base font-medium ${isActive("/")}`} onClick={() => setIsMenuOpen(false)}>
                                Find Jobs
                            </Link>
                            {user ? (
                                <>
                                    {user.role === 'user' && (
                                        <>
                                            <Link to="/user" className={`block px-4 py-3 rounded-xl text-base font-medium ${isActive("/user")}`} onClick={() => setIsMenuOpen(false)}>
                                                Dashboard
                                            </Link>
                                            <Link to="/saved-jobs" className={`block px-4 py-3 rounded-xl text-base font-medium ${isActive("/saved-jobs")}`} onClick={() => setIsMenuOpen(false)}>
                                                Saved Jobs
                                            </Link>
                                            <Link to="/job-alerts" className={`block px-4 py-3 rounded-xl text-base font-medium ${isActive("/job-alerts")}`} onClick={() => setIsMenuOpen(false)}>
                                                Job Alerts
                                            </Link>
                                        </>
                                    )}
                                    {user.role === 'recruiter' && (
                                        <>
                                            <Link to="/recruiter" className={`block px-4 py-3 rounded-xl text-base font-medium ${isActive("/recruiter")}`} onClick={() => setIsMenuOpen(false)}>
                                                Dashboard
                                            </Link>
                                            <Link to="/post-job" className={`block px-4 py-3 rounded-xl text-base font-medium ${isActive("/post-job")}`} onClick={() => setIsMenuOpen(false)}>
                                                Post Job
                                            </Link>
                                        </>
                                    )}
                                    {user.role === 'admin' && (
                                        <Link to="/admin" className={`block px-4 py-3 rounded-xl text-base font-medium ${isActive("/admin")}`} onClick={() => setIsMenuOpen(false)}>
                                            Admin
                                        </Link>
                                    )}
                                    <div className="border-t border-slate-100 my-2 pt-2">
                                        <div className="px-4 py-2 flex items-center gap-3">
                                            <img
                                                src={user.avatar || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                                                alt="Profile"
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <div>
                                                <p className="font-semibold text-slate-800">{user.name}</p>
                                                <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                                            </div>
                                        </div>
                                        <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium mt-2">
                                            Logout
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                                        <Button variant="secondary" className="w-full">Login</Button>
                                    </Link>
                                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                                        <Button variant="primary" className="w-full">Register</Button>
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
