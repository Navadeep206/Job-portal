import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/ui/Button";

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
            alert("Only candidates can apply for jobs.");
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

            await API.post("/applications/apply", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            alert("Application Submitted Successfully!");
            navigate("/user"); // Redirect to My Applications
        } catch (err) {
            console.error("Application failed", err);
            alert(err.response?.data?.message || "Failed to submit application");
        } finally {
            setApplying(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this job?")) return;

        try {
            await API.delete(`/jobs/${id}`);
            alert("Job deleted successfully");
            navigate("/recruiter"); // Redirect to dashboard
        } catch (err) {
            console.error("Failed to delete job", err);
            alert(err.response?.data?.message || "Failed to delete job");
        }
    };

    if (loading) return <div className="text-center p-10">Loading job details...</div>;
    if (error || !job) return <div className="text-center p-10 text-red-500">{error || "Job not found"}</div>;

    const isOwner = user && job && user._id === job.postedBy?._id;
    const isAdmin = user && user.role === 'admin';
    const canEdit = isOwner || isAdmin;

    return (
        <div className="max-w-4xl mx-auto mt-10 animate-fade-in relative px-4">
            <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="mb-6 pl-0 hover:bg-transparent hover:text-primary gap-2"
            >
                ← Back to Jobs
            </Button>

            <div className="glass rounded-2xl p-8 border border-white/20 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{job.title}</h1>
                        <p className="text-xl text-primary font-medium">{job.company}</p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                        {job.type && <span className="px-4 py-1.5 rounded-full bg-indigo-50 text-primary font-semibold text-sm border border-indigo-100">{job.type}</span>}
                        {canEdit && (
                            <div className="flex gap-2">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => navigate(`/edit-job/${id}`)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="danger" // Assuming Button supports 'danger' or use className
                                    size="sm"
                                    className="bg-red-50 text-red-600 hover:bg-red-100 border-red-100" // Override if no danger variant
                                    onClick={handleDelete}
                                >
                                    Delete
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="relative z-10 flex flex-wrap gap-3 mb-8 text-sm text-slate-600 border-b border-slate-100 pb-8">
                    {job.location && <span className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 flex items-center gap-1">📍 {job.location}</span>}
                    {job.salary && <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-100 flex items-center gap-1">💰 ${job.salary.toLocaleString()}</span>}
                    {job.experience && <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-100 flex items-center gap-1">🎓 {job.experience}</span>}
                    <span className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 flex items-center gap-1">🕒 Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="grid gap-8 relative z-10">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <span className="w-1 h-6 bg-primary rounded-full"></span>
                            Job Description
                        </h3>
                        <p className="text-slate-600 leading-relaxed whitespace-pre-line">{job.description}</p>
                    </div>

                    {job.requirements && (
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                                <span className="w-1 h-6 bg-secondary rounded-full"></span>
                                Requirements
                            </h3>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-line">{job.requirements}</p>
                        </div>
                    )}

                    {job.about && (
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                                <span className="w-1 h-6 bg-slate-400 rounded-full"></span>
                                About the Company
                            </h3>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-line">{job.about}</p>
                        </div>
                    )}
                </div>

                <div className="mt-10 pt-8 border-t border-slate-100 relative z-10">
                    {user?.role === 'recruiter' || user?.role === 'admin' ? (
                        <div className="flex justify-end">
                            <Button disabled variant="secondary" className="opacity-70">
                                {user.role === 'admin' ? 'Admin View' : 'Recruiters Cannot Apply'}
                            </Button>
                        </div>
                    ) : (
                        <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-200/50">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Apply for this Position</h3>
                            <form onSubmit={handleApply} className="flex flex-col md:flex-row gap-4 items-end">
                                <div className="flex-1 w-full">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Upload Resume (PDF/DOC)</label>
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        className="block w-full text-sm text-slate-500
                                            file:mr-4 file:py-2.5 file:px-4
                                            file:rounded-xl file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-indigo-50 file:text-primary
                                            hover:file:bg-indigo-100
                                            transition-colors cursor-pointer"
                                        onChange={(e) => setResume(e.target.files[0])}
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    className="w-full md:w-auto shadow-lg shadow-primary/25"
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
