import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("LOGIN: Submit button clicked");
    console.log("LOGIN: Form data:", { email, password });
    setError("");
    try {
      console.log("LOGIN: Sending request to /auth/login...");
      const res = await API.post("/auth/login", { email, password });
      console.log("LOGIN: Response received:", res);
      login(res.data);
      navigate("/");
    } catch (err) {
      console.error("Login Error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please check your network or try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center" style={{ minHeight: "80vh" }}>
      <div className="card fade-in" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 className="mb-4 text-center">Welcome Back</h2>
        <p className="text-center mb-4">Login to access your account</p>

        {error && <div className="badge badge-error mb-4 w-full text-center p-2">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="label" htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              className="input"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="mb-4">
            <label className="label" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              className="input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button className="btn btn-primary w-full" style={{ width: "100%" }}>Login</button>
        </form>

        <p className="mt-4 text-center text-sm">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
