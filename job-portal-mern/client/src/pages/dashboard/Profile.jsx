import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { CheckCircle, AlertTriangle } from 'lucide-react';

function Profile() {
    const { user, login } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "",
        password: "",
        title: "",
        bio: "",
        location: "",
        skills: "",
    });

    const [experience, setExperience] = useState([]);
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [resumeFile, setResumeFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                role: user.role || "",
                password: "",
                title: user.title || "",
                bio: user.bio || "",
                location: user.location || "",
                skills: user.skills ? user.skills.join(", ") : "",
            });
            if (user.avatar) {
                setAvatarPreview(user.avatar);
            }
            if (user.experience) {
                setExperience(user.experience);
            }
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAvatarChange = (e) => {
        const selectedFile = e.target.files[0];
        setAvatarFile(selectedFile);
        if (selectedFile) {
            setAvatarPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleResumeChange = (e) => {
        const selectedFile = e.target.files[0];
        setResumeFile(selectedFile);
    };

    const addExperience = () => {
        setExperience([...experience, { title: "", company: "", period: "", description: "" }]);
    };

    const removeExperience = (index) => {
        const newExp = [...experience];
        newExp.splice(index, 1);
        setExperience(newExp);
    };

    const handleExperienceChange = (index, field, value) => {
        const newExp = [...experience];
        newExp[index][field] = value;
        setExperience(newExp);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        const data = new FormData();
        data.append("name", formData.name);
        data.append("title", formData.title);
        data.append("bio", formData.bio);
        data.append("location", formData.location);
        data.append("skills", formData.skills);
        data.append("experience", JSON.stringify(experience));

        if (formData.password) data.append("password", formData.password);
        if (avatarFile) data.append("avatar", avatarFile);
        if (resumeFile) data.append("resume", resumeFile);

        try {
            const res = await api.put("/users/profile", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setMessage("Profile updated successfully!");
            login(res.data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10 fade-in px-4">
            <Card className="p-8 border-slate-200 shadow-xl dark:border-slate-700">
                <h2 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-4 font-display">Edit Profile</h2>



                {message && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl mb-6 flex items-center gap-2">
                        <CheckCircle size={20} /> {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 flex items-center gap-2">
                        <AlertTriangle size={20} /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative group">
                            <div className="relative inline-block">
                                <img
                                    src={avatarPreview || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-lg ring-2 ring-slate-100 dark:ring-slate-700"
                                    onError={(e) => e.target.src = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                                />
                                <label className="absolute bottom-0 right-0 bg-primary text-white p-2.5 rounded-full cursor-pointer shadow-lg hover:bg-primary-hover transition-all transform hover:scale-110 border-2 border-white dark:border-slate-800">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                                    </svg>
                                    <input type="file" onChange={handleAvatarChange} className="hidden" accept="image/*" />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
                        <Input label="Professional Title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Senior Frontend Developer" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Email Address" name="email" value={formData.email} disabled className="bg-slate-50 dark:bg-slate-800/50 cursor-not-allowed text-slate-500" />
                        <Input label="Location" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. New York, USA" />
                    </div>

                    <Input label="Bio" type="textarea" name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell us about yourself..." className="min-h-[100px]" />

                    <Input label="Skills (Comma separated)" name="skills" value={formData.skills} onChange={handleChange} placeholder="React, Node.js, TypeScript, TailwindCSS" />

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Resume / CV</label>
                        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
                            <label className="flex items-center justify-center px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 cursor-pointer transition-colors">
                                <span>Choose File</span>
                                <input type="file" name="resume" onChange={handleResumeChange} className="hidden" accept=".pdf,.doc,.docx" />
                            </label>
                            <div className="flex-1">
                                <span className="text-sm text-slate-500 dark:text-slate-400 block truncate">
                                    {resumeFile ? resumeFile.name : (user?.resume ? "Resume uploaded" : "No resume uploaded")}
                                </span>
                            </div>
                            {user?.resume && (
                                <a href={user.resume} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline whitespace-nowrap">
                                    View Current
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Experience Section */}
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white font-display">Experience</h3>
                            <Button type="button" variant="outline" size="sm" onClick={addExperience}>+ Add Experience</Button>
                        </div>

                        <div className="space-y-4">
                            {experience.map((exp, index) => (
                                <div key={index} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 relative group transition-all hover:shadow-md">
                                    <button
                                        type="button"
                                        onClick={() => removeExperience(index)}
                                        className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                        title="Remove Experience"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                                        </svg>
                                    </button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <Input placeholder="Job Title" value={exp.title} onChange={(e) => handleExperienceChange(index, "title", e.target.value)} />
                                        <Input placeholder="Company" value={exp.company} onChange={(e) => handleExperienceChange(index, "company", e.target.value)} />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <Input placeholder="Period (e.g. 2020 - 2022)" value={exp.period} onChange={(e) => handleExperienceChange(index, "period", e.target.value)} />
                                    </div>
                                    <Input type="textarea" placeholder="Description of your role and achievements..." value={exp.description} onChange={(e) => handleExperienceChange(index, "description", e.target.value)} className="min-h-[80px]" />
                                </div>
                            ))}
                            {experience.length === 0 && (
                                <div className="text-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-slate-400">
                                    <p>No experience added yet. Add your work history to stand out.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-slate-700 mt-6">
                        <Input label="Change Password (Optional)" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" />
                    </div>

                    <div className="pt-4 mt-6">
                        <Button type="submit" variant="primary" isLoading={loading} className="w-full shadow-xl shadow-primary/20 hover:shadow-primary/30">
                            {loading ? "Updating Profile..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}

export default Profile;

