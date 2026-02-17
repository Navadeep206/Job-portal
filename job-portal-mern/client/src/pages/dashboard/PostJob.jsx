import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

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
            await API.post("/jobs", form);
            navigate("/recruiter");
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to post job. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto fade-in py-10">
            <Card className="p-8">
                <div className="mb-8 border-b border-slate-100 pb-4">
                    <h2 className="text-2xl font-bold text-slate-800">Post a New Job</h2>
                    <p className="text-slate-500 mt-1">Fill in the details to find your next great hire.</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-2">
                        <span>⚠️</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Job Title"
                            name="title"
                            placeholder="e.g. Senior React Developer"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Company Name"
                            name="company"
                            placeholder="e.g. Tech Corp"
                            value={form.company}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Input
                            label="Location"
                            name="location"
                            placeholder="e.g. Remote, San Francisco"
                            value={form.location}
                            onChange={handleChange}
                            required
                        />

                        <div className="relative mb-4">
                            <select
                                className="input-field peer"
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
                            <label className="absolute left-3 top-0 text-xs text-primary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary">
                                Job Type
                            </label>
                        </div>

                        <div className="relative mb-4">
                            <select
                                className="input-field peer"
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
                            <label className="absolute left-3 top-0 text-xs text-primary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary">
                                Experience Level
                            </label>
                        </div>
                    </div>

                    <Input
                        label="Salary Range (Optional)"
                        name="salary"
                        placeholder="e.g. $100k - $120k or Competitive"
                        value={form.salary}
                        onChange={handleChange}
                    />

                    <div className="space-y-4">
                        <div className="relative">
                            <textarea
                                className="input-field peer min-h-[100px] pt-6"
                                name="about"
                                placeholder=" "
                                value={form.about}
                                onChange={handleChange}
                                required
                            />
                            <label className="absolute left-3 top-2 text-xs text-primary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary">
                                About Company (Short Bio)
                            </label>
                        </div>

                        <div className="relative">
                            <textarea
                                className="input-field peer min-h-[150px] pt-6"
                                name="description"
                                placeholder=" "
                                value={form.description}
                                onChange={handleChange}
                                required
                            />
                            <label className="absolute left-3 top-2 text-xs text-primary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary">
                                Job Description
                            </label>
                        </div>

                        <div className="relative">
                            <textarea
                                className="input-field peer min-h-[100px] pt-6"
                                name="requirements"
                                placeholder=" "
                                value={form.requirements}
                                onChange={handleChange}
                                required
                            />
                            <label className="absolute left-3 top-2 text-xs text-primary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary">
                                Requirements
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => navigate("/recruiter")}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={loading}
                            className="px-8 shadow-lg shadow-primary/20"
                        >
                            Post Job
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}

export default PostJob;
