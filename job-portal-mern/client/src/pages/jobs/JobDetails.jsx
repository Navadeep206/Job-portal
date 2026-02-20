import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/ui/Button";
import { MapPin, DollarSign, GraduationCap, Calendar, ArrowLeft, Trash2, Edit } from 'lucide-react';

function JobDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [error, setError] = useState("");

    const [resume, setResume] = useState(null);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await API.get(`/jobs/${id}`);
                setJob(res.data.job);
            } catch (err) {
                console.error("Failed to fetch job details", err);
                setError("Job not found");
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const handleApply = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate("/login");
            return;
        }
        if (user.role !== "user") {
            // alert("Only candidates can apply for jobs."); 
            return;
        }

        if (!resume) {
            alert("Please upload your resume (PDF/Doc).");
            return;
        }

        setApplying(true);
        try {
            const formData = new FormData();
            formData.append("jobId", job._id);
            formData.append("resume", resume);

            console.log("Submitting application for Job ID:", job._id);
            console.log("Resume file:", resume);

            const res = await API.post("/applications/apply", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                timeout: 30000 // 30 second timeout
            });

            // alert("Application Submitted Successfully!"); 
            // Better UX: Show modal or toast, but for now navigate with state or just navigate
            alert(res.data.message || "Application Submitted Successfully!");
            navigate("/user");
        } catch (err) {
            console.error("Application failed", err);
            const errorMsg = err.response?.data?.message || err.message || "Failed to submit application";
            alert(`Error: ${errorMsg}`);

            // If already applied, redirect to dashboard so they can see it
            if (err.response?.status === 400 && errorMsg.toLowerCase().includes("already applied")) {
                navigate("/user");
            }
        } finally {
            setApplying(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this job?")) return;

        try {
            await API.delete(`/jobs/${id}`);
            alert("Job deleted successfully");
            navigate("/recruiter");
        } catch (err) {
            console.error("Failed to delete job", err);
            alert(err.response?.data?.message || "Failed to delete job");
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    if (error || !job) return (
        <div className="text-center p-10 text-red-500 dark:text-red-400">
            <p className="text-xl font-bold">{error || "Job not found"}</p>
            <Button variant="ghost" onClick={() => navigate("/jobs")} className="mt-4">Back to Jobs</Button>
        </div>
    );

    const isOwner = user && job && user._id === job.postedBy?._id;
    const isAdmin = user && user.role === 'admin';
    const canEdit = isOwner || isAdmin;

    return (
        <div className="max-w-4xl mx-auto mt-10 animate-fade-in relative px-4 pb-20">
            <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="mb-6 pl-0 hover:bg-transparent hover:text-primary gap-2 text-slate-500 dark:text-slate-400"
            >
                <ArrowLeft size={18} /> Back to Jobs
            </Button>

            <div className="glass rounded-3xl p-8 md:p-10 border border-white/20 dark:border-slate-700/50 shadow-2xl relative overflow-hidden bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start mb-8 gap-6 border-b border-slate-100 dark:border-slate-700/50 pb-8">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-bold font-display text-slate-900 dark:text-white mb-2 leading-tight">{job.title}</h1>
                        <p className="text-xl text-primary font-medium">{job.company}</p>
                    </div>
                    <div className="flex flex-col items-end gap-3 min-w-max">
                        {job.type && <span className="px-4 py-1.5 rounded-full bg-indigo-50 text-primary font-semibold text-sm border border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800/50">{job.type}</span>}
                        {canEdit && (
                            <div className="flex gap-2">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => navigate(`/edit-job/${id}`)}
                                    className="flex items-center gap-2"
                                >
                                    <Edit size={14} /> Edit
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    className="bg-red-50 text-red-600 hover:bg-red-100 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/30 flex items-center gap-2"
                                    onClick={handleDelete}
                                >
                                    <Trash2 size={14} /> Delete
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="relative z-10 flex flex-wrap gap-3 mb-10 text-sm font-medium">
                    {job.location && (
                        <span className="bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center gap-2">
                            <MapPin size={16} className="text-slate-400" /> {job.location}
                        </span>
                    )}
                    {job.salary && (
                        <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 px-4 py-2 rounded-xl border border-emerald-100 dark:border-emerald-800/50 flex items-center gap-2">
                            <DollarSign size={16} className="text-emerald-500" /> {job.salary.toLocaleString()}
                        </span>
                    )}
                    {job.experience && (
                        <span className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 px-4 py-2 rounded-xl border border-blue-100 dark:border-blue-800/50 flex items-center gap-2">
                            <GraduationCap size={16} className="text-blue-500" /> {job.experience}
                        </span>
                    )}
                    <span className="bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center gap-2">
                        <Calendar size={16} className="text-slate-400" /> Posted {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                </div>

                <div className="grid gap-10 relative z-10">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3 font-display">
                            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                            Job Description
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line text-lg">
                            {job.description}
                        </p>
                    </div>

                    {job.requirements && (
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3 font-display">
                                <span className="w-1.5 h-6 bg-secondary rounded-full"></span>
                                Requirements
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line text-lg">
                                {job.requirements}
                            </p>
                        </div>
                    )}

                    {job.about && (
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3 font-display">
                                <span className="w-1.5 h-6 bg-slate-400 rounded-full"></span>
                                About the Company
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line text-lg">
                                {job.about}
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-700/50 relative z-10">
                    {user?.role === 'recruiter' || user?.role === 'admin' ? (
                        <div className="flex justify-end">
                            <Button disabled variant="secondary" className="opacity-70 dark:bg-slate-800 dark:text-slate-400">
                                {user.role === 'admin' ? 'Admin View' : 'Recruiters Cannot Apply'}
                            </Button>
                        </div>
                    ) : (
                        <div className="bg-slate-50/50 dark:bg-slate-800/50 p-6 md:p-8 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Apply for this Position</h3>
                            <form onSubmit={handleApply} className="flex flex-col md:flex-row gap-6 items-end">
                                <div className="flex-1 w-full">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Upload Resume (PDF/DOC)</label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            className="block w-full text-sm text-slate-500 dark:text-slate-400
                                                file:mr-4 file:py-3 file:px-6
                                                file:rounded-xl file:border-0
                                                file:text-sm file:font-bold
                                                file:bg-indigo-50 file:text-primary
                                                dark:file:bg-indigo-900/20 dark:file:text-indigo-300
                                                hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900/40
                                                transition-colors cursor-pointer
                                                bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-1"
                                            onChange={(e) => setResume(e.target.files[0])}
                                            required
                                        />
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    className="w-full md:w-auto shadow-xl shadow-primary/25 h-[52px]"
                                    isLoading={applying}
                                >
                                    {applying ? "Submitting..." : "Submit Application"}
                                </Button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default JobDetails;
