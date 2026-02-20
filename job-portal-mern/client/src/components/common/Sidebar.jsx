import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { motion } from "framer-motion";
import {
    FileText, Search, Bookmark, Bell, Settings,
    LayoutDashboard, PenSquare, Users, Briefcase,
    PieChart, UserCircle
} from 'lucide-react';

function Sidebar() {
    const { user } = useAuth();
    const location = useLocation();

    // Helper to determine active style
    const isActive = (path) => {
        return location.pathname === path
            ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100";
    };

    if (!user) return null;

    const navLinks = {
        user: [
            { path: "/user", label: "My Applications", icon: <FileText size={20} /> },
            { path: "/", label: "Find Jobs", icon: <Search size={20} /> },
            { path: "/saved-jobs", label: "Saved Jobs", icon: <Bookmark size={20} /> },
            { path: "/job-alerts", label: "Job Alerts", icon: <Bell size={20} /> },
            { path: "/profile", label: "Edit Profile", icon: <Settings size={20} /> },
        ],
        recruiter: [
            { path: "/recruiter", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
            { path: "/post-job", label: "Post a Job", icon: <PenSquare size={20} /> },
            { path: "/applicants", label: "Applicants", icon: <Users size={20} /> },
            { path: "/profile", label: "Profile", icon: <UserCircle size={20} /> },
        ],
        admin: [
            { path: "/admin", label: "Overview", icon: <PieChart size={20} /> },
            { path: "/admin/users", label: "Manage Users", icon: <Users size={20} /> },
            { path: "/admin/jobs", label: "Manage Jobs", icon: <Briefcase size={20} /> },
            { path: "/profile", label: "Profile", icon: <Settings size={20} /> },
        ]
    };

    const links = navLinks[user.role] || [];

    return (
        <aside className="w-64 bg-surface dark:bg-slate-900 h-screen border-r border-slate-200 dark:border-slate-800 fixed left-0 top-0 pt-20 hidden md:flex flex-col z-30 transition-colors duration-300">
            <div className="px-4 pb-6 flex-1 overflow-y-auto custom-scrollbar">
                <div className="mb-6 px-2">
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        {user.role} Workspace
                    </p>
                </div>

                <nav className="flex flex-col gap-1">
                    {links.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`px-4 py-3 mx-2 rounded-xl transition-all duration-200 font-medium flex items-center gap-3 group relative ${isActive(link.path)}`}
                        >
                            <span className="text-lg opacity-80 group-hover:scale-110 transition-transform flex items-center justify-center">{link.icon}</span>
                            <span>{link.label}</span>
                            {location.pathname === link.path && (
                                <motion.div
                                    layoutId="sidebar-active"
                                    className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-xl -z-10 border-l-4 border-primary"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm">
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-primary-light text-white flex items-center justify-center font-bold text-lg shadow-md shadow-primary/20">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                        <p className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user.role}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
