import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Select from "../../components/ui/Select";
import { AlertTriangle } from 'lucide-react';


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

    const jobTypes = [
        { value: "Full-time", label: "Full-time" },
        { value: "Part-time", label: "Part-time" },
        { value: "Contract", label: "Contract" },
        { value: "Internship", label: "Internship" },
        { value: "Remote", label: "Remote" },
    ];

    const experienceLevels = [
        { value: "Entry Level", label: "Entry Level" },
        { value: "Mid Level", label: "Mid Level" },
        { value: "Senior Level", label: "Senior Level" },
        { value: "Director", label: "Director" },
        { value: "Executive", label: "Executive" },
    ];

    return (
        <div className="max-w-4xl mx-auto fade-in py-10 px-4">
            <Card className="p-8 border-slate-200 shadow-lg dark:border-slate-700">
                <div className="mb-8 border-b border-slate-100 dark:border-slate-700 pb-4">
                    <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white">Post a New Job</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Fill in the details to find your next great hire.</p>
                </div>



                // ...

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl mb-8 flex items-center gap-3">
                        <AlertTriangle size={20} />
                        <span className="font-medium">{error}</span>
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

                        <Select
                            label="Job Type"
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                            options={jobTypes}
                        />

                        <Select
                            label="Experience Level"
                            name="experience"
                            value={form.experience}
                            onChange={handleChange}
                            required
                            placeholder="Select Level"
                            options={experienceLevels}
                        />
                    </div>

                    <Input
                        label="Salary Range (Optional)"
                        name="salary"
                        placeholder="e.g. $100k - $120k or Competitive"
                        value={form.salary}
                        onChange={handleChange}
                    />

                    <div className="space-y-6">
                        <Input
                            type="textarea"
                            label="About Company (Short Bio)"
                            name="about"
                            value={form.about}
                            onChange={handleChange}
                            required
                            className="min-h-[100px]"
                        />

                        <Input
                            type="textarea"
                            label="Job Description"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            required
                            className="min-h-[150px]"
                        />

                        <Input
                            type="textarea"
                            label="Requirements"
                            name="requirements"
                            value={form.requirements}
                            onChange={handleChange}
                            required
                            className="min-h-[100px]"
                        />
                    </div>

                    <div className="flex justify-end gap-4 pt-8 border-t border-slate-100 dark:border-slate-700">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => navigate("/recruiter")}
                            className="hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={loading}
                            className="px-8 shadow-xl shadow-primary/20 hover:shadow-primary/30"
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
