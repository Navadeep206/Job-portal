import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Sidebar() {
    const { user } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? "bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600" : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600";

    if (!user) return null;

    return (
        <aside className="w-64 bg-white h-screen border-r border-slate-200 fixed left-0 top-0 pt-20 hidden md:block">
            <div className="px-6 pb-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                    {user.role} Dashboard
                </h3>

                <nav className="flex flex-col gap-1">
                    {user.role === 'user' && (
                        <>
                            <Link to="/user" className={`px-4 py-3 rounded-md transition-colors font-medium flex items-center gap-3 ${isActive("/user")}`}>
                                My Applications
                            </Link>
                            <Link to="/" className={`px-4 py-3 rounded-md transition-colors font-medium flex items-center gap-3 ${isActive("/")}`}>
                                Find Jobs
                            </Link>
                            <Link to="/profile" className={`px-4 py-3 rounded-md transition-colors font-medium flex items-center gap-3 ${isActive("/profile")}`}>
                                Edit Profile
                            </Link>
                        </>
                    )}

                    {user.role === 'recruiter' && (
                        <>
                            <Link to="/recruiter" className={`px-4 py-3 rounded-md transition-colors font-medium flex items-center gap-3 ${isActive("/recruiter")}`}>
                                Post a Job
                            </Link>
                            <Link to="/my-jobs" className={`px-4 py-3 rounded-md transition-colors font-medium flex items-center gap-3 ${isActive("/my-jobs")}`}>
                                Manage Jobs
                            </Link>
                            <Link to="/applicants" className={`px-4 py-3 rounded-md transition-colors font-medium flex items-center gap-3 ${isActive("/applicants")}`}>
                                Applicants
                            </Link>
                        </>
                    )}

                    {user.role === 'admin' && (
                        <>
                            <Link to="/admin" className={`px-4 py-3 rounded-md transition-colors font-medium flex items-center gap-3 ${isActive("/admin")}`}>
                                Overview
                            </Link>
                            <Link to="/admin/users" className={`px-4 py-3 rounded-md transition-colors font-medium flex items-center gap-3 ${isActive("/admin/users")}`}>
                                Manage Users
                            </Link>
                            <Link to="/admin/jobs" className={`px-4 py-3 rounded-md transition-colors font-medium flex items-center gap-3 ${isActive("/admin/jobs")}`}>
                                Manage Jobs
                            </Link>
                        </>
                    )}
                </nav>
            </div>

            <div className="absolute bottom-0 w-full p-6 border-t border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-bold text-sm text-slate-800">{user.name}</p>
                        <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
