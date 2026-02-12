import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function PostJob() {
    const [form, setForm] = useState({
        title: "",
        company: "",
        location: "",
        type: "Full-time",
        about: "",
        description: "",
        salary: "",
        requirements: "",
        experience: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Split requirements by comma or newline for array format if backend expects it
            // For now assume backend handles string or string[] logic, but usually it's string.
            // Let's assume standard object sending.
            await API.post("/jobs", form);
            navigate("/recruiter");
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to post job. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto fade-in">
            <div className="card">
                <h2 className="text-2xl font-bold mb-6 text-slate-800 border-b pb-4">Post a New Job</h2>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="label">Job Title</label>
                            <input
                                className="input"
                                name="title"
                                placeholder="e.g. Senior React Developer"
                                value={form.title}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="label">Company Name</label>
                            <input
                                className="input"
                                name="company"
                                placeholder="e.g. Tech Corp"
                                value={form.company}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="label">Location</label>
                            <input
                                className="input"
                                name="location"
                                placeholder="e.g. Remote, San Francisco"
                                value={form.location}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="label">Job Type</label>
                            <select
                                className="input"
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                            >
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Internship">Internship</option>
                                <option value="Remote">Remote</option>
                            </select>
                        </div>
                        <div>
                            <label className="label">Experience Level</label>
                            <select
                                className="input"
                                name="experience"
                                value={form.experience}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Select Level</option>
                                <option value="Entry Level">Entry Level</option>
                                <option value="Mid Level">Mid Level</option>
                                <option value="Senior Level">Senior Level</option>
                                <option value="Director">Director</option>
                                <option value="Executive">Executive</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="label">Salary Range (Optional)</label>
                        <input
                            className="input"
                            name="salary"
                            placeholder="e.g. $100k - $120k or Competitive"
                            value={form.salary}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="label">About Company (Short Bio)</label>
                        <textarea
                            className="input min-h-[80px]"
                            name="about"
                            placeholder="Brief description of your company..."
                            value={form.about}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="label">Job Description</label>
                        <textarea
                            className="input min-h-[150px]"
                            name="description"
                            placeholder="Detailed job responsibilities..."
                            value={form.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="label">Requirements</label>
                        <textarea
                            className="input min-h-[100px]"
                            name="requirements"
                            placeholder="Skills and qualifications needed..."
                            value={form.requirements}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate("/recruiter")}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? "Posting..." : "Post Job"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PostJob;
