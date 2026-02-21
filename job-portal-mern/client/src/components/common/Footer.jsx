import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto transition-colors duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link to="/" className="text-xl font-bold text-slate-900 dark:text-white mb-4 block tracking-tight">
                            JobSphere
                        </Link>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                            Connecting talented professionals with the best companies. Find your dream job today.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Quick Links</h4>
                        <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                            <li><Link to="/" className="hover:text-primary dark:hover:text-white transition-colors">Find Jobs</Link></li>
                            <li><Link to="/companies" className="hover:text-primary dark:hover:text-white transition-colors">Browse Companies</Link></li>
                            <li><Link to="/salary" className="hover:text-primary dark:hover:text-white transition-colors">Salary Guide</Link></li>
                        </ul>
                    </div>

                    {/* For Candidates */}
                    <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-4">For Candidates</h4>
                        <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                            <li><Link to="/login" className="hover:text-primary dark:hover:text-white transition-colors">Login</Link></li>
                            <li><Link to="/register" className="hover:text-primary dark:hover:text-white transition-colors">Register</Link></li>
                            <li><Link to="/user" className="hover:text-primary dark:hover:text-white transition-colors">Dashboard</Link></li>
                        </ul>
                    </div>

                    {/* For Employers */}
                    <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-4">For Employers</h4>
                        <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                            <li><Link to="/post-job" className="hover:text-primary dark:hover:text-white transition-colors">Post a Job</Link></li>
                            <li><Link to="/pricing" className="hover:text-primary dark:hover:text-white transition-colors">Pricing</Link></li>
                            <li><Link to="/recruiter" className="hover:text-primary dark:hover:text-white transition-colors">Recruiter Dashboard</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 mt-12 pt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                    <p>© {new Date().getFullYear()} JobSphere. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
