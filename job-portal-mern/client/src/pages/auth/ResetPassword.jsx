import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../../services/api";

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // Backend expects PUT /auth/reset-password/:token
            await API.put(`/auth/reset-password/${token}`, { password });
            setSuccess(true);
            // Optional: Redirect after few seconds
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reset password. Link might be expired.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="card max-w-md w-full p-8 bg-white shadow-xl rounded-2xl fade-in text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                        ✓
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Password Reset Successful!</h2>
                    <p className="text-slate-500 mb-6">You can now login with your new password.</p>
                    <Link to="/login" className="btn btn-primary w-full">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="card max-w-md w-full p-8 bg-white shadow-xl rounded-2xl fade-in">
                <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Set New Password</h2>
                <p className="text-center text-slate-500 mb-8">Please enter a new password for your account.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <div className="bg-red-50 text-red-600 p-3 rounded text-sm text-center border border-red-100">{error}</div>}

                    <div>
                        <label className="label">New Password</label>
                        <input
                            type="password"
                            className="input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    <div>
                        <label className="label">Confirm New Password</label>
                        <input
                            type="password"
                            className="input"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full py-3 shadow-lg shadow-primary/25"
                        disabled={loading}
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;
