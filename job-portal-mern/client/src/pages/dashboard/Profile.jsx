import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

function Profile() {
    const { user, login } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "",
        password: "",
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

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
            });
            if (user.avatar) {
                setPreview(user.avatar);
            }
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        const data = new FormData();
        data.append("name", formData.name);
        if (formData.password) data.append("password", formData.password);
        if (file) data.append("avatar", file);

        try {
            const res = await api.put("/users/profile", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setMessage("Profile updated successfully!");
            // Update local user context
            login(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-10 fade-in">
            <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-slate-800 border-b border-slate-100 pb-4">Edit Profile</h2>

                {message && (
                    <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 p-4 rounded-xl mb-6 flex items-center gap-2">
                        <span>✅</span> {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-2">
                        <span>⚠️</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="mb-8 flex justify-center">
                        <div className="relative group">
                            <div className="relative inline-block">
                                <img
                                    src={preview || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg ring-2 ring-slate-100"
                                />
                                <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-indigo-700 transition-colors transform hover:scale-110">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                                    </svg>
                                    <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
                                </label>
                            </div>
                        </div>
                    </div>

                    <Input
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Input
                                label="Email Address"
                                name="email"
                                value={formData.email}
                                disabled
                                className="bg-slate-50 cursor-not-allowed text-slate-500"
                            />
                            <p className="text-xs text-slate-400 mt-1 ml-1">Email cannot be changed.</p>
                        </div>

                        <Input
                            label="Role"
                            name="role"
                            value={formData.role}
                            disabled
                            className="bg-slate-50 cursor-not-allowed text-slate-500 capitalize"
                        />
                    </div>

                    <Input
                        label="New Password (Leave blank to keep current)"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                    />

                    <div className="pt-4 border-t border-slate-100 mt-6">
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={loading}
                            className="w-full shadow-lg shadow-primary/20"
                        >
                            {loading ? "Updating Profile..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}

export default Profile;
