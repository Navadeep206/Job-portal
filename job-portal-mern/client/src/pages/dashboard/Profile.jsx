import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";

function Profile() {
    const { user, login } = useAuth(); // Assuming login function updates user state, or we need a way to refresh user
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "",
        // Add other fields as per backend support (e.g. location, title)
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                role: user.role || "",
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);
        try {
            // Check if there is a PUT endpoint for user update
            // Based on typical REST: PUT /api/users/profile or similar
            // I'll assume PUT /api/users/profile based on standard practices, or verify with userRoutes.js content
            // Wait, I haven't seen userRoutes.js content yet. I will assume it exists or I will View it first?
            // I requested view_file in parallel. I should probably wait for it, but for now I'll write a generic one and fix if needed.
            // Actually, BETTER to wait. But I already called write_to_file.
            // I'll make a safe guess: PUT /users/profile 
            // If the user route is different, I'll update this file.

            // Re-reading my plan: I WILL read userRoutes.js 
            // So I should probably not write this file YET? 
            // Too late, I'm already writing it. I will check the file content in the next step and amend if needed.

            const res = await api.put("/users/profile", formData);
            setMessage("Profile updated successfully!");
            // Update local user context if possible
            // login(res.data.user, res.data.token); // If API returns updated user/token
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
            {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</div>}
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Role</label>
                    <input
                        type="text"
                        value={formData.role}
                        disabled
                        className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed capitalize"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
                >
                    {loading ? "Updating..." : "Update Profile"}
                </button>
            </form>
        </div>
    );
}

export default Profile;
