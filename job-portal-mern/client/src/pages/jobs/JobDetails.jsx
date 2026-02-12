import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

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

    if (loading) return <div className="text-center p-10">Loading job details...</div>;
    if (error || !job) return <div className="text-center p-10 text-red-500">{error || "Job not found"}</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-slate-200 mt-10 animate-fade-in relative">
            <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-primary mb-6 flex items-center gap-1">
                ← Back to Jobs
            </button>

            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">{job.title}</h1>
                    <p className="text-xl text-slate-600 font-medium">{job.company}</p>
                </div>
                {job.type && <span className="badge badge-primary text-lg px-4 py-2">{job.type}</span>}
            </div>

            <div className="flex flex-wrap gap-4 mb-8 text-sm text-slate-500 border-b border-slate-100 pb-6">
                {job.location && <span className="bg-slate-100 px-3 py-1 rounded-full">📍 {job.location}</span>}
                {job.salary && <span className="bg-slate-100 px-3 py-1 rounded-full">💰 ${job.salary.toLocaleString()}</span>}
                {job.experience && <span className="bg-slate-100 px-3 py-1 rounded-full">🎓 {job.experience}</span>}
                <span className="bg-slate-100 px-3 py-1 rounded-full">🕒 Posted {new Date(job.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Job Description</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{job.description}</p>
            </div>

            {job.requirements && (
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">Requirements</h3>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-line">{job.requirements}</p>
                </div>
            )}

            {job.about && (
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">About the Company</h3>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-line">{job.about}</p>
                </div>
            )}

            <div className="mt-10 pt-6 border-t border-slate-100">
                {user?.role === 'recruiter' || user?.role === 'admin' ? (
                    <div className="flex justify-end">
                        <button disabled className="btn btn-secondary cursor-not-allowed opacity-50">
                            {user.role === 'admin' ? 'Admin View' : 'Recruiters Cannot Apply'}
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleApply} className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Apply for this Position</h3>
                        <div className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-1 w-full">
                                <label className="label">Upload Resume (PDF/DOC)</label>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    className="input bg-white"
                                    onChange={(e) => setResume(e.target.files[0])}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary text-lg px-8 py-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all h-12"
                                disabled={applying}
                            >
                                {applying ? "Submitting..." : "Submit Application"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default JobDetails;
