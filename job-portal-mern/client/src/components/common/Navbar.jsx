import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path ? "bg-indigo-50 text-primary" : "text-slate-600 hover:bg-slate-50 hover:text-primary";

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
            className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm backdrop-blur-sm bg-white/90"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <motion.div
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-primary text-white p-1.5 rounded-lg transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                            </svg>
                        </motion.div>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            JobPortal
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-2">
                        <Link to="/" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive("/")}`}>
                            Find Jobs
                        </Link>

                        {user ? (
                            <>
                                <AnimatePresence>
                                    {user.role === 'user' && (
                                        <motion.div initial="hidden" animate="visible" custom={1} variants={navItemVariants}>
                                            <Link to="/user" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive("/user")}`}>
                                                My Dashboard
                                            </Link>
                                        </motion.div>
                                    )}
                                    {user.role === 'recruiter' && (
                                        <>
                                            <motion.div initial="hidden" animate="visible" custom={1} variants={navItemVariants}>
                                                <Link to="/recruiter" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive("/recruiter")}`}>
                                                    Recruiter Dashboard
                                                </Link>
                                            </motion.div>
                                            <motion.div initial="hidden" animate="visible" custom={2} variants={navItemVariants}>
                                                <Link to="/post-job" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive("/post-job")}`}>
                                                    Post Job
                                                </Link>
                                            </motion.div>
                                        </>
                                    )}
                                    {user.role === 'admin' && (
                                        <motion.div initial="hidden" animate="visible" custom={1} variants={navItemVariants}>
                                            <Link to="/admin" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive("/admin")}`}>
                                                Admin Panel
                                            </Link>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="h-6 w-px bg-slate-200 mx-2"></div>

                                <div className="flex items-center gap-3 pl-2">
                                    <div className="text-right hidden lg:block">
                                        <p className="text-sm font-semibold text-slate-800 leading-none">{user.name}</p>
                                        <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleLogout}
                                        className="btn bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 shadow-none"
                                    >
                                        Logout
                                    </motion.button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-slate-600 hover:text-primary font-medium text-sm px-3 py-2">
                                    Login
                                </Link>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link to="/register" className="btn btn-primary shadow-lg shadow-primary/20">
                                        Register Now
                                    </Link>
                                </motion.div>
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
                        className="md:hidden border-t border-slate-100 bg-white absolute w-full shadow-lg overflow-hidden"
                    >
                        <div className="p-4 space-y-2">
                            <Link to="/" className={`block px-4 py-3 rounded-lg text-base font-medium ${isActive("/")}`} onClick={() => setIsMenuOpen(false)}>
                                Find Jobs
                            </Link>
                            {user ? (
                                <>
                                    {user.role === 'user' && (
                                        <Link to="/user" className={`block px-4 py-3 rounded-lg text-base font-medium ${isActive("/user")}`} onClick={() => setIsMenuOpen(false)}>
                                            Dashboard
                                        </Link>
                                    )}
                                    {user.role === 'recruiter' && (
                                        <>
                                            <Link to="/recruiter" className={`block px-4 py-3 rounded-lg text-base font-medium ${isActive("/recruiter")}`} onClick={() => setIsMenuOpen(false)}>
                                                Recruiter Dashboard
                                            </Link>
                                            <Link to="/post-job" className={`block px-4 py-3 rounded-lg text-base font-medium ${isActive("/post-job")}`} onClick={() => setIsMenuOpen(false)}>
                                                Post Job
                                            </Link>
                                        </>
                                    )}
                                    {user.role === 'admin' && (
                                        <Link to="/admin" className={`block px-4 py-3 rounded-lg text-base font-medium ${isActive("/admin")}`} onClick={() => setIsMenuOpen(false)}>
                                            Admin
                                        </Link>
                                    )}
                                    <div className="border-t border-slate-100 my-2 pt-2">
                                        <div className="px-4 py-2">
                                            <p className="font-semibold text-slate-800">{user.name}</p>
                                            <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                                        </div>
                                        <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium">
                                            Logout
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <Link to="/login" className="btn btn-secondary justify-center" onClick={() => setIsMenuOpen(false)}>
                                        Login
                                    </Link>
                                    <Link to="/register" className="btn btn-primary justify-center" onClick={() => setIsMenuOpen(false)}>
                                        Register
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
