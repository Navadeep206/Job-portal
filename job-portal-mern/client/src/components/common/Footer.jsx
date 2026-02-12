import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="bg-white border-t border-slate-200 mt-auto">
            <div className="container py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link to="/" className="text-xl font-bold text-primary mb-4 block">
                            JobPortal
                        </Link>
                        <p className="text-slate-500 text-sm">
                            Connecting talented professionals with the best companies. Find your dream job today.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-slate-800 mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><Link to="/" className="hover:text-primary transition-colors">Find Jobs</Link></li>
                            <li><Link to="/companies" className="hover:text-primary transition-colors">Browse Companies</Link></li>
                            <li><Link to="/salary" className="hover:text-primary transition-colors">Salary Guide</Link></li>
                        </ul>
                    </div>

                    {/* For Candidates */}
                    <div>
                        <h4 className="font-bold text-slate-800 mb-4">For Candidates</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><Link to="/login" className="hover:text-primary transition-colors">Login</Link></li>
                            <li><Link to="/register" className="hover:text-primary transition-colors">Register</Link></li>
                            <li><Link to="/user" className="hover:text-primary transition-colors">Dashboard</Link></li>
                        </ul>
                    </div>

                    {/* For Employers */}
                    <div>
                        <h4 className="font-bold text-slate-800 mb-4">For Employers</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><Link to="/post-job" className="hover:text-primary transition-colors">Post a Job</Link></li>
                            <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                            <li><Link to="/recruiter" className="hover:text-primary transition-colors">Recruiter Dashboard</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-100 mt-8 pt-8 text-center text-sm text-slate-500">
                    <p>© {new Date().getFullYear()} JobPortal. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
