import { useEffect, useState } from "react";
import API from "../../services/api";

function Applicants() {
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const res = await API.get("/applications/job-applicants");
                setApplicants(res.data.data || []);
            } catch (err) {
                console.error("Failed to fetch applicants", err);
            } finally {
                setLoading(false);
            }
        };
        fetchApplicants();
    }, []);

    const handleStatusUpdate = async (appId, newStatus) => {
        try {
            const res = await API.put(`/applications/${appId}/status`, { status: newStatus });
            if (res.data.success) {
                setApplicants((prevApps) =>
                    prevApps.map((app) =>
                        app._id === appId ? { ...app, status: newStatus } : app
                    )
                );
            }
        } catch (err) {
            console.error("Failed to update status", err);
            alert("Failed to update status");
        }
    };

    if (loading) return <div className="text-center p-10">Loading applicants...</div>;

    const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5005/api").replace('/api', '');

    return (
        <div className="fade-in space-y-6">
            <h2 className="text-2xl font-bold mb-4 text-slate-800">Job Applicants</h2>

            {applicants.length === 0 ? (
                <div className="text-center p-10 bg-white rounded-lg shadow border border-slate-200">
                    <p className="text-slate-500">No applicants found for your jobs yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {applicants.map((app) => (
                        <div key={app._id} className="card bg-white hover:shadow-md transition-all border border-slate-200">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800">{app.applicant?.name || "Unknown Candidate"}</h3>
                                    <p className="text-sm text-slate-500">{app.applicant?.email}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`badge ${app.status === 'accepted' ? 'badge-success' : app.status === 'rejected' ? 'badge-error' : 'badge-warning'}`}>
                                        {app.status}
                                    </span>
                                    {String(app.status).toLowerCase().trim() === 'pending' && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleStatusUpdate(app._id, 'accepted')}
                                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                                title="Accept"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(app._id, 'rejected')}
                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                                title="Reject"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2 mb-4">
                                <p className="text-sm"><span className="font-medium">Applied For:</span> {app.job?.title || "Unknown Job"}</p>
                                <p className="text-xs text-slate-400">Date: {new Date(app.createdAt).toLocaleDateString()}</p>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex gap-2">
                                {app.resume ? (
                                    <a
                                        href={app.resume.startsWith("http") ? app.resume : `${API_BASE}${app.resume}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary flex-1 text-center py-2 text-sm"
                                    >
                                        📄 View Resume
                                    </a>
                                ) : (
                                    <span className="btn btn-secondary flex-1 text-center py-2 text-sm disabled cursor-not-allowed opacity-50">No Resume</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Applicants;
