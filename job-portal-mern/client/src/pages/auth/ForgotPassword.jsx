import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage(null);

        try {
            const res = await API.post("/auth/forgot-password", { email });
            setMessage(res.data.data); // Backend returns { success: true, data: "Email sent" }
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="card max-w-md w-full p-8 bg-white shadow-xl rounded-2xl fade-in">
                <h2 className="text-3xl font-bold text-center text-slate-800 mb-2">Forgot Password?</h2>
                <p className="text-center text-slate-500 mb-8">Enter your email to receive a reset link.</p>

                {message ? (
                    <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg text-center">
                        <p className="font-semibold mb-2">Success!</p>
                        <p className="text-sm">{message}</p>
                        <div className="mt-4">
                            <span className="text-sm text-slate-500">Didn't receive it? </span>
                            <button onClick={handleSubmit} className="text-primary hover:underline text-sm font-medium">Resend</button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && <div className="bg-red-50 text-red-600 p-3 rounded text-sm text-center border border-red-100">{error}</div>}

                        <div>
                            <label className="label">Email Address</label>
                            <input
                                type="email"
                                className="input"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full py-3 shadow-lg shadow-primary/25"
                            disabled={loading}
                        >
                            {loading ? "Sending Link..." : "Send Reset Link"}
                        </button>
                    </form>
                )}

                <div className="mt-8 text-center text-sm">
                    <Link to="/login" className="text-slate-500 hover:text-primary transition-colors flex items-center justify-center gap-1">
                        <span>←</span> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
